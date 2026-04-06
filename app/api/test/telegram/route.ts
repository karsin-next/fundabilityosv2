import { NextResponse } from "next/server";
import { sendTelegramAlert } from "@/lib/telegram";

export const runtime = "nodejs";

// Quick test endpoint — hit this to verify Telegram is wired up correctly
// GET /api/test/telegram
export async function GET() {
  try {
    await sendTelegramAlert(
      `🧪 <b>FundabilityOS — Telegram Test</b>\n\n` +
      `✅ Connection verified!\n` +
      `🕐 Sent at: ${new Date().toISOString()}\n\n` +
      `The daily evolution cron will push updates here every morning at 6am UTC.`
    );
    return NextResponse.json({ success: true, message: "Telegram test message sent!" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
