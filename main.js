import { config } from "dotenv";
config();

import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.API_KEY
});
const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

userSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const completion = await client.chat.completions.create ({
            model: "gpt-4o",
            messages: [{ role:"user", content: userInput.value}]
        });
        const aiResponse = completion.choices[0].message.content;
        dialogPopUp.innerHTML = `<p>${aiResponse}</p>`;
        dialogPopUp.showModal();
    } catch (error) {
        console.error("Error:", error);
    }
});
