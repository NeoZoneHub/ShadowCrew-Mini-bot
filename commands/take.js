const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { videoToWebp, imageToWebp } = require('../lib/video-utils');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const axios = require('axios');

module.exports = {
  pattern: "take",
  desc: "Convertir un média en sticker avec un nom d'auteur personnalisé",
  category: "sticker",
  react: "🔄",
  filename: __filename,
  use: "<répondre à un média> [nom de l'auteur]",

  execute: async (conn, message, m, { from, q, reply }) => {
    const sendText = async (text, quoted = message) => {
      return conn.sendMessage(from, { 
        text,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418906972955@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 200
          }
        }
      }, { quoted });
    };

    try {
      const packName = "";
      const authorName = q ? q.trim() : "ShadowCrew";

      const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quotedMsg || message.message;

      if (!target) {
        return await sendText("*Veuillez répondre à un sticker avec .take*\n\n*Utilisation :* .take [nom de l'auteur]\n*Exemple :* .take ShadowCrew");
      }

      let mediaNode = null;
      let mediaType = null;
      if (target.imageMessage) {
        mediaNode = target.imageMessage;
        mediaType = "image";
      } else if (target.videoMessage) {
        mediaNode = target.videoMessage;
        mediaType = "video";
      } else if (target.stickerMessage) {
        mediaNode = target.stickerMessage;
        mediaType = "sticker";
      } else {
        return await sendText("*Veuillez répondre à un sticker.*\n\n*Utilisation :* .take nom");
      }

      if (module.exports.react) {
        try { 
          await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } }); 
        } catch (e) {}
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
        return await sendText("❌ Échec du téléchargement du média. Essayez de répondre à une image/vidéo/sticker valide.");
      }

      if (!buffer || buffer.length === 0) {
        return await sendText("❌ Le média téléchargé est vide ou trop volumineux.");
      }

      if (mediaType === "sticker") {
        try {
          const sticker = new Sticker(buffer, {
            pack: packName,
            author: authorName,
            type: StickerTypes.FULL,
            quality: 75,
            background: "transparent",
          });
          const out = await sticker.toBuffer();
          return await conn.sendMessage(from, { sticker: out }, { quoted: message });
        } catch (e) {
          console.error("Erreur de ré-emballage du sticker :", e);
          return await conn.sendMessage(from, { sticker: buffer }, { quoted: message });
        }
      }

      let webpBuffer;
      try {
        if (mediaType === "image") {
          const convert = (typeof imageToWebp === "function") ? imageToWebp : videoToWebp;
          webpBuffer = await convert(buffer);
        } else {
          webpBuffer = await videoToWebp(buffer);
        }
      } catch (e) {
        console.error("Erreur de conversion :", e);
        return await sendText("❌ Échec de la conversion du média en sticker.");
      }

      if (!webpBuffer || webpBuffer.length === 0) {
        return await sendText("❌ La conversion a produit un fichier vide.");
      }

      try {
        const sticker = new Sticker(webpBuffer, {
          pack: packName,
          author: authorName,
          type: StickerTypes.FULL,
          quality: 75,
          background: "transparent",
        });
        const out = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: out }, { quoted: message });

      } catch (e) {
        console.error("Erreur du formateur de sticker :", e);
        await conn.sendMessage(from, { sticker: webpBuffer }, { quoted: message });
      }

    } catch (err) {
      console.error("Erreur d'exécution du sticker :", err);
      await sendText("❌ Échec de la conversion du sticker.");
    }
  }
};