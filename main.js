const cardContainers = [
    document.getElementById("card1"),
    document.getElementById("card2"),
    document.getElementById("card3")
];

const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

let intervals = [];
let finalCards = [];

function highlightRandomCards(duration) {
    intervals.forEach(clearInterval);
    intervals = [];

    cardContainers.forEach((container) => {
        const cards = Array.from(container.getElementsByTagName("img"));

        let interval = setInterval(() => {
            cards.forEach(card => card.classList.remove("visible"));

            let randomCard = cards[Math.floor(Math.random() * cards.length)];
            randomCard.classList.add("visible");

            setTimeout(() => {
                randomCard.classList.remove("visible");
            }, duration);
        }, duration);

        intervals.push(interval);
    });
}

highlightRandomCards(1200);

userSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    intervals.forEach(clearInterval);
    intervals = [];

    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
        cardContainers.forEach(container => {
            const cards = Array.from(container.getElementsByTagName("img"));
            cards.forEach(card => card.classList.remove("visible"));

            let randomCard = cards[Math.floor(Math.random() * cards.length)];
            randomCard.classList.add("visible");
        });

        shuffleCount++;
        if (shuffleCount > 10) {
            clearInterval(shuffleInterval);

            finalCards = cardContainers.map(container => {
                const cards = Array.from(container.getElementsByTagName("img"));
                let selectedCard = cards.find(card => card.classList.contains("visible"));

                if (!selectedCard) {
                    selectedCard = cards[Math.floor(Math.random() * cards.length)];
                    selectedCard.classList.add("visible");
                }
                return selectedCard;
            });

            const selectedCardNames = finalCards.map(card => card.alt);

            console.log("Final selected cards:", selectedCardNames); // Debugging
            sendTarotReading(selectedCardNames);
        }
    }, 150); // Slightly increased for smoother effect
});
async function sendTarotReading(selectedCards) {
    try {
        // Create HTML for displaying selected cards
        const selectedCardsHTML = selectedCards.map(cardName => `
            <div class="tarot-card">
                <img src="tarot-card-images/cups/${cardName}.jpg" alt="${cardName}" class="tarot-card-image">
                <p class="tarot-card-name">${cardName}</p>
            </div>
        `).join(""); // Join to prevent commas in output

        // Show loading popup with selected cards
        setTimeout(() => {
            dialogPopUp.innerHTML = `
                <div class="tarot-loading-container">
                    <p class="tarot-loading-text">&#10024; Consulting the stars for your personal guidance...</p>
                    <div class="tarot-selected-cards">${selectedCardsHTML}</div>
                    <div class="tarot-skeleton-loader"></div>
                </div>
            `;
            dialogPopUp.showModal();
        }, 1200); // Delay before loader appears

        // Fetch AI response
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
        const aiResponse = data.aiResponse;

        // Replace loading with AI response
        dialogPopUp.innerHTML = `<p id="typingEffect"></p>`;
        const typingElement = document.getElementById("typingEffect");
        typeText(aiResponse, typingElement);

    } catch (error) {
        console.error("Error:", error);
        dialogPopUp.innerHTML = `<p class="tarot-error-message">Something went wrong. Try again.</p>`;
    }
}
function formatText(text) {
    return text
        .replace(/\*\*([\s\S]*?)\*\*/g, "<strong style='color:rgb(167, 38, 156);'>$1</strong>")
}
// Function to display text word by word
function typeText(text, element) {
    const words = text.split(" ");
    let index = 0;

    const interval = setInterval(() => {
        if (index < words.length) {
            element.innerHTML += words[index] + " ";
            index++;
        } else {
            clearInterval(interval); // Stop when done
        }
    }, 100); // Adjust speed (100ms per word)
}


