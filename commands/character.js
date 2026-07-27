module.exports = {
  pattern: "character",
  desc: "Décrire le caractère d'un utilisateur avec des traits amusants et originaux",
  react: "🧠",
  category: "fun",
  filename: __filename,

  execute: async (conn, mek, m, { from, isGroup, reply }) => {
    try {
      if (!isGroup) {
        return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
      }

      if (module.exports.react) {
        await conn.sendMessage(from, {
          react: { text: module.exports.react, key: mek.key }
        });
      }

      const target = m.mentionedJid?.[0] || mek.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target) {
        return reply("❌ Veuillez mentionner un utilisateur.\nUtilisation : `.character @utilisateur`");
      }

      const traits = [
        "une personne patiente, mais secrètement très têtue 😏",
        "paresseux et distrait, mais se croit un génie 🧠",
        "trop réfléchit à tout et panique pour rien 😵",
        "adore le drame et le chaos, impossible de l'éviter dans le groupe 🎭",
        "un râleur qui ne change jamais rien 🤷‍♂️",
        "toujours en retard mais s'attend à ce que tout le monde attende ⏰",
        "secrètement très curieux et fouineur 👀",
        "essaie d'être cool, finit par être gênant 😎",
        "toujours affamé mais ne partage jamais sa nourriture 🍔",
        "un perfectionniste qui ne termine jamais rien ✅❌",
        "parle beaucoup mais écoute rarement 🗣️",
        "s'énerve pour des broutilles mais pardonne rapidement 🔥",
        "un procrastinateur qui travaille le mieux à la dernière minute ⏳"
      ];

      const randomTrait = traits[Math.floor(Math.random() * traits.length)];

      const message = `🧠 Le caractère de @${target.split("@")[0]} est : ${randomTrait}`;

      await conn.sendMessage(from, {
        text: message,
        mentions: [target],
      }, { quoted: mek });

    } catch (error) {
      console.error("❌ Erreur dans la commande character :", error);
      reply("⚠️ Une erreur est survenue lors du traitement de la commande. Veuillez réessayer.");
    }
  }
};