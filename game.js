// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let gameTimer;
let isGameStarted = false;

// Emojis for card pairs
const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];

// DOM elements
const gameBoard = document.querySelector('.game-board');
const movesCount = document.querySelector('.moves-count');
const timeDisplay = document.querySelector('.time');
const restartBtn = document.querySelector('.restart-btn');
const gameOver = document.querySelector('.game-over');
const movesFinal = document.querySelector('.moves-final');
const timeFinal = document.querySelector('.time-final');
const playAgainBtn = document.querySelector('.play-again-btn');
const discountButton = document.querySelector('.game-over button');
const clipboardMessage = document.getElementById('clipboard-message');

// Initialize game
function initGame() {
    // Reset state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    time = 0;
    isGameStarted = false;
    clearInterval(gameTimer);
    
    // Update display
    movesCount.textContent = moves;
    timeDisplay.textContent = formatTime(time);
    gameOver.classList.add('hidden');
    
    // Create and shuffle cards
    const cardPairs = [...emojis, ...emojis];
    shuffleArray(cardPairs);
    
    // Clear and populate game board
    gameBoard.innerHTML = '';
    cardPairs.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        cards.push(card);
        gameBoard.appendChild(card);
    });
}

// Create card element
function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-front">
            ${emoji}
        </div>
        <div class="card-back"></div>
    `;
    
    card.addEventListener('click', () => handleCardClick(card, emoji));
    return card;
}

// Handle card click
function handleCardClick(card, emoji) {
    if (!isGameStarted) {
        startTimer();
        isGameStarted = true;
    }
    
    if (
        flippedCards.length === 2 || 
        flippedCards.includes(card) ||
        card.classList.contains('matched')
    ) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        movesCount.textContent = moves;
        
        const [firstCard, secondCard] = flippedCards;
        const firstEmoji = firstCard.querySelector('.card-front').textContent.trim();
        const secondEmoji = secondCard.querySelector('.card-front').textContent.trim();
        
        if (firstEmoji === secondEmoji) {
            matchedPairs++;
            flippedCards.forEach(card => {
                card.classList.add('matched');
            });
            flippedCards = [];
            
            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                });
                flippedCards = [];
            }, 1000);
        }
    }
}

// Timer functions
function startTimer() {
    gameTimer = setInterval(() => {
        time++;
        timeDisplay.textContent = formatTime(time);
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// End game
function endGame() {
    console.log("ENDGAME");

    setTimeout(() => {
        window.location.href = 'index.html';  // Redirect to index.html
    }, 2000);
}


// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Clipboard copy functionality
discountButton.addEventListener('click', () => {
    const emoji = discountButton.textContent.trim();  // Get the emoji from the button
    
    // Create a temporary input element to copy the emoji
    const tempInput = document.createElement('input');
    tempInput.value = emoji;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show success message
    clipboardMessage.style.display = 'block';
    setTimeout(() => {
        clipboardMessage.style.display = 'none';
    }, 2000);
});

// Start game
initGame();
