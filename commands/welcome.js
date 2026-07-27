module.exports = {
  pattern: "welcome",
  desc: "Activer/désactiver les messages d'accueil (Réservé au propriétaire/administrateur)",
  category: "group",
  react: "🎒",
  use: ".welcome on/off",
  filename: __filename,

  execute: async (conn, message, m, { q, reply, from, isGroup, sender }) => {
    try {
      const jidToBase = (jid) => String(jid).split("@")[0].split(":")[0];
      const senderBase = jidToBase(sender);
      const botBase = jidToBase(conn?.user?.id || "");

      let owners = [];
      if (process.env.OWNER_NUMBER) {
        owners = process.env.OWNER_NUMBER.split(",").map(num => num.trim());
      }
      const isOwner = botBase === senderBase || owners.includes(senderBase);

      let isAdmin = false;
      if (isGroup) {
        try {
          const metadata = await conn.groupMetadata(from);
          const participant = metadata.participants.find(p => jidToBase(p.id) === senderBase);
          isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
        } catch {
          return reply("❌ Échec de la récupération des informations du groupe.");
        }
      }

      if (!isOwner) {
        if (isGroup) {
          if (!isAdmin) return reply("❌ Seuls les administrateurs du groupe ou le propriétaire peuvent activer/désactiver cette fonction.");
        } else {
          return reply("❌ Seul le propriétaire peut activer/désactiver cette fonction en messages privés.");
        }
      }

      if (!q) {
        return reply(
          `⚙️ Utilisation : \`.welcome on\` ou \`.welcome off\`\n\n📡 Statut actuel : *${process.env.WELCOME_ENABLED === "true" ? "ACTIVÉ ✅" : "DÉSACTIVÉ ❌"}*`
        );
      }

      if (q.toLowerCase() === "on") {
        process.env.WELCOME_ENABLED = "true";
        await conn.sendMessage(from, { react: { text: "🎒", key: message.key } });
        return reply("✅ Messages d'accueil activés.\n\n📡 Statut actuel : *ACTIVÉ*");
      } else if (q.toLowerCase() === "off") {
        process.env.WELCOME_ENABLED = "false";
        await conn.sendMessage(from, { react: { text: "🎒", key: message.key } });
        return reply("❌ Messages d'accueil désactivés.\n\n📡 Statut actuel : *DÉSACTIVÉ*");
      } else {
        return reply(
          `⚙️ Utilisation : \`.welcome on\` ou \`.welcome off\`\n\n📡 Statut actuel : *${process.env.WELCOME_ENABLED === "true" ? "ACTIVÉ ✅" : "DÉSACTIVÉ ❌"}*`
        );
      }

    } catch (e) {
      console.error("Erreur de la commande welcome :", e);
      await conn.sendMessage(from, { react: { text: "❌", key: message.key } });
      reply("⚠️ Échec de la modification des messages d'accueil.");
    }
  }
};