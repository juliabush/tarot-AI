// Getting the submit button, user input field, and dialog popup
const userSubmitButton = document.getElementById("user-submit-button");
const userInput = document.getElementById("user-input");
const dialogPopUp = document.getElementById("dialog-popup");

/**
 * Sends the user input to the server and shows the AI-generated tarot reading.
 */
async function sendTarotReading() {
  try {
    // Show loading popup (no close button yet)
    setTimeout(() => {
      dialogPopUp.innerHTML = `
        <div class="tarot-loading-container">
          <p class="tarot-loading-text">&#10024; Consulting the stars for your personal guidance...</p>
          <div class="tarot-skeleton-loader"></div>
        </div>
      `;
      dialogPopUp.showModal();
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

    // Replace loading screen with the AI typing effect and close button
    dialogPopUp.innerHTML = `
      <button id="closeDialogButton" class="close-dialog-button" style="position: absolute; top: 10px; right: 10px;">&times;</button>
      <div class="tarot-response" style="margin-top: 40px;">
        <div id="typingEffect" style="color: pink; font-size: 1rem; line-height: 1.6;"></div>
      </div>
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
 * Displays the formatted tarot reading with bold and line breaks.
 * Converts markdown bold (**bold**) to <strong> and replaces newlines with <br>.
 */
function typeText(text, element) {
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Markdown to <strong>
    .replace(/\n/g, "<br>"); // Newlines to <br>

  element.innerHTML = formattedText;
}

// Attach event listener for user submitting their question
userSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
  sendTarotReading();
});
