const { userInput, selectedCards } = req.body;

if (!selectedCards || selectedCards.length !== 3) {
  return res
    .status(400)
    .json({ error: "Invalid card selection. Exactly 3 cards required." });
}
