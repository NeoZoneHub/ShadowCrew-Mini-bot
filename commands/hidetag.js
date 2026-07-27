module.exports = {
  pattern: "hidetag",
  desc: "Taguer tous les membres pour n'importe quel message/média - accessible à tous",
  category: "group",
  use: ".hidetag [message] ou répondre à un message",
  filename: __filename,

  execute: async (conn, message, m, { q, reply, from, isGroup }) => {
    try {
      if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

      let metadata;
      try {
        metadata = await conn.groupMetadata(from);
      } catch {
        return reply("❌ Échec de la récupération des informations du groupe.");
      }

      const participants = metadata.participants.map(p => p.id);

      if (!q && !m.quoted) return reply("❌ Fournissez un message ou répondez à un message.");

      await conn.sendMessage(from, { react: { text: "👀", key: message.key } });

      if (m.quoted) {
        return await conn.sendMessage(
          from,
          { forward: m.quoted.message, mentions: participants },
          { quoted: message }
        );
      }

      if (q) {
        return await conn.sendMessage(
          from,
          { text: q, mentions: participants },
          { quoted: message }
        );
      }

    } catch (e) {
      console.error("Erreur hidetag :", e);
      try { await conn.sendMessage(from, { react: { text: "❌", key: message.key } }); } catch {}
      reply(`⚠️ Échec de l'envoi du hidetag.\n\n${e.message}`);
    }
  }
};