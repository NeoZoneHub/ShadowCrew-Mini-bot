const fs = require('fs');
const path = require('path');

module.exports = {
    pattern: "mode",
    desc: "Vérifier ou modifier le mode du bot (Public/Privé)",
    category: "owner",
    filename: __filename,
    use: ".mode / .mode public / .mode private",

    execute: async (conn, message, m, { from, isCreator, reply, args }) => {
        try {
            if (!isCreator) return reply("❌ Réservé au propriétaire !");

            let currentMode = conn.public ? "public" : "private";

            if (!args[0]) {
                return reply(`⚙️ *Mode du bot*\n\n📌 Mode actuel : *${currentMode.toUpperCase()}*\n\n📝 Utilisation :\n.mode public - Mode public (tout le monde peut utiliser)\n.mode private - Mode privé (seul le propriétaire peut utiliser)`);
            }

            const mode = args[0].toLowerCase();
            const botModeFile = path.join(__dirname, '../database', 'botmode.txt');

            const dir = path.dirname(botModeFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (mode === 'public') {
                conn.public = true;
                fs.writeFileSync(botModeFile, 'public');
                return reply("✅ *Mode public activé*\n\nTout le monde peut désormais utiliser le bot.");
            } 

            if (mode === 'private' || mode === 'self') {
                conn.public = false;
                fs.writeFileSync(botModeFile, 'private');
                return reply("✅ *Mode privé activé*\n\nSeul le propriétaire peut désormais utiliser le bot.");
            }

            return reply("❌ Mode invalide !\n\nUtilisez : .mode public ou .mode private");

        } catch (err) {
            console.error("Erreur de mode :", err);
            reply("❌ Échec du changement de mode du bot.");
        }
    }
};