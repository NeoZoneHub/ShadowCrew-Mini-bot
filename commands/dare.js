let fetchFn;
try {
  fetchFn = global.fetch || require("node-fetch");
} catch {
  fetchFn = global.fetch;
}

module.exports = {
  pattern: "dare",
  desc: "Donner un défi à un utilisateur",
  category: "fun",
  react: "🎲",
  filename: __filename,

  execute: async (conn, mek, m, { from, isGroup, reply }) => {
    const sendMessageWithContext = async (text, quoted = mek, mentions = []) => {
      return await conn.sendMessage(from, {
        text: text,
        mentions: mentions,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363378786516098@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 200
          }
        }
      }, { quoted: quoted });
    };

    try {
      if (!isGroup) {
        return await sendMessageWithContext("❌ Cette commande ne peut être utilisée que dans les groupes.");
      }

      const rawTarget =
        m.mentionedJid?.[0] ||
        mek.message?.extendedTextMessage?.contextInfo?.participant;

      if (!rawTarget) {
        return await sendMessageWithContext("Veuillez mentionner ou répondre à un utilisateur.\nUtilisation : `.dare @utilisateur`");
      }

      if (module.exports.react) {
        await conn.sendMessage(from, {
          react: { text: module.exports.react, key: mek.key },
        });
      }

      const apiUrl = "https://apis.davidcyriltech.my.id/dare?apikey";
      const res = await fetchFn(apiUrl);
      if (!res.ok) return await sendMessageWithContext("⚠️ Échec de la récupération du défi depuis l'API.");
      const data = await res.json();

      const dareText = data?.question || null;
      if (!dareText) return await sendMessageWithContext("⚠️ Aucun défi trouvé.");

      const message = `🎲 @${rawTarget.split("@")[0]}, ton défi est :\n\n${dareText}`;

      await sendMessageWithContext(message, mek, [rawTarget]);

    } catch (err) {
      console.error("Erreur dans dare.js :", err);
      await sendMessageWithContext("⚠️ Erreur lors de la récupération du défi. Veuillez réessayer plus tard.");
    }
  },
};