import api from './api';

/**
 * Sends a message to the backend AI chatbot endpoint powered by Groq.
 * @param {string} message - The student's question or prompt
 * @returns {Promise<{success: boolean, message: string, data: {userMessage: string, aiResponse: string}}>}
 */
export const sendChatMessage = async (message) => {
    try {
        const response = await api.post('/api/v1/chat/message', { message });
        return response.data;
    } catch (err) {
        // Fallback path in case /api/chat/message is routed
        const fallback = await api.post('/api/chat/message', { message });
        return fallback.data;
    }
};

const chatService = {
    sendChatMessage
};

export default chatService;
