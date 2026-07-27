const axios = require('axios');

module.exports = {
    pattern: "inbox",
    desc: "Vérifier votre boîte de réception email temporaire",
    category: "utility",
    react: "📬",
    filename: __filename,
    use: ".inbox [id_session]",

    execute: async (conn, message, m, { from, q, reply }) => {
        const sendMessageWithContext = async (text, quoted = message) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew",
                        serverMessageId: 200
                    }
                }
            }, { quoted: quoted });
        };

        try {
            const sessionId = q;
            if (!sessionId) return await sendMessageWithContext('🔑 Veuillez fournir votre ID de session\nExemple : .inbox VOTRE_ID_SESSION');

            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } });
            }

            const inboxUrl = `https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${encodeURIComponent(sessionId)}`;
            const response = await axios.get(inboxUrl);

            if (!response.data.success) {
                return await sendMessageWithContext('❌ ID de session invalide ou email expiré');
            }

            const { inbox_count, messages } = response.data;

            if (inbox_count === 0) {
                return await sendMessageWithContext('📭 Votre boîte de réception est vide');
            }

            let messageList = `📬 *Vous avez ${inbox_count} message(s)*\n\n`;
            messages.forEach((msg, index) => {
                messageList += `━━━━━━━━━━━━━━━━━━\n` +
                              `📌 *Message ${index + 1}*\n` +
                              `👤 *De :* ${msg.from}\n` +
                              `📝 *Sujet :* ${msg.subject}\n` +
                              `⏰ *Date :* ${new Date(msg.date).toLocaleString()}\n\n` +
                              `📄 *Contenu :*\n${msg.body}\n\n`;
            });

            await sendMessageWithContext(messageList);

        } catch (e) {
            console.error('Erreur CheckMail :', e);
            await sendMessageWithContext(`❌ Erreur lors de la vérification de la boîte de réception : ${e.response?.data?.message || e.message}`);
        }
    }
};