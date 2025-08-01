document.addEventListener('DOMContentLoaded', () => {
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const finalScoreDisplay = document.getElementById('finalScore');
const brickCountInput = document.getElementById('brickCount');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let lives = 3;
let gameRunning = false;
let gamePaused = false;
let animationId;
let brickCount = 45;

const paddle = {
    width: 100,
    height: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 8,
    dx: 0
};

const ball = {
    size: 10,
    x: canvas.width / 2,
    y: canvas.height - 50,
    speed: 4,
    dx: 3 * (Math.random() > 0.5 ? 1 : -1),
    dy: -3
};

const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 15;
const brickOffsetTop = 60;
const brickOffsetLeft = 35;
let bricks = [];

function getRandomColor() {
    const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateBricks(count) {
    bricks = [];
    const columns = Math.floor(canvas.width / (brickWidth + brickPadding));
    const rows = Math.ceil(count / columns);
    let created = 0;

    for (let r = 0; r < rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < columns; c++) {
            if (created < count) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c] = {
                    x: brickX,
                    y: brickY,
                    status: 1,
                    color: getRandomColor()
                };
                created++;
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0d6efd';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#dc3545';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
            const brick = bricks[r][c];
            if (brick && brick.status === 1) {
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = brick.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    else if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) ball.dx *= -1;
    if (ball.y - ball.size < 0) ball.dy *= -1;

    if (ball.y + ball.size > paddle.y &&
        ball.y + ball.size < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.speed;
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPoint * ball.speed;
    }

    if (ball.y + ball.size > canvas.height) {
        lives--;
        livesDisplay.textContent = lives;
        if (lives <= 0) gameOver();
        else resetBall();
    }
}

function collisionDetection() {
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
            const brick = bricks[r][c];
            if (brick && brick.status === 1) {
                if (ball.x + ball.size > brick.x &&
                    ball.x - ball.size < brick.x + brickWidth &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brickHeight) {
                    ball.dy *= -1;
                    brick.status = 0;
                    score += 10;
                    scoreDisplay.textContent = score;
                    if (checkWin()) gameWin();
                }
            }
        }
    }
}

function checkWin() {
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
            if (bricks[r][c] && bricks[r][c].status === 1) return false;
        }
    }
    return true;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -3;
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    gameOverScreen.classList.remove('d-none');
    finalScoreDisplay.textContent = `Рахунок: ${score}`;
}

function gameWin() {
    alert(`Вітаємо! Ви набрали ${score} балів!`);
    resetGame();
}

function resetGame() {
    score = 0;
    lives = 3;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    generateBricks(brickCount);
    resetBall();
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.dx = 0;
}

function togglePause() {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Продовжити' : 'Пауза';
    if (!gamePaused && gameRunning) update();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    movePaddle();
    moveBall();
    collisionDetection();
    if (gameRunning && !gamePaused) animationId = requestAnimationFrame(update);
}

function startGame() {
    brickCount = parseInt(brickCountInput.value) || 45;
    gameOverScreen.classList.add('d-none');
    pauseBtn.classList.remove('d-none');
    gameRunning = true;
    gamePaused = false;
    resetGame();
    update();
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') paddle.dx = paddle.speed;
    else if (e.key === 'Left' || e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
    else if (e.key === ' ' && gameRunning) togglePause();
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') paddle.dx = 0;
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
});
