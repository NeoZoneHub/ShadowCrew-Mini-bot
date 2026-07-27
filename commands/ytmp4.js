const axios = require("axios");

module.exports = {
  pattern: "ytmp4",
  desc: "Télécharger une vidéo YouTube au format MP4 en utilisant l'API David Cyril",
  react: "🎬",
  category: "downloader",
  filename: __filename,

  execute: async (conn, mek, m, { from, q, reply }) => {
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
      if (!q) return await sendMessageWithContext("❌ Veuillez fournir un lien de vidéo YouTube.");

      if (module.exports.react) {
        await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
      }

      await sendMessageWithContext("⏳ Téléchargement de la vidéo YouTube, veuillez patienter...");

      const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(q)}&apikey=`;
      const { data } = await axios.get(apiUrl);

      if (!data || !data.result || !data.result.download_url) {
        return await sendMessageWithContext("❌ Échec de la récupération de la vidéo YouTube depuis l'API.");
      }

      const { download_url, title, thumbnail, quality, duration } = data.result;

      const caption = `🎬 *Vidéo YouTube*\n\n` +
                      `📖 *Titre :* ${title || "Inconnu"}\n` +
                      `🎚️ *Qualité :* ${quality || "Inconnue"}\n` +
                      `⏱️ *Durée :* ${duration ? duration + "s" : "Inconnue"}\n\n` +
                      `> _Propulsé par ShadowCrew_`;

      let thumbBuffer;
      if (thumbnail) {
        try {
          const res = await axios.get(thumbnail, { responseType: "arraybuffer" });
          thumbBuffer = Buffer.from(res.data);
        } catch {}
      }

      await conn.sendMessage(from, {
        video: { url: download_url },
        caption: caption,
        jpegThumbnail: thumbBuffer,
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
      console.error("❌ Erreur du téléchargeur YouTube :", error);
      await sendMessageWithContext(`⚠️ Erreur lors du téléchargement de la vidéo YouTube : ${error.message}`);
    }
  }
};