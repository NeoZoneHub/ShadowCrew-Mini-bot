module.exports = {
    pattern: "8ball",
    desc: "La boule magique 8-Ball donne des réponses",
    category: "fun",
    react: "🎱",
    filename: __filename,
    execute: async (conn, mek, m, { from, q, reply }) => {
        if (!q) return reply("Posez une question oui/non ! Exemple : .8ball Vais-je devenir riche ?");

        let responses = [
            "Oui !", "Non.", "Peut-être...", "Absolument !", "Pas sûr.",
            "Re-demande plus tard.", "Je ne pense pas.", "Absolument !",
            "Pas du tout !", "Cela semble prometteur !"
        ];

        let answer = responses[Math.floor(Math.random() * responses.length)];

        await conn.sendMessage(from, {
            text: `🎱 *La boule magique 8-Ball dit :* ${answer}`,
            contextInfo: {
                mentionedJid: [`${m.sender.split('@')[0]}@s.whatsapp.net`], 
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363418906972955@newsletter',
                    newsletterName: 'ShadowCrew',
                    serverMessageId: 200
                }            
            }
        }, { quoted: mek });
    }
};