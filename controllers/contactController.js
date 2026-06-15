const axios = require('axios');

const contactMessages = [];

async function postContact(req, res) {
  const { name, email, subject, message } = req.body;
  const isEn = req.body.lang === 'en';

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: isEn ? 'Please fill in Name, Email and Message.' : 'Vui lòng điền đầy đủ Họ tên, Email và Nội dung.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: isEn ? 'Invalid email address.' : 'Email không hợp lệ.',
    });
  }

  const entry = {
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'Contact from Portfolio').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  contactMessages.push(entry);
  console.log('[Contact]', entry);

  // Send Telegram notification if configured
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const text = `
<b>📬 New Contact Message</b>
<b>Name:</b> ${entry.name}
<b>Email:</b> ${entry.email}
<b>Subject:</b> ${entry.subject}
<b>Message:</b> ${entry.message}
<b>Time:</b> ${entry.createdAt}
      `.trim();

      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      });
      console.log('[Telegram] Notification sent');
    } catch (err) {
      console.error('[Telegram] Failed to send:', err.message);
    }
  }

  // Send Discord webhook if configured
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
  if (discordWebhook) {
    try {
      await axios.post(discordWebhook, {
        embeds: [{
          title: '📬 New Contact Message',
          color: 0x8b5cf6,
          fields: [
            { name: 'Name', value: entry.name, inline: true },
            { name: 'Email', value: entry.email, inline: true },
            { name: 'Subject', value: entry.subject, inline: false },
            { name: 'Message', value: entry.message, inline: false },
          ],
          timestamp: entry.createdAt,
        }],
      });
      console.log('[Discord] Notification sent');
    } catch (err) {
      console.error('[Discord] Failed to send:', err.message);
    }
  }

  res.json({
    success: true,
    message: isEn ? 'Thank you! Your message has been sent successfully.' : 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.',
  });
}

function getGitHubApi(req, res, next) {
  const { fetchGitHubStats } = require('./githubController');
  const username = process.env.GITHUB_USERNAME || req.query.username || '';

  fetchGitHubStats(username)
    .then((data) => res.json(data))
    .catch(next);
}

module.exports = { postContact, getGitHubApi, contactMessages };
