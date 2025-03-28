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
        const response = await fetch("https://asktarotanything.com/get-tarot-reading", {  
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

        dialogPopUp.innerHTML = `<p>${aiResponse}</p>`;
        dialogPopUp.showModal();
    } catch (error) {
        console.error("Error:", error);
    }
}

