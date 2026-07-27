module.exports = {
    pattern: "vv",
    alias: ["wow", "nice", "mashallah", "good", "cool"],
    desc: "Enregistrer les médias à visualisation unique (image/vidéo/audio) en message privé",
    category: "tools",
    filename: __filename,
    use: ".jadu ou .vv (répondre à un média à visualisation unique)",

    execute: async (conn, message, m, { from, reply, sender, prefix, command }) => {
        try {
            if (!m.quoted) {
                return reply(`*Répondez à une image, une vidéo ou un audio avec la légende ${prefix + command}*`);
            }

            let mime = (m.quoted.msg || m.quoted).mimetype || '';

            try {
                if (/image/.test(mime)) {
                    let media = await m.quoted.download();
                    await conn.sendMessage(sender, {
                        image: media,
                        caption: "✅ Image à visualisation unique envoyée dans vos messages privés",
                    });
                    await reply("✅ Image enregistrée ! Vérifiez vos messages privés.");

                } else if (/video/.test(mime)) {
                    let media = await m.quoted.download();
                    await conn.sendMessage(sender, {
                        video: media,
                        caption: "✅ Vidéo à visualisation unique envoyée dans vos messages privés",
                    });
                    await reply("✅ Vidéo enregistrée ! Vérifiez vos messages privés.");

                } else if (/audio/.test(mime)) {
                    let media = await m.quoted.download();
                    await conn.sendMessage(sender, {
                        audio: media,
                        mimetype: 'audio/mpeg',
                        ptt: true
                    });
                    await reply("✅ Audio enregistré ! Vérifiez vos messages privés.");

                } else {
                    reply(`❌ Type de média non pris en charge !\nRépondez à une image, une vidéo ou un audio avec *${prefix + command}*`);
                }
            } catch (err) {
                console.error('Erreur de traitement du média :', err);
                reply(`Échec du traitement du média. Veuillez réessayer.`);
            }

        } catch (err) {
            console.error("Erreur de la commande jadu :", err);
            reply("❌ Échec de l'enregistrement du média.");
        }
    }
};