import { telegramBotToken, telegramChatId } from "@/lib/server-config";

export async function sendTgMessage(text: string) {
  if (!telegramBotToken || !telegramChatId) {
    console.warn("Telegram credentials not configured. Skipping message.");
    return false;
  }

  const payload = {
    chat_id: telegramChatId,
    text,
  };

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      console.error("Error sending Telegram message:", await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to fetch Telegram API:", error);
    return false;
  }
}
