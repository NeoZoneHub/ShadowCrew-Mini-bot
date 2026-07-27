const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
  pattern: "url",
  desc: "Convertir un média en URL Catbox",
  react: "🖇",
  category: "utility",
  filename: __filename,
  use: ".url [répondre à un média ou envoyer un média avec légende]",

  execute: async (conn, message, m, { from }) => {
    const sendMessageWithContext = async (text, quoted = message) => {
      return conn.sendMessage(
        from,
        {
          text,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363418906972955@newsletter",
              newsletterName: "ShadowCrew",
              serverMessageId: 200,
            },
          },
        },
        { quoted }
      );
    };

    try {
      const quotedMsg =
        message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quotedMsg || message.message;

      if (!target) {
        return await sendMessageWithContext(
          "❌ Veuillez répondre à un audio, une vidéo, une image ou un document avec `.url`"
        );
      }

      let mediaNode = null;
      let mediaType = null;
      if (target.imageMessage) {
        mediaNode = target.imageMessage;
        mediaType = "image";
      } else if (target.videoMessage) {
        mediaNode = target.videoMessage;
        mediaType = "video";
      } else if (target.audioMessage) {
        mediaNode = target.audioMessage;
        mediaType = "audio";
      } else if (target.documentMessage) {
        mediaNode = target.documentMessage;
        mediaType = "document";
      } else {
        return await sendMessageWithContext(
          "❌ Veuillez répondre à un audio, une vidéo, une image ou un document avec `.url`"
        );
      }

      if (module.exports.react) {
        try {
          await conn.sendMessage(from, {
            react: { text: module.exports.react, key: message.key },
          });
        } catch {}
      }

      let buffer;
      try {
        const stream = await downloadContentFromMessage(mediaNode, mediaType);
        let _buf = Buffer.from([]);
        for await (const chunk of stream) {
          _buf = Buffer.concat([_buf, chunk]);
        }
        buffer = _buf;
      } catch (e) {
        console.error("Erreur de téléchargement :", e);
        return await sendMessageWithContext(
          "❌ Échec du téléchargement du média. Essayez de répondre à un fichier valide."
        );
      }

      if (!buffer || buffer.length === 0) {
        return await sendMessageWithContext(
          "❌ Le média téléchargé est vide ou trop volumineux."
        );
      }

      let extension = "";
      if (mediaType === "image") extension = ".jpg";
      else if (mediaType === "video") extension = ".mp4";
      else if (mediaType === "audio") extension = ".mp3";
      else if (mediaType === "document") {
        const fileName = mediaNode.fileName || "";
        extension = path.extname(fileName) || ".bin";
      }

      const tempFilePath = path.join(
        os.tmpdir(),
        `catbox_upload_${Date.now()}${extension}`
      );
      fs.writeFileSync(tempFilePath, buffer);

      const form = new FormData();
      form.append("fileToUpload", fs.createReadStream(tempFilePath));
      form.append("reqtype", "fileupload");

      const uploadResponse = await axios.post(
        "https://catbox.moe/user/api.php",
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000,
        }
      );

      if (!uploadResponse.data)
        throw new Error("Erreur lors de l'upload vers Catbox");
      const uploadedUrl = uploadResponse.data;

      try {
        fs.unlinkSync(tempFilePath);
      } catch {}

      await sendMessageWithContext(
        `*${mediaType.toUpperCase()} Téléchargé avec succès*\n\n` +
          `*Taille :* ${formatBytes(buffer.length)}\n` +
          `*URL :* ${uploadedUrl}\n\n` +
          `> © Uploadé par *ShadowCrew* 💜`
      );
    } catch (err) {
      console.error("Erreur d'exécution url :", err);
      await sendMessageWithContext(
        `⚠️ Erreur : ${err.message || "Échec du traitement du média"}`
      );
    }
  },
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}