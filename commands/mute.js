module.exports = {
  pattern: "mute",
  desc: "Fermer le groupe (Réservé aux administrateurs)",
  category: "group",
  react: "🔒",
  filename: __filename,
  use: ".mute",

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

      await conn.groupSettingUpdate(from, "announcement");

      await conn.sendMessage(from, { react: { text: "✅", key: message.key } });
      await conn.sendMessage(from, {
        text: "🔒 Le groupe est désormais fermé. Seuls les administrateurs peuvent envoyer des messages.",
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
      console.error("Erreur de fermeture du groupe :", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Échec de la fermeture du groupe.");
    }
  }
};