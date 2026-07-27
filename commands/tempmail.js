const axios = require('axios');

module.exports = {
    pattern: "tempmail",
    desc: "Générer une nouvelle adresse email temporaire",
    category: "utility",
    react: "📧",
    filename: __filename,
    use: ".tempmail",

    execute: async (conn, message, m, { from, reply }) => {
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
            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } });
            }

            const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');
            const { email, session_id, expires_at } = response.data;

            const expiresDate = new Date(expires_at);
            const timeString = expiresDate.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const dateString = expiresDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const messageText = `
📧 *EMAIL TEMPORAIRE GÉNÉRÉ*

✉️ *Adresse email :*
${email}

⏳ *Expire :*
${timeString} • ${dateString}

🔑 *ID de session :*
\`\`\`${session_id}\`\`\`

📥 *Vérifier la boîte de réception :*
.inbox ${session_id}

_L'email expirera après 24 heures_
`;

            await sendMessageWithContext(messageText);

        } catch (e) {
            console.error('Erreur TempMail :', e);
            await sendMessageWithContext(`❌ Erreur : ${e.message}`);
        }
    }
};