const axios = require("axios");

module.exports = {
    pattern: "ttstalk",
    desc: "Récupérer les détails du profil utilisateur TikTok",
    react: "📱",
    category: "search",
    filename: __filename,
    use: ".ttstalk [nom d'utilisateur]",

    execute: async (conn, message, m, { from, q, reply, sender }) => {
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
            if (!q) {
                return await sendMessageWithContext("❎ Veuillez fournir un nom d'utilisateur TikTok.\n\n*Exemple :* .ttstalk QADEER-XD - MINI");
            }

            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } });
            }

            const apiUrl = `https://api.princetechn.com/api/stalk/tiktokstalk?apikey=prince&username=${encodeURIComponent(q)}`;
            const { data } = await axios.get(apiUrl);

            if (!data.success || !data.result) {
                return await sendMessageWithContext("❌ Utilisateur introuvable ou l'API n'a renvoyé aucune donnée.");
            }

            const user = data.result;

            const profileInfo = `╭━━〔 *🎭 Profil TikTok* 〕━━┈⊷
┃ 👤 *Nom d'utilisateur* : @${user.username}
┃ 📛 *Pseudo* : ${user.name || "Inconnu"}
┃ ✅ *Vérifié* : ${user.verified ? "Oui ✅" : "Non ❌"}
┃ 🔒 *Privé* : ${user.private ? "Oui 🔒" : "Non 🌍"}
┃ 📝 *Bio* : ${user.bio || "Aucune bio disponible."}
┃
┃ 📊 *Statistiques* :
┃ 👥 Abonnés : ${user.followers?.toLocaleString() || "0"}
┃ 👤 Abonnements : ${user.following?.toLocaleString() || "0"}
┃ ❤️ J'aime : ${user.likes?.toLocaleString() || "0"}
┃
┃ 🆔 *ID* : ${user.id || "N/A"}
┃ 🔗 *Profil* : https://www.tiktok.com/@${user.username}
╰━━━━━━━━━━━━━━━━━━┈⊷
> © _Propulsé par ShadowCrew_ `;

            if (user.avatar) {
                await conn.sendMessage(from, {
                    image: { url: user.avatar },
                    caption: profileInfo,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363418906972955@newsletter",
                            newsletterName: "ShadowCrew",
                            serverMessageId: 200
                        }
                    }
                }, { quoted: message });
            } else {
                await sendMessageWithContext(profileInfo);
            }

        } catch (error) {
            console.error("❌ Erreur dans la commande TikTok stalk :", error);
            await sendMessageWithContext("⚠️ Une erreur est survenue lors de la récupération des données du profil TikTok.");
        }
    }
};