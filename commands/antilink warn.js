const { getSetting, setSetting } = require('../Settings.js');

module.exports = {
    pattern: "antilink warn",
    desc: "Avertir les utilisateurs qui publient des liens (Réservé aux administrateurs)",
    category: "group",
    filename: __filename,
    use: ".antilink warn on/off",

    execute: async (conn, message, m, { from, isGroup, isAdmins, isCreator, reply, args }) => {
        try {
            if (!isGroup) return reply("❌ Réservé aux groupes !");
            if (!isAdmins && !isCreator) return reply("❌ Réservé aux administrateurs !");
            if (!args[0]) return reply("📌 Utilisation : .antilink warn on/off");

            if (args[0].toLowerCase() === 'on') {
                setSetting(from, "antilink", "warn");
                return reply("🛡️ Anti-liens activé en *MODE AVERTISSEMENT*\n\n⚠️ Les utilisateurs seront expulsés après 3 avertissements.");
            } 

            if (args[0].toLowerCase() === 'off') {
                setSetting(from, "antilink", false);
                return reply("🚫 Anti-liens désactivé pour ce groupe.");
            }

            return reply("📌 Utilisation : .antilink warn on/off");

        } catch (error) {
            console.error("Erreur anti-liens avertissement :", error);
            reply("⚠️ Échec de la modification de l'anti-liens.");
        }
    }
};