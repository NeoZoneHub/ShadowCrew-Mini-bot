module.exports = {
    pattern: "invite",
    desc: "Obtenir le lien d'invitation du groupe",
    category: "group",
    react: "🔗",
    filename: __filename,
    use: ".invite",

    execute: async (conn, mek, m, { from, isGroup, reply }) => {
        try {
            if (!isGroup) {
                return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
            }

            if (module.exports.react) {
                await conn.sendMessage(from, {
                    react: { text: module.exports.react, key: mek.key }
                });
            }

            let code;
            try {
                code = await conn.groupInviteCode(from);
            } catch (err) {
                console.error("Erreur d'invitation :", err);
                return reply("❌ Je dois être *administrateur* dans ce groupe pour générer un lien d'invitation.");
            }

            const metadata = await conn.groupMetadata(from);
            const link = `https://chat.whatsapp.com/${code}`;

            const message = `🔗 *Lien d'invitation du groupe*\n\n📌 ${metadata.subject}\n\n${link}`;

            await conn.sendMessage(from, {
                text: message,
                contextInfo: {
                    externalAdReply: {
                        title: "Invitation au groupe",
                        body: metadata.subject,
                        thumbnailUrl: "https://files.catbox.moe/6dhr11.jpg",
                        sourceUrl: link,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error("❌ Erreur de la commande invite :", e);
            reply("⚠️ Échec de l'obtention du lien d'invitation. Assurez-vous que je suis *administrateur*.");
        }
    }
};