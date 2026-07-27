module.exports = {
    pattern: "tagall",
    desc: "Taguer tous les membres avec une liste formatée",
    category: "group",
    use: '.tagall [message]',
    filename: __filename,

    execute: async (conn, message, m, { args, q, reply, from, isGroup, groupMetadata, sender }) => {
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

            const participant = metadata.participants.find(p => p.id === sender);
            const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            const botNumber = conn.user.id.split(':')[0];
            const senderNumber = sender.split('@')[0];
            const isOwner = botNumber === senderNumber;

            if (!isAdmin && !isOwner) {
                return reply("❌ Seuls les administrateurs du groupe ou le propriétaire du bot peuvent utiliser cette commande.");
            }

            const participants = metadata.participants;
            const totalMembers = participants.length;

            if (totalMembers === 0) {
                return reply("❌ Aucun membre trouvé dans ce groupe.");
            }

            const emojis = ['📢', '🔊', '🌐', '🚀', '🎉', '🔥', '⚡', '👻', '💎', '🏆'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            const customMessage = q || "Attention à tous !";
            const groupName = metadata.subject || "Groupe inconnu";

            let teks = `▢ *Groupe* : ${groupName}\n`;
            teks += `▢ *Membres* : ${totalMembers}\n`;
            teks += `▢ *Message* : ${customMessage}\n\n`;
            teks += `┌───⊷ *MENTIONS*\n`;

            participants.forEach(mem => {
                if (mem.id) {
                    teks += `│${randomEmoji} @${mem.id.split('@')[0]}\n`;
                }
            });

            teks += "└──♜ ShadowCrew ♜──";

            await conn.sendMessage(from, {
                text: teks,
                mentions: participants.map(p => p.id),
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew",
                        serverMessageId: 200
                    }
                }
            }, { quoted: message });

        } catch (error) {
            console.error("Erreur tagall :", error);
            reply(`❌ Erreur : ${error.message}`);
        }
    }
};