const axios = require("axios");

module.exports = {
  pattern: "tiktok",
  desc: "Télécharger une vidéo TikTok sans filigrane",
  react: "🧑‍💻",
  category: "downloader",
  filename: __filename,
  use: ".tiktok <lien>",

  execute: async (conn, mek, m, { from, reply, q }) => {
    const sendMessageWithContext = async (text, quoted = mek) => {
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
      if (!q) return await sendMessageWithContext("⚠️ Veuillez fournir un lien TikTok.");
      if (!q.includes("tiktok.com")) return await sendMessageWithContext("❌ Lien TikTok invalide.");

      if (module.exports.react) {
        await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
      }

      await sendMessageWithContext("⏳ Téléchargement de la vidéo TikTok, veuillez patienter...");

      const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) return await sendMessageWithContext("❌ Échec de la récupération de la vidéo TikTok.");

      const { title, like, comment, share, author, meta } = data.data;
      const videoUrl = meta.media.find(v => v.type === "video")?.org;

      if (!videoUrl) return await sendMessageWithContext("❌ Aucune vidéo trouvée dans le TikTok.");

      const caption =
        `🎵 *Vidéo TikTok* 🎵\n\n` +
        `👤 *Utilisateur :* ${author.nickname} (@${author.username})\n` +
        `📖 *Titre :* ${title}\n` +
        `👍 *J'aime :* ${like}\n💬 *Commentaires :* ${comment}\n🔁 *Partages :* ${share}\n\n` +
        `> _Propulsé par ShadowCrew_ `;

      await conn.sendMessage(from, {
        video: { url: videoUrl },
        caption: caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418906972955@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 200
          }
        }
      }, { quoted: mek });

    } catch (error) {
      console.error("❌ Erreur du téléchargeur TikTok :", error);
      await sendMessageWithContext(`⚠️ Erreur lors du téléchargement de la vidéo TikTok :\n${error.message}`);
    }
  }
};