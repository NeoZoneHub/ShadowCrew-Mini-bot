const { getSetting, setSetting } = require('../Settings.js');

module.exports = {
    pattern: "antilink delete",
    desc: "Supprimer uniquement les liens (Réservé aux administrateurs)",
    category: "group",
    filename: __filename,
    use: ".antilink delete on/off",

    execute: async (conn, message, m, { from, isGroup, isAdmins, isCreator, reply, args }) => {
        try {
            if (!isGroup) return reply("❌ Réservé aux groupes !");
            if (!isAdmins && !isCreator) return reply("❌ Réservé aux administrateurs !");
            if (!args[0]) return reply("📌 Utilisation : .antilink delete on/off");

            if (args[0].toLowerCase() === 'on') {
                setSetting(from, "antilink", "delete");
                return reply("🛡️ Anti-liens activé en *MODE SUPPRESSION*\n\n⚠️ Les liens seront uniquement supprimés.");
            } 

            if (args[0].toLowerCase() === 'off') {
                setSetting(from, "antilink", false);
                return reply("🚫 Anti-liens désactivé pour ce groupe.");
            }

            return reply("📌 Utilisation : .antilink delete on/off");

        } catch (error) {
            console.error("Erreur anti-liens suppression :", error);
            reply("⚠️ Échec de la modification de l'anti-liens.");
        }
    }
};