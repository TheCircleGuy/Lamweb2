document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".small-card");
  let activeIndex = 0;

  const rotateCards = () => {
    // Remove active class from all cards
    cards.forEach((card) => card.classList.remove("active"));

    // Add active class to the current card
    cards[activeIndex].classList.add("active");

    // Increment the index
    activeIndex = (activeIndex + 1) % cards.length;
  };

  // Rotate cards every 3 seconds
  setInterval(rotateCards, 3000);
});



//game

