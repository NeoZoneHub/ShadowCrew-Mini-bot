const { isJidGroup } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const sentTracker = new Set();

const SETTINGS_DIR = './database';
const WELCOME_FILE = path.join(SETTINGS_DIR, 'welcome.json');
const GOODBYE_FILE = path.join(SETTINGS_DIR, 'goodbye.json');

if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

function loadSettings(file) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {}
    return {};
}

function isEnabled(groupId, file) {
    const settings = loadSettings(file);
    return settings[groupId] === true;
}

module.exports = async (conn, update) => {
    try {
        const { id, participants, action } = update;
        if (!id || !isJidGroup(id) || !participants) return;

        for (const participant of participants) {
            const userName = participant.split("@")[0];
            
            const msgKey = `${id}_${action}_${participant}`;
            if (sentTracker.has(msgKey)) {
                console.log(`⏭️ Message déjà envoyé pour ${action} de ${userName}, ignoré...`);
                continue;
            }

            if (action === "add") {
                if (!isEnabled(id, WELCOME_FILE)) {
                    console.log(`⏭️ Accueil désactivé pour ${id}`);
                    continue;
                }
                
                sentTracker.add(msgKey);

                const welcomeText = `@${userName} *_Bienvenue parmi nous ! Profitez pleinement du bot et amusez-vous bien 👀_*`;

                await conn.sendMessage(id, {
                    text: welcomeText,
                    mentions: [participant]
                });
                
                console.log(`✅ Message d'accueil envoyé à ${userName}`);
            }

            else if (action === "remove") {
                if (!isEnabled(id, GOODBYE_FILE)) {
                    console.log(`⏭️ Au revoir désactivé pour ${id}`);
                    continue;
                }
                
                sentTracker.add(msgKey);

                const goodbyeText = `@${userName} *_nous a quittés, tu vas nous manquer_*`;

                await conn.sendMessage(id, {
                    text: goodbyeText,
                    mentions: [participant]
                });
                
                console.log(`✅ Message d'au revoir envoyé pour ${userName}`);
            }
        }

    } catch (err) {
        console.error("Erreur GroupEvents:", err);
    }
};