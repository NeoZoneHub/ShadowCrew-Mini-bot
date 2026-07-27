let fetchFn;
try {
  fetchFn = global.fetch || require("node-fetch");
} catch {
  fetchFn = global.fetch;
}

const CHAT_CACHE = new Map();

module.exports = {
  pattern: "fancy",
  desc: "Convertir du texte en différentes polices. Utilisez `.fancy <texte>` ou `.fancy <n>` après la génération.",
  category: "fun",
  react: "🎨",
  filename: __filename,
  use: "fancy <numéroStyle?> <texte?> ou répondre à un message",

  execute: async (conn, mek, m, { args, reply, from }) => {
    try {
      if (!fetchFn) return reply("⚠️ Fetch n'est pas disponible dans cet environnement.");

      const getQuotedText = () => {
        const q =
          m?.quoted?.message ||
          mek?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!q) return null;
        return (
          q.conversation ||
          q.extendedTextMessage?.text ||
          q.imageMessage?.caption ||
          q.videoMessage?.caption ||
          q.documentMessage?.fileName ||
          null
        );
      };

      const chatId = from || m.chat || mek.key?.remoteJid || "global";

      let styleNumber = null;
      let textToConvert = null;
      const quotedText = getQuotedText();

      if (args.length === 0) {
        if (quotedText) textToConvert = quotedText;
        else return reply("❌ Fournissez du texte ou répondez à un message.\nExemple : `.fancy Bonjour`");
      } else {
        if (!isNaN(args[0])) {
          styleNumber = parseInt(args[0], 10);
          if (args.length > 1) textToConvert = args.slice(1).join(" ");
          else if (quotedText) textToConvert = quotedText;
          else {
            const cached = CHAT_CACHE.get(chatId);
            if (cached) textToConvert = cached.text;
            else return reply("❌ Aucun texte trouvé dans cette discussion. Utilisez `.fancy <texte>` d'abord.");
          }
        } else {
          textToConvert = args.join(" ");
        }
      }

      if (!textToConvert) return reply("⚠️ Impossible de déterminer le texte.");

      const apiUrl = `https://api.giftedtech.co.ke/api/tools/fancy?apikey=gifted&text=${encodeURIComponent(
        textToConvert
      )}`;
      const res = await fetchFn(apiUrl);
      if (!res.ok) return reply("⚠️ Échec de la récupération des polices depuis l'API.");
      const data = await res.json();

      if (!data || !Array.isArray(data.results)) {
        return reply("⚠️ L'API n'a renvoyé aucune police.");
      }

      CHAT_CACHE.set(chatId, { text: textToConvert, results: data.results });

      const getSafeMentionJid = () => {
        try {
          if (!m.sender) return [];
          const senderParts = m.sender.split('@');
          if (senderParts.length === 2 && senderParts[1] === 's.whatsapp.net') {
            return [`${senderParts[0]}@s.whatsapp.net`];
          }
          return [];
        } catch (e) {
          return [];
        }
      };

      const mentionedJid = getSafeMentionJid();

      if (styleNumber !== null) {
        if (styleNumber < 1 || styleNumber > data.results.length) {
          return reply(`⚠️ Style invalide. Choisissez entre 1 et ${data.results.length}.`);
        }
        const chosen = data.results[styleNumber - 1];

        await conn.sendMessage(chatId, {
          text: `🎨 Style fancy (${styleNumber} - ${chosen.name}) :\n\n${chosen.result}`,
          contextInfo: {
            mentionedJid,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363418906972955@newsletter',
              newsletterName: 'ShadowCrew',
              serverMessageId: 200
            }
          }
        }, { quoted: mek });
        return;
      }

      let msg = `🎨 *Styles fancy pour :* ${textToConvert}\n_Affichez un style en tapant_ \`.fancy <numéro>\`\n\n`;
      data.results.forEach((f, i) => {
        msg += `*${i + 1}*. ${f.result} (${f.name})\n`;
      });

      await conn.sendMessage(chatId, {
        text: msg,
        contextInfo: {
          mentionedJid,
          forwardingScore: 200,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363418906972955@newsletter',
            newsletterName: 'ShadowCrew',
            serverMessageId: 200
          }
        }
      }, { quoted: mek });

    } catch (err) {
      console.error("Erreur dans fancy.js :", err);

      await conn.sendMessage(from || m.chat || mek.key?.remoteJid, {
        text: "⚠️ Erreur lors de la conversion du texte. Veuillez réessayer plus tard.",
        contextInfo: {
          mentionedJid: [],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363418906972955@newsletter',
            newsletterName: 'ShadowCrew',
            serverMessageId: 200
          }
        }
      }, { quoted: mek });
    }
  },
};