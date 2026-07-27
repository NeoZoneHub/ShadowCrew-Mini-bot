const axios = require("axios");

module.exports = {
    pattern: "pair",
    desc: "Connectez votre WhatsApp à ShadowCrew pour des fonctionnalités améliorées",
    react: "💓",
    category: "utility",
    filename: __filename,

    execute: async (conn, mek, m, { from, args, q, reply }) => {
        const sendMessageWithContext = async (text, quoted = mek) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363418906972955@newsletter",
                        newsletterName: "ShadowCrew",
                        serverMessageId: 200
                    }
                }
            }, { quoted: quoted });
        };

        try {
            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
            }

            const pairingMessage = `🔑 *ShadowCrew - Instructions d'appairage* 🔑\n\n` +
                                `🌐 *Lien d'appairage :* https://qadeerxtech.onrender.com\n\n` +
                                `📋 *Comment se connecter :*\n` +
                                `1. Entrez votre numéro WhatsApp avec l'indicatif du pays (sans "+", sans parenthèses, sans espaces)\n` +
                                `2. Cliquez sur "Demander le code d'appairage"\n` +
                                `3. Copiez le code à 8 chiffres\n` +
                                `4. Ouvrez WhatsApp → Paramètres → Appareils liés → Lier un appareil\n` +
                                `5. Collez le code lorsque vous y êtes invité\n\n` +
                                `💡 *Exemple :*\n` +
                                `Numéro : 923300005253 (pour un numéro pakistanais)\n` +
                                `Format : Indicatif pays + Numéro sans espaces ni symboles\n\n` +
                                `✅ *Avantages :*\n` +
                                `• Téléchargement de médias amélioré\n` +
                                `• Audio/vidéo de meilleure qualité\n` +
                                `• Ouvre les messages "vue unique"\n\n` +
                                `> _Propulsé par ShadowCrew_`;

            await sendMessageWithContext(pairingMessage);

        } catch (e) {
            console.error("❌ Erreur de la commande pair :", e.message);
            await sendMessageWithContext(`⚠️ Erreur : ${e.message}`);
        }
    }
};