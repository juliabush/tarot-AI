import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables

const app = express();

// CORS setup
const corsOptions = {
  origin: "https://asktarotanything.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Static file path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(__dirname));

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Tarot reading endpoint (no cards)
app.post("/get-tarot-reading", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput || userInput.trim() === "") {
    return res.status(400).json({ error: "User input is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a wise and articulate tarot reader. Your goal is to provide in-depth, insightful, and accurate tarot readings. Always relate your answers to the user's input. Include hypothetical scenarios, symbolic objects, first initials of names, dates, angel numbers, and wild, surreal visuals. Be bold and creative, unbound by logic, making the user feel like it's a mystical deja vu. Format the reading into three symbolic stages and finish with a dramatic, whimsical conclusion title.",
          },
          {
            role: "user",
            content: `The user has asked for a tarot reading: "${userInput}". Please provide a symbolic and immersive tarot reading divided into three themed sections. Make it wild, mystical, hypothetical, and psychic.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return res
        .status(500)
        .json({ error: "Failed to get tarot reading from OpenAI" });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

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
