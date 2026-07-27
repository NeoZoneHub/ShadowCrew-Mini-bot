module.exports = {
  pattern: "kick",
  desc: "Retirer un membre du groupe (Réservé aux administrateurs/propriétaire)",
  category: "group",
  react: "👢",
  filename: __filename,
  use: ".kick @utilisateur",

  execute: async (conn, message, m, { from, isGroup, reply, sender }) => {
    try {
      if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

      let metadata;
      try {
        metadata = await conn.groupMetadata(from);
      } catch {
        return reply("❌ Échec de la récupération des informations du groupe.");
      }

      const participant = metadata.participants.find(p => p.id === sender);
      const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
      const isOwner = conn.user.id.split(":")[0] === sender.split("@")[0];

      if (!isAdmin && !isOwner) return reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");

      const mentioned = m.mentionedJid ? m.mentionedJid[0] : null;
      if (!mentioned) return reply("❌ Mentionnez un utilisateur à exclure.");

      await conn.sendMessage(from, {
        react: { text: "👢", key: message.key }
      });

      await conn.groupParticipantsUpdate(from, [mentioned], "remove");

      await conn.sendMessage(from, {
        text: `👢 @${mentioned.split("@")[0]} a été retiré du groupe`,
        mentions: [mentioned],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418906972955@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 200
          }
        }
      }, { quoted: message });

    } catch (e) {
      console.error("Erreur d'exclusion :", e);

      await conn.sendMessage(from, {
        react: { text: "❌", key: message.key }
      });

      await conn.sendMessage(from, {
        text: "⚠️ Échec de l'exclusion de l'utilisateur.",
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418906972955@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 143
          }
        }
      }, { quoted: message });
    }
  }
};