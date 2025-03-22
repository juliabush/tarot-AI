const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

userSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/get-tarot-reading', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userInput: userInput.value
            })
        });

        const data = await response.json();
        const aiResponse = data.aiResponse;

        dialogPopUp.innerHTML = `<p>${aiResponse}</p>`;
        dialogPopUp.showModal();
    } catch (error) {
        console.error("Error:", error);
    }
});


