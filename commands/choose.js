module.exports = {
    pattern: "choose",
    desc: "Choisit aléatoirement un utilisateur parmi ceux mentionnés.",
    react: "🎲",
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

            const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

            if (mentioned.length < 2) {
                return reply("❌ Mentionnez au moins 2 utilisateurs à choisir !\n\nExemple :\n.choose @utilisateur1 @utilisateur2");
            }

            const randomPick = mentioned[Math.floor(Math.random() * mentioned.length)];
            const message = `🎲 Je choisis... @${randomPick.split("@")[0]} 🎉`;

            await conn.sendMessage(from, {
                text: message,
                mentions: mentioned
            }, { quoted: mek });

        } catch (error) {
            console.error("❌ Erreur dans la commande choose :", error);
            reply("⚠️ Une erreur est survenue lors du traitement de la commande. Veuillez réessayer.");
        }
    }
};