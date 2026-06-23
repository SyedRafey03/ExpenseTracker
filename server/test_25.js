require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        for(let i=0; i<3; i++) {
            console.log("Attempt", i+1);
            const result = await model.generateContent("hello");
            console.log("SUCCESS:", result.response.text());
        }
    } catch(err) {
        console.error("SDK ERROR:", err);
    }
}
test();
