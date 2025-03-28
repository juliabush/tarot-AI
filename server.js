import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/get-tarot-reading', async (req, res) => {
    const { userInput, selectedCards } = req.body;  // Extract both user input & selected cards

    if (!selectedCards || selectedCards.length !== 3) {
        return res.status(400).json({ error: "Invalid card selection. Exactly 3 cards required." });
    }

    try {
        // Send a request to OpenAI to get the tarot reading
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
                        content: "You are a wise and articulate tarot reader. Your goal is to provide in-depth, insightful, and accurate tarot readings. Ensure your responses are always well-explained, detailed, and strictly related to tarot. Format the reading in three distinct sections for each card."
                    },
                    {
                        role: "user",
                        content: `The user has asked for a tarot reading: "${userInput}". The following three cards were drawn: 
                        
                        1. **${selectedCards[0]}**  
                        2. **${selectedCards[1]}**  
                        3. **${selectedCards[2]}**  

                        Please provide an insightful three-card reading. Format it into three sections, one for each card, and explain how they connect.`
                    }
                ],
                temperature: 0.8
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Send the response back to the client (frontend)
        res.json({ aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});



