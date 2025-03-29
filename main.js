async function sendTarotReading(selectedCards) {
    try {
        // Show dialog instantly with loading animation
        dialogPopUp.innerHTML = `
            <div class="loading-container">
                <div class="skeleton"></div>
                <p class="loading-text">Shuffling the stars...</p>
            </div>
        `;
        dialogPopUp.showModal();

        const response = await fetch("https://tarot-ai-jbka.onrender.com/get-tarot-reading", {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userInput: userInput.value,
                selectedCards: selectedCards
            })
        });

        const data = await response.json();
        const aiResponse = data.aiResponse; // Full AI response as text

        // Replace loading screen with AI response
        dialogPopUp.innerHTML = `<p id="typingEffect"></p>`;
        const typingElement = document.getElementById("typingEffect");
        typeText(aiResponse, typingElement);

    } catch (error) {
        console.error("Error:", error);
        dialogPopUp.innerHTML = `<p style="color: red;">Something went wrong. Try again.</p>`;
    }
}
