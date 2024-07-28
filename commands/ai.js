const axios = require('axios');

module.exports = {
    name: 'ai',
    description: 'Ask ai',
    cooldown: 3,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const input = args.join(' ');

        if (!input) {
            api.sendMessage(
                `Hello there!\n\n I am here to assist you with any questions or tasks you may have.\n\nUsage: ai [your question]`,
                event.threadID,
                event.messageID
            );
            return;
        }

        api.sendMessage(`Processing your request...`, event.threadID, event.messageID);

        try {
            const { data } = await axios.get(`https://nash-api-end.onrender.com/gpt3?prompt=${encodeURIComponent(input)}`);
            
            if (!data || !data.result || !data.result.reply) {
                throw new Error('Ayaw mag response ang gago');
            }
            
            const response = data.result.reply;

            const options = { timeZone: 'Africa/Porto-Novo', hour12: false };
            const timeString = new Date().toLocaleString('en-US', options);

            const finalResponse = `${response}\n\nAsk info: ${timeString}`;
            api.sendMessage(finalResponse, event.threadID, event.messageID);
        } catch (error) {
            let errorMessage = 'An error occurred while processing your request, please try sending your question again.';
            
            if (error.response && error.response.data) {
                errorMessage = `API returned an error: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
            console.error(error);
        }
    },
};
