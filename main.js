const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX,
  foodY,
  snakeX = 5,
  snakeY = 10,
  gameOver = false,
  snakeBody = [],
  velocityX = 0,
  setIntervalId,
  velocityY = 0,
  score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score : ${highScore}`;

//   For randomly changing food's position

const changeFoodPosition = (e) => {
  // Food will be between 1 and 30
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};
// Changing Velocity on press of arrow keys
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
};

controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

// alerting  the user when they lose the game
const handleGameOver = () => {
  // clearing the timer and reloading the page after press of ok
  clearInterval(setIntervalId);
  alert("Game Over! press ok to restart");
  location.reload();
};

// game is initialized as we put food inside the playboard
const initGame = () => {
  if (gameOver === true) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area:  ${foodY}/ ${foodX}"></div>`;

  // Changing food  position everytime after snake's and food's position become same
  if (snakeX == foodX && snakeY == foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); //Pushing food position to snake's body array
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score : ${score}`;
    highScoreElement.innerHTML = `High Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1]; // Shifting elements in snake's body array one step forward
  }

  snakeBody[0] = [snakeX, snakeY]; //Setting first element of snake body to current position of snake

  //Updating snake head's position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Checking if snake hit any of the walls
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  // Adding html markup for the snake to appear
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area:  ${snakeBody[i][1]}/ ${snakeBody[i][0]}"> </div> `;
    //
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};
changeFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", changeDirection);
