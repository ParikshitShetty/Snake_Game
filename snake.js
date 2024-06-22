const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // size of each square
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box }; // initial position of the snake
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};
let score = 0;
let d;

// Function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function drawEyes(x, y) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + 4, y + 4, 3, 0, Math.PI * 2);
    ctx.arc(x + box - 8, y + 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x + 4, y + 4, 1, 0, Math.PI * 2);
    ctx.arc(x + box - 8, y + 4, 1, 0, Math.PI * 2);
    ctx.fill();
}


function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = (i == 0) ? "green" : "brown";
        // ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(snake[i].x, snake[i].y, box, box);


        let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
        gradient.addColorStop(0, (i == 0) ? "#4caf50" : "#795548");
        gradient.addColorStop(1, (i == 0) ? "#388e3c" : "#5d4037");
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);

        // Draw eyes on the head
        if (i === 0) {
            drawEyes(snake[i].x, snake[i].y);
        }
    }
    
    // // Draw the food
    // ctx.fillStyle = "red";
    // ctx.fillRect(food.x, food.y, box, box);
    
    // // Draw the score
    // ctx.fillStyle = "white";
    // ctx.font = "45px Changa one";
    // ctx.fillText(score, 2 * box, 1.6 * box);

    ctx.fillStyle = "red";
    roundRect(ctx, food.x, food.y, box, box, 5, true, false);
    
    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "45px Arial";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
    }
}

function updateSnakePosition() {
    // Get the head position of the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // Update the position based on the direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;
    
    // Check if the snake has eaten the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
    } else {
        // Remove the tail
        snake.pop();
    }
    
    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    // Game over conditions
    if (snakeX < 0*box || snakeY < 0 * box || snakeX > 19 * box || snakeY > 19 * box || collision(newHead, snake)) {
        newHead  =  actOnCollision();
        // Here you can call a function to handle game over
    }
    
    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}
function  actOnCollision() {
	d  =  "STOP";
	snake  = [];
	score  =  0;
	return { x:  9  *  box, y:  10  *  box };
}

function  game() {
	setTimeout(function  onTick(){
		draw();
		updateSnakePosition();
		game();
	},150);
}
game();

// Leaderboard logic
if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}
let  leaderboard =  JSON.parse(localStorage.getItem('leaderboard'));
// console.log("leaderboard",leaderboard)

function  updateLeaderboard(score,playerName) {
	let  leaderboard  =  JSON.parse(localStorage.getItem('leaderboard'));
	leaderboard.push({ score:  score , playerName: playerName});
	leaderboard.sort((a, b) =>  b.score  -  a.score);
	if (leaderboard.length  >  10) { // Assuming top 10 scores are stored
		leaderboard.pop();
	}
	localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    // Retrieve the high scores from local storage
    let leaderboard  =  JSON.parse(localStorage.getItem('leaderboard'));

    console.log("leaderboard",leaderboard)
    
    // Get the leaderboard element
    let  leaderboardElement  =  document.getElementById('leaderboard-body');
    
    // Clear existing list items
    leaderboardElement.innerHTML = '';
    
    // Create a list item for each high score and append it to the list
    leaderboard.forEach((entry,index) => {
        let  row  =  document.createElement('tr');
        row.innerHTML  =  `<td class="w-[200px]">${index + 1}</td><td class="w-[200px]">${entry.playerName}</td><td class="w-[200px]">${entry.score}</td>`;
        leaderboardElement.appendChild(row);
    });
}

function  onGameOver(score) {
    playerName  =  prompt("Game Over! Enter your name:");
    console.log("playerName",playerName)
    updateLeaderboard(score, playerName);
    displayLeaderboard();
}

function  actOnCollision() {
	d  =  "STOP";
	snake  = [];
	onGameOver(score)
	score  =  0;
	return { x:  9  *  box, y:  10  *  box };
}

window.onload = function() {
    displayLeaderboard();
};
