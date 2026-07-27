module.exports = {
  pattern: "aura",
  desc: "Calculer le score d'aura d'un utilisateur.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: ".aura @utilisateur OU répondre à un utilisateur",

  execute: async (conn, message, m, { from, isGroup, reply }) => {
    try {
      if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

      let target = null;
      if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
      } else if (m.quoted) {
        target = m.quoted.sender;
      } else {
        target = m.sender;
      }

      if (!target) return reply("❌ Mentionnez ou répondez à un utilisateur pour calculer son aura.");

      const auraScore = Math.floor(Math.random() * 1000) + 1;

      const auraDescriptions = [
        { range: [1, 200], text: "⚫ Sombre et chaotique… restez à distance ! 👀" },
        { range: [201, 400], text: "🌫️ Brumeux et mystérieux… on ne peut pas lui faire entièrement confiance. 🤔" },
        { range: [401, 600], text: "🌊 Calme et équilibré… des vibrations paisibles tout autour. 🕊️" },
        { range: [601, 800], text: "🔥 Fougueux et puissant… vous illuminez la pièce ! ⚡" },
        { range: [801, 1000], text: "🌟 Divin et légendaire… vraiment unique en son genre ! 👑" }
      ];

      const auraText =
        auraDescriptions.find(d => auraScore >= d.range[0] && auraScore <= d.range[1])?.text ||
        "✨ Énergie indéfinie… âme mystérieuse.";

      await conn.sendMessage(from, {
        text: `💀 Aura de @${target.split("@")[0]} : *${auraScore}/1000*\n\n${auraText}`,
        mentions: [target]
      }, { quoted: message });

      if (module.exports.react) {
        await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } });
      }

    } catch (e) {
      console.error("Erreur aura :", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Échec du calcul de l'aura.");
    }
  }
};