import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/get-tarot-reading', async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.API_KEY}` 
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a wise and articulate tarot reader. Your goal is to provide in-depth, insightful, and accurate tarot readings. Ensure your responses are always well-explained, detailed, and strictly related to tarot. Divide the responses into digestible paragraphs with titles"
                    },
                    {
                        role: "user",
                        content: userInput
                    }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        res.json({ aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

