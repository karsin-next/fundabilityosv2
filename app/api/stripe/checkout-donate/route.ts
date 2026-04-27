import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountCents, userId, userEmail, donorName, donorMessage } = body;

    if (!amountCents || amountCents < 100) {
      return NextResponse.json({ error: "Invalid donation amount. Minimum is $1.00." }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://www.nextblaze.asia";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support FundabilityOS",
              description: "A voluntary contribution to help sustain the platform.",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
      customer_email: userEmail || undefined,
      metadata: {
        is_donation: "true",
        user_id: userId || "anonymous",
        donor_name: donorName || "Anonymous",
        donor_message: donorMessage || "",
        source: "dashboard",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Stripe donation checkout error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
