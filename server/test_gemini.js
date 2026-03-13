require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent("hello");
        console.log("SUCCESS:", result.response.text());
    } catch(err) {
        console.error("SDK ERROR:", err);
    }
}
test();
