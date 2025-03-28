import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();  // Ensure the API_KEY is loaded from the .env file

const app = express();

// Set up CORS
const corsOptions = {
    origin: 'https://asktarotanything.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Apply CORS middleware

// Parse incoming JSON bodies
app.use(express.json());  // Required for POST requests

// Path setup for static files (index.html)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Tarot reading endpoint
app.post('/get-tarot-reading', async (req, res) => {
    const { userInput, selectedCards } = req.body;  // Extract both user input & selected cards

    if (!selectedCards || selectedCards.length !== 3) {
        return res.status(400).json({ error: "Invalid card selection. Exactly 3 cards required." });
    }

    try {
        // Send request to OpenAI API for tarot reading
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a wise and articulate tarot reader. Your goal is to provide in-depth, insightful, and accurate tarot readings. Ensure your responses are always well-explained, detailed, and strictly related to tarot. Please try and incorporate hypothetical situations realting to the user input, specific objects, possible names, angel number and figures, as a way to make the tarot reading seem personally tailored and specific. Be bold with your guesses and visuals, as delusional as you can yet still use examples that would happen in real life, lose any logic and balance. Format the reading in three distinct sections for each card and a cohesive yet bombastic and wild conclusion."
                    },
                    {
                        role: "user",
                        content: `The user has asked for a tarot reading: "${userInput}". The following three cards were drawn: 
                        
                        1. **${selectedCards[0]}**  
                        2. **${selectedCards[1]}**  
                        3. **${selectedCards[2]}**  

                        Please provide an insightful three-card reading. Format it into three sections, one for each card, and explain how they connect in a cohesive conclusion. Make it wild, hypothetical and with delusional guesses`
                    }
                ],
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            return res.status(500).json({ error: "Failed to get tarot reading from OpenAI" });
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Send the tarot reading response back to the frontend
        res.json({ aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});



