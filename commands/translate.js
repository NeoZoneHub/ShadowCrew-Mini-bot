const translate = require("@iamtraction/google-translate");
const axios = require("axios");

const validLangs = [
  "en","fr","es","de","pt","ru","ar","zh","ja",
  "it","hi","tr","ko","nl","pl","sv","cs","id",
  "fa","uk"
];

function extractText(quoted) {
  if (!quoted) return null;
  return (
    quoted.conversation ||
    quoted.extendedTextMessage?.text ||
    quoted.imageMessage?.caption ||
    quoted.videoMessage?.caption ||
    null
  );
}

module.exports = {
  pattern: "trt",
  desc: "Traduire un texte ou un message cité vers la langue souhaitée (par défaut : Anglais).",
  react: "🌐",
  category: "tools",
  filename: __filename,

  execute: async (conn, mek, m, { from, reply }) => {
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
      if (module.exports.react) {
        await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
      }

      const rawText = mek.message?.conversation || mek.message?.extendedTextMessage?.text || "";
      const parts = rawText.trim().split(" ").slice(1);

      let targetLang = "en";
      let textToTranslate = null;

      if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quotedMsg = mek.message.extendedTextMessage.contextInfo.quotedMessage;
        textToTranslate = extractText(quotedMsg);

        if (!textToTranslate) {
          return await sendMessageWithContext("❌ Aucun texte trouvé dans le message cité à traduire.");
        }

        if (parts.length > 0 && validLangs.includes(parts[0].toLowerCase())) {
          targetLang = parts[0].toLowerCase();
        }
      }

      else if (parts.length >= 2 && validLangs.includes(parts[0].toLowerCase())) {
        targetLang = parts[0].toLowerCase();
        textToTranslate = parts.slice(1).join(" ");
      }

      else if (parts.length >= 1) {
        textToTranslate = parts.join(" ");
      }

      if (!textToTranslate) {
        return await sendMessageWithContext(
          "❌ Utilisation :\n- `.trt <texte>` (vers l'anglais)\n- `.trt <langue> <texte>`\n- Répondre à un message avec `.trt [langue]`"
        );
      }

      let translated = "";
      try {
        const res = await translate(textToTranslate, { to: targetLang });
        translated = res.text;
      } catch {
        const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
        const googleRes = await axios.get(googleUrl, { timeout: 8000 });
        translated = googleRes.data[0].map(item => item[0]).join("");
      }

      const message = `🌐 *Traduit en ${targetLang.toUpperCase()} :*\n\n${translated}`;
      await sendMessageWithContext(message);

    } catch (error) {
      console.error("❌ Erreur dans la commande de traduction :", error);
      await sendMessageWithContext("⚠️ Une erreur est survenue lors de la traduction. Veuillez réessayer.");
    }
  }
};