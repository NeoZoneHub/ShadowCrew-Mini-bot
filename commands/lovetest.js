module.exports = {
  pattern: "lovetest",
  desc: "Vérifier la compatibilité amoureuse entre deux utilisateurs",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@tag1 @tag2",

  execute: async (conn, mek, m, { from, isGroup, reply }) => {
    try {
      if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
      if (!m.mentionedJid || m.mentionedJid.length < 2) {
        return reply("❌ Mentionnez deux utilisateurs !\nExemple : `.lovetest @utilisateur1 @utilisateur2`");
      }

      const user1 = m.mentionedJid[0];
      const user2 = m.mentionedJid[1];
      const lovePercent = Math.floor(Math.random() * 100) + 1;

      const messages = [
        { range: [90, 100], text: "💖 *Une union céleste !* Le véritable amour existe !" },
        { range: [75, 89], text: "😍 *Une connexion forte !* Cet amour est profond et significatif." },
        { range: [50, 74], text: "😊 *Bonne compatibilité !* Vous pouvez tous les deux y arriver." },
        { range: [30, 49], text: "🤔 *C'est compliqué !* Cela demande des efforts, mais c'est possible !" },
        { range: [10, 29], text: "😅 *Pas la meilleure correspondance !* Peut-être rester amis ?" },
        { range: [1, 9], text: "💔 *Oups !* Cet amour est aussi réel qu'une rupture à Bollywood !" }
      ];

      const loveMessage = messages.find(
        msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]
      ).text;

      const message = `💘 *Test de compatibilité amoureuse* 💘\n\n❤️ @${user1.split("@")[0]} + @${user2.split("@")[0]} = *${lovePercent}%*\n${loveMessage}`;

      await conn.sendMessage(from, { react: { text: "❤️", key: mek.key } });

      await conn.sendMessage(from, {
        text: message,
        mentions: [user1, user2],
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

    } catch (e) {
      console.error("❌ Erreur dans lovetest.js :", e);
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      reply("⚠️ Échec du test d'amour.");
    }
  },
};