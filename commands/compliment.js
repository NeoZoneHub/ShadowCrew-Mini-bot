module.exports = {
  pattern: "compliment",
  desc: "Faire un compliment agréable",
  category: "fun",
  react: "😊",
  filename: __filename,

  execute: async (conn, mek, m, { from, isGroup, reply }) => {
    try {
      if (!isGroup) {
        return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
      }

      const rawTarget =
        m.mentionedJid?.[0] ||
        mek.message?.extendedTextMessage?.contextInfo?.participant;

      if (!rawTarget) {
        return reply("Veuillez mentionner ou répondre à un utilisateur.\nUtilisation : `.compliment @utilisateur`");
      }

      const compliments = [
        "tu es incroyable tel que tu es ! 💖",
        "ton sourire est contagieux ! 😊",
        "tu es un génie à ta façon ! 🧠",
        "tu apportes du bonheur à tout le monde autour de toi ! 🥰",
        "tu es comme un rayon de soleil ! ☀️",
        "ta gentillesse rend le monde meilleur ! ❤️",
        "tu es unique et irremplaçable ! ✨",
        "tu es plus fort que tu ne le penses ! 💪",
        "ta créativité est incroyable ! 🎨",
        "tu rends la vie plus amusante et intéressante ! 🎉",
        "tu illumines chaque pièce où tu entres ! 🌟",
        "le monde est meilleur parce que tu existes 🌍💖",
        "tu as un cœur en or pur 🏅💛",
        "tu inspires tout le monde autour de toi ✨🙌",
        "ton rire pourrait arranger les pires jours 😂💞",
        "tu es la preuve que les bonnes personnes existent encore 🌹",
        "être ton ami, c'est comme gagner au loto 🎰💎",
        "tu n'es pas seulement spécial, tu es inoubliable 💫",
        "tu fais sentir les gens comme chez eux, même dans le chaos 🏡❤️",
        "tu es le genre de personne que tout le monde mérite d'avoir dans sa vie 💕",
      ];

      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
      const message = `😊 @${rawTarget.split("@")[0]} ${randomCompliment}`;

      if (module.exports.react) {
        await conn.sendMessage(from, {
          react: { text: module.exports.react, key: mek.key }
        });
      }

      await conn.sendMessage(from, {
        text: message,
        mentions: [rawTarget],
      }, { quoted: mek });

    } catch (e) {
      console.error("Erreur dans compliment.js :", e);
      reply("⚠️ Échec de l'envoi du compliment.");
    }
  },
};