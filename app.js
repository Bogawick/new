const fs = require('fs');
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Define la ruta del archivo de sesión
const SESSION_FILE_PATH = './whatsapp-session.json';

// Crear el archivo de sesión si no existe
if (!fs.existsSync(SESSION_FILE_PATH)) {
    fs.writeFileSync(SESSION_FILE_PATH, '{}');
}

// Tus flujos de conversación adicionales
// Asegúrate de definir estos flujos (flowDocs, flowGracias, flowTuto, flowDiscord)
// ...

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario']);
// ... otros flujos ...

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowSecundario]); // Asegúrate de incluir todos los flujos aquí
    const adapterProvider = createProvider(BaileysProvider, {
        auth: loadSession()
    });

    const bot = createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    bot.provider.on('authenticated', (session) => {
        saveSession(session);
    });

    // Aquí puedes agregar más lógica o manejo de eventos según sea necesario
}

const saveSession = (session) => {
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
}

const loadSession = () => {
    if (fs.existsSync(SESSION_FILE_PATH)) {
        return JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf-8'));
    }
    return {}; // Retorna un objeto vacío si no hay sesión guardada
}

main().catch(error => {
    console.error('Error al iniciar el bot:', error);
});
