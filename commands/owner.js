module.exports = {
    pattern: "owner",
    desc: "Obtenir la carte de contact du propriétaire du bot",
    category: "info",
    filename: __filename,
    use: ".owner",

    execute: async (conn, message, m, { from, reply }) => {
        try {
            const vcard1 = 'BEGIN:VCARD\n' +
                          'VERSION:3.0\n' +
                          'FN:Digital crew 243\n' +
                          'TEL;type=CELL;type=VOICE;waid=96899861161:+968 9986 1161\n' +
                          'END:VCARD';

            const vcard2 = 'BEGIN:VCARD\n' +
                          'VERSION:3.0\n' +
                          'FN:Digital crew 243\n' +
                          'TEL;type=CELL;type=VOICE;waid=97466784024:+974 6678 4024\n' +
                          'END:VCARD';

            await conn.sendMessage(from, {
                contacts: {
                    displayName: 'ShadowCrew 💀 Propriétaires',
                    contacts: [
                        { vcard: vcard1 },
                        { vcard: vcard2 }
                    ]
                }
            }, { quoted: message });

        } catch (err) {
            console.error("Erreur de la commande owner :", err);
            reply("❌ Échec de l'envoi de la carte de contact.");
        }
    }
};