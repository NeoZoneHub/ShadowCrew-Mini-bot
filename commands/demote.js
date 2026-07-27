module.exports = {
  pattern: "demote",
  desc: "Rétrograder un administrateur en membre (Réservé aux administrateurs/propriétaire)",
  category: "group",
  react: "⬇️",
  filename: __filename,
  use: ".demote @utilisateur OU répondre à un utilisateur",

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

      let target = null;
      if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
      } else if (m.quoted) {
        target = m.quoted.sender;
      }

      if (!target) return reply("❌ Mentionnez ou répondez à un utilisateur à rétrograder.");

      await conn.groupParticipantsUpdate(from, [target], "demote");
      await conn.sendMessage(from, { react: { text: "✅", key: message.key } });
      await conn.sendMessage(from, {
        text: `⬇️ @${target.split("@")[0]} a été rétrogradé du statut d'administrateur`,
        mentions: [target]
      }, { quoted: message });

    } catch (e) {
      console.error("Erreur de rétrogradation :", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Échec de la rétrogradation de l'utilisateur.");
    }
  }
};