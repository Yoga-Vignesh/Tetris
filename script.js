document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#grid');
  const scoreDisplay = document.querySelector('#score');
  const width = 10;
  let squares = [];
  let isPaused = false;

  // Create the grid dynamically
  for (let i = 0; i < 200; i++) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
    squares.push(cell);
  }

  // Add taken squares for the bottom row to simulate the floor
  for (let i = 0; i < 10; i++) {
    let takenCell = document.createElement('div');
    takenCell.classList.add('cell', 'taken');
    grid.appendChild(takenCell);
    squares.push(takenCell);
  }

  // Tetromino shapes
  const tetrominoes = [
    [1, width + 1, width * 2 + 1, 2], // L-Tetromino
    [0, 1, width, width + 1], // O-Tetromino
    [1, width, width + 1, width + 2], // T-Tetromino
    [0, width, width + 1, width * 2 + 1], // Z-Tetromino
    [1, width + 1, width * 2 + 1, width * 3 + 1], // I-Tetromino
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random];

  // Draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
    });
  }

  // Undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
    });
  }

  // Move down the tetromino every second
  let timerId = setInterval(moveDown, 1000);

  // Move down the tetromino
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze the tetromino in place when it hits the bottom or another tetromino
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      );
      // Start a new tetromino falling
      random = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random];
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  // Move the tetromino left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // Move the tetromino right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  // Rotate the tetromino
  function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % tetrominoes.length;
    current = tetrominoes[random].map(
      (index) => (index + currentRotation) % tetrominoes[random].length
    );
    draw();
  }
  
// Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        });
        const removedSquares = squares.splice(i, width);
        squares = removedSquares.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
        scoreDisplay.innerHTML = parseInt(scoreDisplay.innerHTML) + 10;
      }
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'Game Over';
      clearInterval(timerId);
    }
  }

  // Pause and Resume functionality
  function togglePause() {
    if (isPaused) {
      timerId = setInterval(moveDown, 1000);
      isPaused = false;
    } else {
      clearInterval(timerId);
      isPaused = true;
    }
  }

  // Assign functions to keycodes
  function control(e) {
    if (e.keyCode === 32) { // Spacebar to toggle pause
      togglePause();
    }
    if (!isPaused) { // Only allow movement when not paused
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 38) {
        rotate();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      }
    }
  }

  document.addEventListener('keyup', control);
});
