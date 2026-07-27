const axios = require('axios');

module.exports = {
    pattern: "weather",
    desc: "🌤 Obtenir les informations météo pour un lieu",
    react: "🌤",
    category: "other",
    filename: __filename,
    use: ".weather [nom de la ville]",

    execute: async (conn, message, m, { from, q, reply, sender }) => {
        const sendMessageWithContext = async (text, quoted = message) => {
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
            if (!q) return await sendMessageWithContext("❗ Veuillez fournir un nom de ville. Utilisation : .weather [nom de la ville]");

            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: message.key } });
            }

            const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
            const city = q;
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            const data = response.data;

            const weather = `
🌍 *Informations météo pour ${data.name}, ${data.sys.country}* 🌍
🌡️ *Température* : ${data.main.temp}°C
🌡️ *Ressenti* : ${data.main.feels_like}°C
🌡️ *Température min* : ${data.main.temp_min}°C
🌡️ *Température max* : ${data.main.temp_max}°C
💧 *Humidité* : ${data.main.humidity}%
☁️ *Météo* : ${data.weather[0].main}
🌫️ *Description* : ${data.weather[0].description}
💨 *Vitesse du vent* : ${data.wind.speed} m/s
🔽 *Pression* : ${data.main.pressure} hPa

*© _Propulsé par ShadowCrew_*
`;
            return await sendMessageWithContext(weather);
        } catch (e) {
            console.log(e);
            if (e.response && e.response.status === 404) {
                return await sendMessageWithContext("🚫 Ville introuvable. Veuillez vérifier l'orthographe et réessayer.");
            }
            return await sendMessageWithContext("⚠️ Une erreur est survenue lors de la récupération des informations météo. Veuillez réessayer plus tard.");
        }
    }
};