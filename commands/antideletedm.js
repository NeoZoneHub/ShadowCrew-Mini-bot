const { getSetting, setSetting } = require('../Settings.js');

module.exports = {
    pattern: "antideletedm",
    desc: "Activer/désactiver l'anti-suppression pour les messages privés",
    category: "owner",
    filename: __filename,
    use: ".antideletedm on/off",

    execute: async (conn, message, m, { from, isCreator, reply, args }) => {
        try {
            if (!isCreator) return reply("❌ Réservé au propriétaire !");
            if (!args[0]) return reply("📌 Utilisation : .antideletedm on/off");

            if (args[0].toLowerCase() === 'on') {
                setSetting('bot', "antideletedm", true);
                global.antiDeleteDM = true;
                return reply("✅ Anti-suppression des messages privés activé !\n\n🔍 Les messages supprimés seront transférés au propriétaire du bot.");
            } 
            
            if (args[0].toLowerCase() === 'off') {
                setSetting('bot', "antideletedm", false);
                global.antiDeleteDM = false;
                return reply("❌ Anti-suppression des messages privés désactivé !");
            }
            
            return reply("📌 Utilisation : .antideletedm on/off");

        } catch (error) {
            console.error("Erreur anti-suppression DM :", error);
            reply("⚠️ Échec de la modification de l'anti-suppression des messages privés.");
        }
    }
};