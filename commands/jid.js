module.exports = {
    pattern: "cid",
    alias: ["newsletter", "id", "channelid"],
    react: "⏳",
    desc: "Obtenir les informations d'une chaîne WhatsApp à partir d'un lien",
    category: "whatsapp",
    filename: __filename,
    use: ".cid https://whatsapp.com/channel/xxxxxxxxx",

    execute: async (conn, message, m, { from, args, q, reply, sender }) => {
        const sendFancyReply = async (text, quoted = message) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew",
                        serverMessageId: 200
                    },
                    externalAdReply: {
                        title: "📡 Informations de la chaîne",
                        body: "ShadowCrew",
                        thumbnailUrl: "https://files.catbox.moe/6dhr11.jpg",
                        sourceUrl: "https://github.com/QadeerXTech/QADEER-AI",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: quoted });
        };

        try {
            if (!q) return reply("❎ Veuillez fournir un lien de chaîne WhatsApp.\n\n*Exemple :* .cid https://whatsapp.com/channel/123456789");

            const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
            if (!match) return reply("⚠️ *Format de lien de chaîne invalide.*\n\nAssurez-vous qu'il ressemble à :\nhttps://whatsapp.com/channel/xxxxxxxxx");

            const inviteId = match[1];

            let metadata;
            try {
                metadata = await conn.newsletterMetadata("invite", inviteId);
            } catch (e) {
                return reply("❌ Échec de la récupération des métadonnées de la chaîne. Vérifiez que le lien est correct.");
            }

            if (!metadata || !metadata.id) return reply("❌ Chaîne introuvable ou inaccessible.");

            const infoText = `📡 Informations de la chaîne\n\n` +
                `🛠️ *ID :* ${metadata.id}\n` +
                `📌 *Nom :* ${metadata.name}\n` +
                `👥 *Abonnés :* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
                `📅 *Créée le :* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("fr-FR") : "Inconnue"}`;

            if (metadata.preview) {
                await conn.sendMessage(from, {
                    image: { url: `https://pps.whatsapp.net${metadata.preview}` },
                    caption: infoText
                }, { quoted: m });
            } else {
                await sendFancyReply(infoText);
            }

        } catch (error) {
            console.error("❌ Erreur dans le plugin .cid :", error);
            reply("⚠️ Une erreur inattendue s'est produite.");
        }
    }
};