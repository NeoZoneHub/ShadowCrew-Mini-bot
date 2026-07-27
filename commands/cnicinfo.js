const axios = require('axios');

module.exports = {
    pattern: "cnicinfo",
    desc: "Obtenir les informations d'un CNIC à partir du numéro",
    category: "tools",
    filename: __filename,
    use: ".cnicinfo 1234567890123",

    execute: async (conn, message, m, { from, reply, args, q }) => {
        try {
            let targetCnic = q ? q.replace(/[^0-9]/g, '') : '';

            if (!targetCnic || targetCnic.length < 13) {
                return reply('❌ Veuillez fournir un CNIC valide de 13 chiffres');
            }

            const res = await axios.get(`https://sychosimdatabase.vercel.app/api/lookup/${targetCnic}`, { timeout: 60000 });
            const data = res.data;

            if (!data.success || !data.results || data.results.length === 0) {
                return reply('❌ Aucune donnée trouvée auprès de la NADRA');
            }

            let txt = `🆔 *INFORMATIONS CNIC*\n\n`;

            data.results.forEach((r, i) => {
                txt += `*Enregistrement #${i+1}*\n📱 : ${r.mobile}\n👤 : ${r.name}\n🆔 : ${r.cnic}\n🏠 : ${r.address}\n\n`;
            });

            txt += `\n> ShadowCrew 💀`;

            await reply(txt);

        } catch (e) {
            console.error("Erreur CNIC info :", e);
            reply('❌ Aucune donnée trouvée auprès de la NADRA');
        }
    }
};