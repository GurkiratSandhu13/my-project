const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" }
];

app.get("/cards", (req, res) => {
  res.status(200).json(cards);
});

app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);
  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }
  res.status(200).json(card);
});

app.post("/cards", (req, res) => {
  const { suit, value } = req.body;
  const newCard = {
    id: cards.length + 1,
    suit,
    value
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

app.put("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Card not found" });
  }

  const { suit, value } = req.body;
  cards[index] = { id, suit, value };

  res.status(200).json(cards[index]);
});

app.patch("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  const { suit, value } = req.body;
  if (suit) card.suit = suit;
  if (value) card.value = value;

  res.status(200).json(card);
});

app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = cards.findIndex(c => c.id === id);

  if (cardIndex === -1) {
    return res.status(404).json({ message: "Card not found" });
  }

  const removedCard = cards.splice(cardIndex, 1)[0];
  res.status(200).json({
    message: `Card with ID ${id} removed`,
    card: removedCard
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
