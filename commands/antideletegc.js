const { getSetting, setSetting } = require('../Settings.js');

module.exports = {
    pattern: "antideletegc",
    desc: "Activer/désactiver l'anti-suppression pour les groupes",
    category: "group",
    filename: __filename,
    use: ".antideletegc on/off",

    execute: async (conn, message, m, { from, isGroup, isAdmins, isCreator, reply, args }) => {
        try {
            if (!isGroup) return reply("❌ Réservé aux groupes !");
            if (!isAdmins && !isCreator) return reply("❌ Réservé aux administrateurs !");
            if (!args[0]) return reply("📌 Utilisation : .antideletegc on/off");

            if (args[0].toLowerCase() === 'on') {
                setSetting(from, "antideletegc", true);
                return reply("✅ Anti-suppression des messages de groupe activé !\n\n🔍 Les messages supprimés seront transférés au propriétaire du bot.");
            } 

            if (args[0].toLowerCase() === 'off') {
                setSetting(from, "antideletegc", false);
                return reply("❌ Anti-suppression des messages de groupe désactivé !");
            }

            return reply("📌 Utilisation : .antideletegc on/off");

        } catch (error) {
            console.error("Erreur anti-suppression groupe :", error);
            reply("⚠️ Échec de la modification de l'anti-suppression des messages de groupe.");
        }
    }
};