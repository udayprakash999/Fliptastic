// Load the game over sound
const gameOverSound = new Audio('game-over.mp3');

// Function to update the background gradient based on cursor position
function updateBackgroundGradient(event) {
    const x = event.clientX;
    const y = event.clientY;

    const xPercentage = (x / window.innerWidth) * 100;
    const yPercentage = (y / window.innerHeight) * 100;

    document.body.style.background = `linear-gradient(${xPercentage + yPercentage}deg,#800080,#BF40BF,#DA70D6,	#CF9FFF, #CCCCFF, #F0E68C,#F2D2BD,#E5AA70,#B87333, #834333,#A52A2A)`;
}

// Add event listener to capture mouse movement
document.addEventListener('mousemove', updateBackgroundGradient);

// Game variables
let flippedCards = [];
let matchedCards = 0;
let score = 0;
let timeLeft = 60;
let gameOver = false;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverMessage = document.getElementById('game-over-message');
const playAgainButton = document.getElementById('play-again');
const positiveMessage = document.getElementById('positive-message');
const gameBoard = document.getElementById('game-board');

// Array of emojis for the cards
const emojiValues = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🦊', '🐯', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🦊', '🐯']; // Emoji pairs

// Shuffle function to randomize the card values
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create the game board and cards
function createBoard() {
    gameBoard.innerHTML = '';
    const shuffledCards = shuffleArray([...emojiValues]);

    shuffledCards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);

        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = value;  // Set the emoji as the content inside the card

        card.appendChild(front);
        card.appendChild(back);
        gameBoard.appendChild(card);
    });
}

// Handle card flipping
function flipCard() {
    if (gameOver || flippedCards.length === 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check if the two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        matchedCards++;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        showPositiveMessage(); // Show a positive message after a correct match
        flippedCards = [];

        // Check if all cards are matched
        if (matchedCards === emojiValues.length / 2) {
            endGame('You Won!');
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Show a random positive message
function showPositiveMessage() {
    const messages = [
        "Great job!",
        "Keep it up!",
        "You're doing awesome!",
        "Well played!",
        "Nice match!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    positiveMessage.textContent = randomMessage;
    positiveMessage.style.display = 'block';

    // Hide the message after 2 seconds
    setTimeout(() => {
        positiveMessage.style.display = 'none';
    }, 2000);
}

// Start the timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (gameOver || timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame("Time's Up!");
        } else {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
        }
    }, 1000);
}

// End the game and play the game over sound
function endGame(message) {
    gameOver = true;
    gameOverMessage.textContent = message;
    gameOverMessage.style.display = 'block';
    playAgainButton.style.display = 'block'; // Show the "Play Again" button

    // Play the game over sound
    gameOverSound.play();

    // Disable further card clicks
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
}

// Restart the game
function restartGame() {
    // Reset game variables
    flippedCards = [];
    matchedCards = 0;
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    gameOverMessage.style.display = 'none'; // Hide the "Game Over" message
    playAgainButton.style.display = 'none'; // Hide the "Play Again" button

    // Create a new game board and start the timer again
    createBoard();
    startTimer();

    gameOver = false; // Set the game state back to active
}

// Event listener for the "Play Again" button
playAgainButton.addEventListener('click', restartGame);

// Initialize the game
createBoard();
startTimer();
