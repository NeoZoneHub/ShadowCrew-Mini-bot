module.exports = {
    pattern: "broadcast",
    alias: ["bc"],
    desc: "Diffuser un message, une image ou une vidéo à tous les groupes (Réservé au propriétaire)",
    category: "owner",
    filename: __filename,
    use: ".broadcast <texte> OU répondre à une image/vidéo",

    execute: async (conn, message, m, { from, isCreator, reply, args, q }) => {
        try {
            if (!isCreator) return reply("❌ Réservé au propriétaire !");

            const hasText = q && q.trim().length > 0;
            const hasQuotedImage = m.quoted && m.quoted.mtype === 'imageMessage';
            const hasQuotedVideo = m.quoted && m.quoted.mtype === 'videoMessage';

            if (!hasText && !hasQuotedImage && !hasQuotedVideo) {
                return reply(`📌 *Utilisation :*\n${global.prefix || '.'}broadcast Bonjour à tous !\n\nOu répondez à une image/vidéo avec : ${global.prefix || '.'}broadcast`);
            }

            const groups = await conn.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);

            if (groupIds.length === 0) {
                return reply("❌ Aucun groupe trouvé !");
            }

            await reply(`📢 Diffusion en cours vers ${groupIds.length} groupes...`);

            const NEWSLETTER_JID = "120363425629935700@newsletter";
            const NEWSLETTER_NAME = "ShadowCrew 💀";

            const contextInfo = {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER_JID,
                    newsletterName: NEWSLETTER_NAME,
                    serverMessageId: -1
                }
            };

            let bcText = `╭─〔 ʙʀᴏᴀᴅᴄᴀsᴛ ʙʏ ᴏᴡɴᴇʀ 〕\n│ ${q ? q.split('\n').join('\n│ ') : 'Message diffusé'}\n╰─⸻⸻⸻⸻`;

            let successCount = 0;
            let failCount = 0;

            for (let id of groupIds) {
                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
                    if (hasQuotedImage) {
                        const media = await conn.downloadAndSaveMediaMessage(m.quoted);
                        await conn.sendMessage(id, {
                            image: { url: media },
                            caption: bcText,
                            contextInfo
                        });
                    } 
                    else if (hasQuotedVideo) {
                        const media = await conn.downloadMediaMessage(m.quoted);
                        await conn.sendMessage(id, {
                            video: media,
                            caption: bcText,
                            mimetype: 'video/mp4',
                            contextInfo
                        });
                    } 
                    else {
                        await conn.sendMessage(id, {
                            text: bcText,
                            contextInfo
                        });
                    }
                    successCount++;
                } catch (err) {
                    console.error(`❌ Échec de la diffusion vers ${id} :`, err.message);
                    failCount++;
                }
            }

            reply(`✅ Diffusion terminée !\n\n📤 Réussis : ${successCount}\n❌ Échecs : ${failCount}`);

        } catch (err) {
            console.error("Erreur de diffusion :", err);
            reply("❌ Échec de la diffusion.");
        }
    }
};