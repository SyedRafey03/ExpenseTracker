require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function list() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(data.models.map(m => m.name));
    } catch(err) {
        console.error("ERROR:", err);
    }
}
list();
