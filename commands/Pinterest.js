const axios = require("axios");

module.exports = {
    pattern: "pinterest",
    desc: "Télécharger des médias depuis Pinterest",
    react: "📌",
    category: "download",
    filename: __filename,

    execute: async (conn, mek, m, { from, args, q, reply }) => {
        const sendMessageWithContext = async (text, quoted = mek) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew Mini",
                        serverMessageId: 200
                    }
                }
            }, { quoted: quoted });
        };

        try {
            const query = q || args.join(" ");
            if (!query) {
                return await sendMessageWithContext(
                    '❎ Veuillez fournir l\'URL Pinterest à télécharger.\n\nExemple : .pinterest https://pin.it/1cR6JJNpv'
                );
            }

            if (!query.includes('pinterest.com') && !query.includes('pin.it')) {
                return await sendMessageWithContext('❎ Veuillez fournir une URL Pinterest valide (pinterest.com ou pin.it)');
            }

            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
            }

            await sendMessageWithContext("📌 Téléchargement depuis Pinterest... Veuillez patienter.");

            let response;
            let apiUsed = "GiftedTech";

            try {
                const api = `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(query)}`;
                response = await axios.get(api, { timeout: 30000 });

                if (!response.data.success) {
                    throw new Error('Échec de l\'API GiftedTech');
                }
            } catch (error) {
                try {
                    apiUsed = "PrinceTech";
                    const api = `https://api.princetechn.com/api/download/pinterestdl?apikey=prince&url=${encodeURIComponent(query)}`;
                    response = await axios.get(api, { timeout: 30000 });

                    if (!response.data || !response.data.result) {
                        throw new Error('Échec de l\'API PrinceTech');
                    }
                } catch (fallbackError) {
                    return await sendMessageWithContext('❎ Échec de la récupération des données depuis les deux APIs Pinterest. Veuillez réessayer plus tard.');
                }
            }

            let media, title, description;

            if (apiUsed === "GiftedTech") {
                media = response.data.result.media;
                title = response.data.result.title || 'Aucun titre disponible';
                description = response.data.result.description || 'Aucune description disponible';
            } else {
                media = response.data.result;
                title = response.data.result?.title || 'Aucun titre disponible';
                description = response.data.result?.description || 'Aucune description disponible';
            }

            let mediaUrl;
            if (Array.isArray(media)) {
                mediaUrl = media.find(item => item.type && item.type.includes('720p'))?.download_url || 
                          media.find(item => item.type && item.type.includes('video'))?.download_url || 
                          media[0]?.download_url;
            } else if (media?.download_url) {
                mediaUrl = media.download_url;
            }

            if (!mediaUrl) {
                return await sendMessageWithContext('❎ Aucun média téléchargeable trouvé dans la réponse.');
            }

            const caption = `╭━━━〔 *TÉLÉCHARGEMENT PINTEREST* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *TÉLÉCHARGEUR PINS*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━♜━⪼
┇๏ *Titre* - ${title}
┇๏ *Source* - ${apiUsed}
┇๏ *Description* - ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}
╰━━♜━⪼
> *© Propulsé par ShadowCrew Mini ♡*`;

            const isVideo = mediaUrl.includes('.mp4') || 
                           mediaUrl.includes('video') ||
                           (Array.isArray(media) && media.some(item => item.type && item.type.includes('video'))) ||
                           (media?.type && media.type.includes('video'));

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: mediaUrl },
                    caption: caption,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363418906972955@newsletter",
                            newsletterName: "ShadowCrew Mini",
                            serverMessageId: 200
                        }
                    }
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    image: { url: mediaUrl },
                    caption: caption,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363418906972955@newsletter",
                            newsletterName: "ShadowCrew Mini",
                            serverMessageId: 200
                        }
                    }
                }, { quoted: mek });
            }

        } catch (e) {
            console.error("❌ Erreur de téléchargement Pinterest :", e.message);
            await sendMessageWithContext(`⚠️ Erreur : ${e.message}`);
        }
    }
};