import { config } from "dotenv";
config();

import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.API_KEY
});

async function getChatResponse() {
    try {
        const completion = await client.chat.completions.create ({
            model: "gpt-4o",
            messages: [{ role:"user", content:"Hello ChatGPT"}]
        });
        console.log("ChatGPT:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error);
    }
}

getChatResponse();