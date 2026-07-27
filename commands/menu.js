const fs = require('fs');
const path = require('path');

module.exports = {
    pattern: "menu",
    desc: "Afficher toutes les commandes disponibles",
    category: "utility",
    react: "📋",
    use: ".menu",
    filename: __filename,

    execute: async (conn, message, m, { from, reply, userPrefix, isGroup }) => {
        try {
            const prefix = userPrefix || ".";
            const NEWSLETTER_JID = "120363425629935700@newsletter";
            const NEWSLETTER_NAME = "ShadowCrew 💀";
            const menuImage = 'https://up6.cc/2026/04/177631893622821.jpg';

            const botName = "𓆩 ShadowCrew 💀𓆪";
            const ownerName = "Digital crew 243";
            const version = "2.0";
            const platform = "WhatsApp";

            const commandsPath = path.join(__dirname, '..');
            let allCommands = [];

            if (fs.existsSync(commandsPath)) {
                const commandFiles = fs.readdirSync(commandsPath).filter(file => 
                    file.endsWith('.js') && !file.startsWith('.')
                );

                for (const file of commandFiles) {
                    try {
                        const filePath = path.join(commandsPath, file);
                        delete require.cache[require.resolve(filePath)];
                        const commandModule = require(filePath);

                        if (commandModule.pattern) {
                            allCommands.push({
                                pattern: commandModule.pattern,
                                category: commandModule.category || 'general'
                            });
                        } else if (typeof commandModule === 'object') {
                            for (const [cmdName, cmdData] of Object.entries(commandModule)) {
                                if (cmdData.pattern) {
                                    allCommands.push({
                                        pattern: cmdData.pattern,
                                        category: cmdData.category || 'general'
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Erreur de chargement de ${file}:`, error.message);
                    }
                }
            }

            const commandsByCategory = {};
            allCommands.forEach(cmd => {
                const category = cmd.category || 'general';
                if (!commandsByCategory[category]) {
                    commandsByCategory[category] = [];
                }
                commandsByCategory[category].push(cmd.pattern);
            });

            const categoryEmojis = {
                'owner': '👑',
                'group': '👥',
                'download': '📥',
                'ai': '🤖',
                'tools': '🛠️',
                'fun': '🎮',
                'game': '🎲',
                'sticker': '🎨',
                'voice': '🎤',
                'reaction': '😊',
                'text': '✍️',
                'image': '🖼️',
                'misc': '📱',
                'utility': '🛠️',
                'whatsapp': '📡',
                'general': '📌'
            };

            let menuText = `
╭━━〔 ☠️ TOUTES LES COMMANDES ☠️ 〕━━┈⊷
┃✮╭────────────────
┃✮│ 🤖 BOT  : ${botName}
┃✮│ 👑 PROPRIÉTAIRE : ${ownerName}
┃✮│ 📦 VERSION : ${version}
┃✮│ 📡 PLATEFORME : ${platform}
┃✮│ 📋 TOTAL : ${allCommands.length} commandes
┃✮╰────────────────
╰━━━━━━━━━━━━━━━━━━━━━┈⊷

`;

            for (const [category, commands] of Object.entries(commandsByCategory)) {
                const emoji = categoryEmojis[category] || '📌';
                const categoryName = category.toUpperCase();
                menuText += `\n╭━━〔 ${emoji} ${categoryName} 〕━━┈⊷\n`;
                
                commands.sort().forEach(cmd => {
                    menuText += `┃✮│➣ ${prefix}${cmd}\n`;
                });
                
                menuText += `╰━━━━━━━━━━━━━━━━━━━━━┈⊷\n`;
            }

            menuText += `
╭━━━━━━━━━━━━━━━━━━━━━┈⊷
┃ PROPULSÉ PAR ${botName}
╰━━━━━━━━━━━━━━━━━━━━━┈⊷`;

            await conn.sendMessage(from, {
                image: { url: menuImage },
                caption: menuText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: NEWSLETTER_JID,
                        newsletterName: NEWSLETTER_NAME,
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });

        } catch (err) {
            console.error("Erreur du menu :", err);
            reply("❌ Échec du chargement du menu.");
        }
    }
};