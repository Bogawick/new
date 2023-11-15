const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Flujo para solicitar el nombre del usuario
const flowSolicitarNombre = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer(['Hola, bienvenido a mi servicio de programación web. ¿Cuál es tu nombre completo?']);

// Flujo para mostrar la lista de servicios
const flowListaServicios = addKeyword(['1', '2', '3', '4'])
    .addAnswer([
        'Elige el tipo de proyecto que te interesa:',
        '1. Desarrollo de sitios web',
        '2. Creación de aplicaciones web',
        '3. Mantenimiento y actualización de sitios web',
        '4. Otros servicios de programación',
        'Escribe el número de tu elección.'
    ])
    .addAnswer(['¿Algo más en lo que pueda ayudarte?'])
    .addAnswer(['Escribe "volver" para regresar al menú principal o "finalizar" para terminar la conversación.']);

// Flujo para volver al menú principal
const flowRegresarOMenu = addKeyword(['volver'])
    .addAnswer(['Regresando al menú principal...'])
    .addAnswer(flowSolicitarNombre.answers);  // Suponiendo que este es tu flujo principal

// Flujo para finalizar la conversación
const flowFinalizar = addKeyword(['finalizar'])
    .addAnswer(['Gracias por contactarme. ¡Que tengas un buen día!']);

/**
 * Esta es la función importante, la que realmente inicia el chatbot.
 */
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowSolicitarNombre, flowListaServicios, flowRegresarOMenu, flowFinalizar]);
    const adapterProvider = createProvider(WebWhatsappProvider);
    
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
}

main();
