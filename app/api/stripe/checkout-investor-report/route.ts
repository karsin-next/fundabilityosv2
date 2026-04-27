import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { reportId, userId } = await req.json();

    if (!reportId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Investor-Ready Narrative Report",
              description: "Full unwatermarked report, private share link, and downloadable PDF.",
            },
            unit_amount: 900, // $9.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        report_id: reportId,
        user_id: userId,
        payment_type: "investor_report"
      },
      mode: "payment",
      success_url: `${appUrl}/dashboard/report?unlocked=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/report?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe Investor Report Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
