const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

userSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a wise and articulate tarot reader. Your goal is to provide in-depth, insightful, and accurate tarot readings. Ensure your responses are always well-explained, detailed, and strictly related to tarot."
                    },
                    {
                        role: "user",
                        content: userInput.value
                    }
                ],
                temperature: 0.8 
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        dialogPopUp.innerHTML = `<p>${aiResponse}</p>`;
        dialogPopUp.showModal();
    } catch (error) {
        console.error("Error:", error);
    }
});

