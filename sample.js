export const data = [
  {
    title: "one",
    order: 1,
  },
  {
    title: "two",
    order: 2,
  },
  {
    title: "three",
    order: 3,
  },
  {
    title: "four",
    order: 4,
  },
  {
    title: "five",
    order: 5,
  },
  {
    title: "six",
    order: 6,
  },
];

export const reorderCards = (cards, sourceIndex, destinationIndex) => {
  // Make a copy of the original array to avoid mutating it
  const reorderedCards = [...cards];

  // Remove the card from the source index
  const [removedCard] = reorderedCards.splice(sourceIndex, 1);

  // Insert the removed card at the destination index
  reorderedCards.splice(destinationIndex, 0, removedCard);

  // Update the order field for each card
  reorderedCards.forEach((card, index) => {
    card.order = index + 1;
  });

  return reorderedCards;
};
