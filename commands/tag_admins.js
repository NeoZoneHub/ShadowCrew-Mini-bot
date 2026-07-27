module.exports = {
    pattern: "tagadmins",
    desc: "Taguer tous les administrateurs du groupe",
    category: "group",
    use: '.tagadmins [message]',
    filename: __filename,

    execute: async (conn, message, m, { args, q, reply, from, isGroup, groupMetadata }) => {
        try {
            if (!isGroup) {
                return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
            }

            let metadata;
            try {
                metadata = await conn.groupMetadata(from);
            } catch (error) {
                return reply("❌ Échec de la récupération des informations du groupe.");
            }

            const admins = metadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => p.id);

            const totalAdmins = admins.length;
            if (totalAdmins === 0) {
                return reply("❌ Aucun administrateur trouvé dans ce groupe.");
            }

            const emojis = ['👑', '⚡', '🌟', '✨', '🎖️', '💎', '🔱', '🛡️', '🚀', '🏆'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            const customMessage = q || "Attention administrateurs !";
            const groupName = metadata.subject || "Groupe inconnu";

            let teks = `▢ *Groupe* : ${groupName}\n`;
            teks += `▢ *Administrateurs* : ${totalAdmins}\n`;
            teks += `▢ *Message* : ${customMessage}\n\n`;
            teks += `┌───⊷ *MENTIONS DES ADMINISTRATEURS*\n`;

            admins.forEach(adminId => {
                teks += `│${randomEmoji} @${adminId.split('@')[0]}\n`;
            });

            teks += "└──❍ ShadowCrew ❍──";

            await conn.sendMessage(from, {
                text: teks,
                mentions: admins,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew",
                        serverMessageId: 201
                    }
                }
            }, { quoted: message });

        } catch (error) {
            console.error("Erreur tagadmins :", error);
            reply(`❌ Erreur : ${error.message}`);
        }
    }
};