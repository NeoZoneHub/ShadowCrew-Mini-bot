module.exports = {
    pattern: "cid",
    alias: ["newsletter", "id", "channelid"],
    react: "⏳",
    desc: "Get WhatsApp Channel info from link",
    category: "whatsapp",
    filename: __filename,
    use: ".cid https://whatsapp.com/channel/xxxxxxxxx",

    execute: async (conn, message, m, { from, args, q, reply, sender }) => {
        const sendFancyReply = async (text, quoted = message) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "DIGITAL CREW 243",
                        serverMessageId: 200
                    },
                    externalAdReply: {
                        title: "📡 Channel Info",
                        body: "DIGITAL CREW 243",
                        thumbnailUrl: "https://files.catbox.moe/6dhr11.jpg",
                        sourceUrl: "https://github.com/QadeerXTech/QADEER-AI",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: quoted });
        };

        try {
            if (!q) return reply("❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/123456789");

            const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
            if (!match) return reply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");

            const inviteId = match[1];

            let metadata;
            try {
                metadata = await conn.newsletterMetadata("invite", inviteId);
            } catch (e) {
                return reply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
            }

            if (!metadata || !metadata.id) return reply("❌ Channel not found or inaccessible.");

            const infoText = `📡 Channel Info\n\n` +
                `🛠️ *ID:* ${metadata.id}\n` +
                `📌 *Name:* ${metadata.name}\n` +
                `👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
                `📅 *Created on:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID") : "Unknown"}`;

            if (metadata.preview) {
                await conn.sendMessage(from, {
                    image: { url: `https://pps.whatsapp.net${metadata.preview}` },
                    caption: infoText
                }, { quoted: m });
            } else {
                await sendFancyReply(infoText);
            }

        } catch (error) {
            console.error("❌ Error in .cid plugin:", error);
            reply("⚠️ An unexpected error occurred.");
        }
    }
};