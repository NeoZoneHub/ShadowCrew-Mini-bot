const { getSetting, setSetting } = require('../Settings.js');

module.exports = {
    pattern: "antilink kick",
    desc: "Expulser les utilisateurs qui publient des liens (Réservé aux administrateurs)",
    category: "group",
    filename: __filename,
    use: ".antilink kick on/off",

    execute: async (conn, message, m, { from, isGroup, isAdmins, isCreator, reply, args }) => {
        try {
            if (!isGroup) return reply("❌ Réservé aux groupes !");
            if (!isAdmins && !isCreator) return reply("❌ Réservé aux administrateurs !");
            if (!args[0]) return reply("📌 Utilisation : .antilink kick on/off");

            if (args[0].toLowerCase() === 'on') {
                setSetting(from, "antilink", "kick");
                return reply("🛡️ Anti-liens activé en *MODE EXPULSION*\n\n⚠️ Les utilisateurs qui publient des liens seront immédiatement expulsés.");
            } 

            if (args[0].toLowerCase() === 'off') {
                setSetting(from, "antilink", false);
                return reply("🚫 Anti-liens désactivé pour ce groupe.");
            }

            return reply("📌 Utilisation : .antilink kick on/off");

        } catch (error) {
            console.error("Erreur anti-liens expulsion :", error);
            reply("⚠️ Échec de la modification de l'anti-liens.");
        }
    }
};