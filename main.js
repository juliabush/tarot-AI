// Getting the submit button, user input field, and dialog popup
const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

/**
 * Sends the user input to the server and shows the AI-generated tarot reading.
 */
async function sendTarotReading() {
  try {
    // Show loading popup (with a close button)
    setTimeout(() => {
      dialogPopUp.innerHTML = `
        <button id="closeDialogButton" class="close-dialog-button">&times;</button>
        <div class="tarot-loading-container">
          <p class="tarot-loading-text">&#10024; Consulting the stars for your personal guidance...</p>
          <div class="tarot-skeleton-loader"></div>
        </div>
      `;
      dialogPopUp.showModal();

      // Add close functionality
      const closeButton = document.getElementById("closeDialogButton");
      closeButton.addEventListener("click", () => {
        dialogPopUp.close();
      });
    }, 500); // Slight delay for smoother feel

    // POST the user input to backend API
    const response = await fetch(
      "https://tarot-ai-jbka.onrender.com/get-tarot-reading",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userInput.value,
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data.aiResponse;

    // Replace loading screen with the AI typing effect
    dialogPopUp.innerHTML = `
      <button id="closeDialogButton" class="close-dialog-button">&times;</button>
      <p id="typingEffect"></p>
    `;

    const typingElement = document.getElementById("typingEffect");
    typeText(aiResponse, typingElement);

    // Reattach close button event
    const closeButton = document.getElementById("closeDialogButton");
    closeButton.addEventListener("click", () => {
      dialogPopUp.close();
    });
  } catch (error) {
    console.error("Error:", error);
    dialogPopUp.innerHTML = `<p class="tarot-error-message">Something went wrong. Try again.</p>`;
  }
}

/**
 * Types out text word-by-word with a delay for a typing effect.
 * @param {string} text - Text to type.
 * @param {HTMLElement} element - HTML element to type into.
 */
function typeText(text, element) {
  const words = text.split(" ");
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      element.innerHTML += words[index] + " ";
      index++;
    } else {
      clearInterval(interval);
    }
  }, 100); // Typing speed
}

// Attach event listener for user submitting their question
userSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
  sendTarotReading();
});
