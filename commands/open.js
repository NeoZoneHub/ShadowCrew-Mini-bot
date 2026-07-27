module.exports = {
  pattern: "open",
  desc: "Ouvrir le groupe (Réservé aux administrateurs)",
  category: "group",
  react: "🔓",
  filename: __filename,
  use: ".open",

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

      await conn.sendMessage(from, { react: { text: "✅", key: message.key } });

      await conn.groupSettingUpdate(from, "not_announcement");
      await conn.sendMessage(from, {
        text: "🔓 Le groupe est désormais ouvert. Tous les membres peuvent envoyer des messages.",
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
      console.error("Erreur d'ouverture du groupe :", e);

      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });

      reply("⚠️ Échec de l'ouverture du groupe.", {
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418906972955@newsletter",
            newsletterName: "ShadowCrew",
            serverMessageId: 200
          }
        }
      });
    }
  }
};