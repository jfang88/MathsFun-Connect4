const playerInputPage = document.getElementById('player-input-page');
const gamePage = document.getElementById('game-page');
const startGameButton = document.getElementById('start-game');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

const gameBoard = document.getElementById('game-board');
const question = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const newGameButton = document.getElementById('new-game');
const playerTurnDisplay = document.getElementById('player-turn');

const rows = 12;
const cols = 12;
let board = Array(rows).fill().map(() => Array(cols).fill(null));
let currentPlayer = 1;
let questionsAsked = []; // Track asked questions to avoid repetition
let secondChance = false; // Track if the next player gets a turn to try the same question
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let correctAnswer = null; // The answer to the current question

// Generate the game board with times table products
function createBoard() {
  gameBoard.innerHTML = ""; // Clear the board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      const num1 = r + 1;
      const num2 = c + 1;
      const value = num1 * num2;
      cell.textContent = value;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.backgroundColor = "white"; // Reset tile colors
      cell.style.color = "black"; // Reset text color
      gameBoard.appendChild(cell);
      board[r][c] = value; // Store the product value in the logical board
    }
  }
}

// Generate a unique random times table question
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 12) + 1; // Random number between 1 and 12
  const num2 = Math.floor(Math.random() * 12) + 1; // Random number between 1 and 12
  correctAnswer = num1 * num2; // Calculate the correct answer
  question.textContent = `What is ${num1} x ${num2}?`; // Display the equation
}

// Check if a player has won
function checkWin(row, col, player) {
  const directions = [
    [[0, 1], [0, -1]], // Horizontal
    [[1, 0], [-1, 0]], // Vertical
    [[1, 1], [-1, -1]], // Diagonal /
    [[1, -1], [-1, 1]]  // Diagonal \
  ];

  for (const direction of directions) {
    let count = 1; // Start with the current tile
    let winningTiles = [[row, col]]; // Store coordinates of connected tiles

    for (const [dr, dc] of direction) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
        count++;
        winningTiles.push([r, c]); // Add this tile to the winning set
        r += dr;
        c += dc;
      }
    }

    // If enough tiles (4) are connected, return true and highlight them
    if (count === 4) {
      highlightWinningTiles(winningTiles); // Highlight only the winning tiles
      return true;
    }
  }

  return false;
}

// Function to highlight the winning tiles
function highlightWinningTiles(tiles) {
  tiles.forEach(([r, c]) => {
    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    cell.style.border = '3px solid green'; // Highlight the tile with a green border
    cell.style.boxShadow = '0 0 10px green'; // Add a glow effect
  });
}

// Handle submitting an answer
submitButton.addEventListener('click', () => {
  const playerAnswer = parseInt(answerInput.value);

  if (playerAnswer === correctAnswer) {
    let placed = false;

    // Loop through the board to find the matching product
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === playerAnswer && !placed) {
          const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);

          // Apply the player's color to the cell
          cell.style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow';
          cell.style.color = currentPlayer === 1 ? 'white' : 'black'; // Ensure visibility for text
          board[r][c] = currentPlayer; // Mark cell as occupied by the current player

          if (checkWin(r, c, currentPlayer)) {
            alert(`${currentPlayer === 1 ? player1Name : player2Name} wins!`);
            return;
          }

          // Switch to the next player
          secondChance = false; // Reset second chance if answered correctly
          currentPlayer = currentPlayer === 1 ? 2 : 1;
          playerTurnDisplay.textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
          generateQuestion(); // Generate a new question for the next turn
          answerInput.value = ''; // Clear the input field
          placed = true;
        }
      }
    }
  } else {
    // If the answer is incorrect
    alert(`${currentPlayer === 1 ? player1Name : player2Name}, that's incorrect! Passing the turn.`);
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch to the next player
    playerTurnDisplay.textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
    answerInput.value = ''; // Clear the input field
  }
});

// Start the game after entering player names
startGameButton.addEventListener('click', () => {
  if (player1Input.value.trim() !== "" && player2Input.value.trim() !== "") {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();
    playerTurnDisplay.textContent = `${player1Name}'s turn (Red)`;
    generateQuestion();
    createBoard();
    playerInputPage.style.display = "none";
    gamePage.style.display = "block";
  } else {
    alert("Please enter names for both players!");
  }
});

// Reset the game
newGameButton.addEventListener('click', () => {
  questionsAsked = [];
  secondChance = false;
  currentPlayer = 1;
  playerTurnDisplay.textContent = `${player1Name}'s turn (Red)`;
  generateQuestion();
  createBoard();
  answerInput.value = ''; // Clear the input field
});

// Initialize the game
createBoard();
