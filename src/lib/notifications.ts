// Servicio de notificaciones a Telegram
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(message: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('Telegram not configured:', { hasToken: !!BOT_TOKEN, hasChatId: !!CHAT_ID });
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

export function formatLoginAttemptMessage({
  success,
  ip,
  userAgent,
  timestamp,
  remainingAttempts,
}: {
  success: boolean;
  ip: string;
  userAgent: string;
  timestamp: string;
  remainingAttempts?: number;
}): string {
  const emoji = success ? '✅' : '⚠️';
  const status = success ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO';
  
  return `${emoji} <b>${status}</b>

📍 <b>IP:</b> <code>${ip}</code>
🌐 <b>Navegador:</b> ${userAgent.slice(0, 50)}...
🕐 <b>Hora:</b> ${new Date(timestamp).toLocaleString('es-ES')}
${!success && remainingAttempts !== undefined ? `🔒 <b>Intentos restantes:</b> ${remainingAttempts}` : ''}

${success ? 'Alguien ha entrado al dashboard.' : 'Intento de acceso no autorizado.'}`;
}
