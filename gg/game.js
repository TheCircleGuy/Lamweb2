console.log("Game.js initiated");

// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');




// let backgroundUrl = "http://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=58af994abd82540010390c37";  // Example dynamic URL

// Load the initial background image (this could be any URL that updates regularly)
let backgroundImage = new Image();
backgroundImage.src = '{backgroundUrl}';  // Initial image


// Initial background setup for canvas (fallback or default)
canvas.style.backgroundImage = 'url("/assets/bg.png")';  // Default background

// Function to update the background image once
function updateBackgroundImage() {
    // URL for the dynamic image (camera or any other changing source)
    // const dynamicImageUrl = "http://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=58af994abd82540010390c37";
    
    // Add timestamp or other query parameters to ensure the image updates
    const timestamp = Date.now();  // Current timestamp for dynamic refresh
    const imageUrl = 'bg.jpg';

    // Update the background image of the canvas
    canvas.style.backgroundImage = 'bg.jpg';
    
    console.log('Background image updated to:', imageUrl);
}

// Call the updateBackgroundImage function once to update the background
updateBackgroundImage();

// Function to update background image at intervals (every 5 seconds, for example)
setInterval(() => {
    const timestamp = Date.now(); // Get the current timestamp
    backgroundImage.src = `${backgroundUrl}&t=${timestamp}`;  // Update the image source with a new timestamp for dynamic updates
}, 10000);  // Update every 5 seconds


// Get the start button and game over section
const startButton = document.getElementById('startButton');
const gameOverSection = document.querySelector('.game-over-section');
const playAgainButton = document.getElementById('playAgainButton');

let gameStarted = false;

// Game settings
const birdWidth = 100;
const birdHeight = 150;
let birdX = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.6;
const jumpStrength = -10;
let score = 0;
let isGameOver = false;

// Pipe settings
const pipeWidth = 80;
const pipeGap = 450;
let pipes = [];
const pipeSpeed = 3;

// Words for the pipes (array of words)
const words = ["cool", "cool","cool","cool","cool","cool","cool","cool","cool","cool","cool","cool","cool","cool","cool"];
let wordIndex = 0; // Index to keep track of the current word

// Event listener for bird jump (on space or click)
document.addEventListener('keydown', jump);
document.addEventListener('click', jump);

function jump() {
    if (isGameOver) return;
    birdVelocity = jumpStrength;
}

// Load the image
const birdImage = new Image();
birdImage.src = '/assets/mang.png'; // Set the path to your image

// Draw the bird with the image
function drawBird() {
    // Draw the image at the bird's position
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Draw the word inside the bird's box (if any)
    if (words[wordIndex]) {
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px "Urbanist", sans-serif'; 
        ctx.fillText(words[wordIndex], birdX + birdWidth / 8, birdY + 38);
    }
}
// Load the pipe image
const pipeImage = new Image();
pipeImage.src = '/assets/4.png';  // Path to your pipe image

// Draw the pipes with the image
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        // Set the shadow properties (if you still want shadows on the image)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';  // Shadow color (semi-transparent black)
        ctx.shadowBlur = 10;                      // Blur radius of the shadow
        ctx.shadowOffsetX = 5;                    // Horizontal offset of the shadow
        ctx.shadowOffsetY = 5;                    // Vertical offset of the shadow

        // Draw the top pipe using the image
        ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);

        // Draw the bottom pipe using the image
        ctx.drawImage(pipeImage, pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
    }
}

// Background settings
let backgroundX = 0;
const backgroundSpeed = 2;  // Speed of background movement

// Function to draw the moving background
function drawBackground() {
    // Draw the first instance of the background image
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    
    // Draw the second instance of the background image (for looping effect)
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

// Move the pipes
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    // Remove pipes that go off-screen
    if (pipes[0] && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }
}

// Create new pipes with sequential words
function createPipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));

        // If there are more pipes than words, loop back to the start of the word list
        const word = words[wordIndex % words.length];
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            word: word,
            passedByBird: false
        });

        wordIndex++; // Increment the word index
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px "Montserrat", sans-serif'; // Use a different font for score if desired
    ctx.fillText('Thưởng: ' + score + ' con cá', 10, 30);
}

// Check for collisions
function checkCollisions() {
    // Check if bird touches the ground or goes out of bounds
    if (birdY + birdHeight >= canvas.height || birdY <= 0) {
        isGameOver = true;
        return true;
    }

    // Check if bird collides with pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap) {
                isGameOver = true;
                return true;
            }
        }
    }

    return false;
}

// Reset game state
function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    score = 0;
    isGameOver = false;
    pipes = [];
    wordIndex = 0;
    
}

// Event listener for the "Storytelling" button
startButton.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = 'none'; // Hide the start button
     
        resetGame(); // Reset game state
        updateGame(); // Start the game loop
    } else {
        // Restart the game if it's already started
        resetGame();
        updateGame(); // Restart the game loop
    }
});

// Update game loop (add background drawing before the other game elements)
function updateGame() {
    if (isGameOver) {
        // Hide the canvas and show the game over section
        canvas.style.display = 'none';
        gameOverSection.style.display = 'block';  // Show game over section
        return;
    }

    // Move bird
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Create pipes
    createPipes();

    // Move pipes
    movePipes();

    // Move the background
    backgroundX -= backgroundSpeed;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;  // Reset the background position for seamless looping
    }

    // Check if the bird has passed the pipe and reveal word
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (pipe.x + pipeWidth < birdX && !pipe.passedByBird) {
            pipe.passedByBird = true;  // Mark pipe as passed
        }
    }

    // Check for collisions
    if (checkCollisions()) return;

    // Clear the canvas and redraw game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background first
    drawBackground();

    // Draw bird, pipes, and score
    drawBird();
    drawPipes();
    drawScore();

    // Repeat the game loop
    requestAnimationFrame(updateGame);
}

// "Play Again" button click handler
playAgainButton.addEventListener('click', function() {
    gameOverSection.style.display = 'none'; // Hide the game over section
    canvas.style.display = 'block'; // Show the canvas again
    resetGame(); // Reset game state
    updateGame(); // Restart the game loop
});

// Start the game
updateGame();

