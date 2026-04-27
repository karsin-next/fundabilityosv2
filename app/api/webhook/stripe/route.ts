import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { trackEvent } from "@/lib/analytics";
import { sendTelegramAlert } from "@/lib/telegram";
import { resend } from "@/lib/resend";
import { ReportUnlockedEmail } from "@/components/emails/ReportUnlockedEmail";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed.", errorMsg);
    return NextResponse.json({ error: "Webhook Error: Invalid Signature" }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // 1. Process Donation
    if (session.metadata?.is_donation === "true") {
      try {
        if (!supabaseAdmin) throw new Error("Supabase not configured locally.");
        
        await supabaseAdmin.from("donations").insert({
          user_id: session.metadata.user_id !== "anonymous" ? session.metadata.user_id : null,
          amount_cents: session.amount_total,
          currency: session.currency || "usd",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          donor_name: session.metadata.donor_name || null,
          donor_message: session.metadata.donor_message || null,
        });

        console.log(`Donation of ${session.amount_total} cents recorded.`);
        
        await sendTelegramAlert(`💖 <b>New Donation!</b>\nAmount: $${((session.amount_total || 0) / 100).toFixed(2)}\nFrom: ${session.metadata.donor_name || "Anonymous"}\nMessage: ${session.metadata.donor_message || "None"}`);
        
        return NextResponse.json({ received: true });
      } catch (err) {
        console.error("Donation processing failed", err);
        return NextResponse.json({ error: "Donation fulfillment failed" }, { status: 500 });
      }
    }

    // 2. Process Report Unlock ($29 or $9)
    const reportId = session.metadata?.report_id;
    const userId = session.metadata?.user_id;
    const paymentType = session.metadata?.payment_type;

    if (!reportId) {
      console.error("No report_id in session metadata");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      if (!supabaseAdmin) throw new Error("Supabase not configured locally.");

      const isInvestorReport = paymentType === "investor_report";

      if (isInvestorReport) {
        // Unlock the INVESTOR (Narrative) report
        await supabaseAdmin
          .from("reports")
          .update({ investor_report_unlocked: true, updated_at: new Date().toISOString() })
          .eq("id", reportId);
        
        await supabaseAdmin.from("payments").insert({
          user_id: userId,
          report_id: reportId,
          investor_report_id: reportId,
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          type: "investor_report",
          amount_cents: session.amount_total,
          status: "completed"
        });
      } else {
        // Default logic for the $29 full assessment report
        await supabaseAdmin
          .from("reports")
          .update({ is_unlocked: true, updated_at: new Date().toISOString() })
          .eq("id", reportId);

        await supabaseAdmin.from("payments").insert({
          user_id: userId,
          report_id: reportId,
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          type: "report",
          amount_cents: session.amount_total,
          status: "completed"
        });
      }

      // 3. Trigger Analytics and Notifications
      const amountStr = `$${((session.amount_total || 0) / 100).toFixed(2)}`;
      const reportUrl = isInvestorReport 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/report`
        : `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportId}`;

      await trackEvent("payment_success", { 
        userId: userId, 
        eventData: { amount: session.amount_total, reportId, type: paymentType || "standard_report" } 
      });
      
      await sendTelegramAlert(`💰 <b>New Revenue: ${amountStr}</b>\nType: ${isInvestorReport ? "Investor Narrative" : "Full Assessment"}\n<a href="${reportUrl}">View Report</a>`);

      // 4. Send Email
      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "FundabilityOS <hello@nextblaze.asia>",
          to: customerEmail,
          subject: isInvestorReport ? "Your Investor Narrative is Unlocked" : "Your Investor-Ready Report is Unlocked",
          react: ReportUnlockedEmail({ reportUrl }) as React.ReactElement,
        });
        console.log(`Delivery email sent to ${customerEmail}`);
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("Payment fulfillment failed", err);
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
