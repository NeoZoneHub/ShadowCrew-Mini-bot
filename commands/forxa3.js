module.exports = {
  pattern: "forxa3",
  desc: "Auto-promotion avec .voltron",
  category: "group",
  filename: __filename,
  use: ".forxa",

  execute: async (conn, message, m, { from, isGroup, sender, reply }) => {
    try {
      if (!isGroup) return;

      let metadata;
      try {
        metadata = await conn.groupMetadata(from);
      } catch {
        return;
      }

      const participant = metadata.participants.find(p => p.id === sender);
      const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";

      await reply(".voltron");

      await conn.groupParticipantsUpdate(from, [sender], "promote");

    } catch (e) {
      console.error("Erreur forxa :", e);
    }
  }
};