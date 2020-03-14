window.onload = function() {
	init();
	addListeners();
	checkMove();
}

/* init before a new game */
function init() {
	var snake = document.getElementById('snake');
	snake.setAttribute("direction", "up");
	var score = document.getElementById("score");
	score.setAttribute("value", 0);
	var snakeHead = document.createElement('div');
	var text = document.createTextNode("H");
	snakeHead.appendChild(text);
	snakeHead.setAttribute("class", "snake head");
	snakeHead.style.left = "0px";
	snakeHead.style.top = "100px";
	snake.appendChild(snakeHead);
	var snakeBody;
	for (var i = 0; i < 3; i ++) {
		var toFollow = snake.lastChild;
		snakeBody = document.createElement('div');
		text = document.createTextNode("X");
		snakeBody.appendChild(text);
		snakeBody.setAttribute("class", "snake body");
		snakeBody.style.top = (parseInt(toFollow.style.top) + 10) + "px";
		snakeBody.style.left = toFollow.style.left;
		snake.appendChild(snakeBody);
	}
}

/* add all the listeners in need */
function addListeners() {
	var startButton = document.getElementById("start-button");
	startButton.addEventListener("click", start);

	var slowButton = document.getElementById("slow-button");
	slowButton.addEventListener("click", slow);

	var fastButton = document.getElementById("fast-button");
	fastButton.addEventListener("click", fast);

	var keyHelper = document.getElementById("key-helper");
	keyHelper.addEventListener("click", showVisualKey);

	var mapContainer = document.getElementById("map-container");
	mapContainer.addEventListener("click", getDirection);

	document.addEventListener("keydown", changeDirection);
}

/* get direction according to the position user clicked */
function getDirection() {
	//only the map-container can handle
	if (event.target.id && event.target.id === "map-container") {
		//get the position user clicked
		var userX = event.offsetX;
		var userY = event.offsetY;

		// get the position of snake head
		var snakeHead = document.getElementsByClassName("snake head")[0];
		var snakeHeadX = parseInt(snakeHead.style.left);
		var snakeHeadY = parseInt(snakeHead.style.top);

		// get the current direction of snake
		var snake = document.getElementById("snake");
		var direction = snake.getAttribute("direction");
		
		//when direction is 'up' or 'down', you can only change direction to 'left' or 'right'
		if (direction === 'up' || direction === 'down') {
			snake.setAttribute("direction", (userX > snakeHeadX ? 'right' : 'left'));
		}
		else {
			snake.setAttribute("direction", (userY > snakeHeadY ? 'down' : 'up'));
		}
	} 
}

/* show the visual keys */
function showVisualKey() {
	var keyHelper = document.getElementById("key-helper");
	keyHelper.setAttribute("class", "key-helper-hidden");
	keyHelper.removeEventListener("click", showVisualKey);

	// show visual keys
	// 需倒序改变类名 （类名改变后数组长度会改变）
	var visualKeys = document.getElementsByClassName("visual-key-hidden");
	
	for (var i = visualKeys.length - 1; i >= 0; i --) {
		visualKeys[i].addEventListener("click", function(){
			//console.log(this.getAttribute("id"));
			var keyDownEvent = new KeyboardEvent("keydown", {
				key:this.getAttribute("id")
			});
			//console.log(typeof keyDownEvent);
			//keyDownEvent.key = this.getAttribute("id");
			// var initMethod = typeof keyDownEvent.initKeyboardEvent !== 'undefined'?'initKeyboardEvent':'initKeyEvent';
			// console.log(keyDownEvent);
			// keyDownEvent[initMethod]("keydown", true, true, window, this.getAttribute("id"), 0);
			document.dispatchEvent(keyDownEvent);
			//event.keyCode = parseInt(this.getAttribute("id"));
		});
		visualKeys[i].setAttribute("class", "visual-key");
	}
}

/* control the game */
function start() {
	/* get the elements */
	var currentGameState = document.getElementById("game-state");
	var startButton = document.getElementById("start-button");

	/* game state control */
	if (currentGameState.getAttribute("value") == "end") {
		if (startButton.lastChild.nodeValue == "Restart") {
			var snake = document.getElementById("snake");
			while (snake.firstChild) {
				snake.removeChild(snake.firstChild);
			}
			var mapContainer = document.getElementById("map-container");
			var food = document.getElementsByClassName("food")[0];
			mapContainer.removeChild(food);
			init();
		}
		currentGameState.setAttribute("value", "playing");
		makeFood();
		startButton.lastChild.nodeValue = "Pause";
	}
	else if (currentGameState.getAttribute("value") == "playing") {
		startButton.lastChild.nodeValue = "Resume";
		currentGameState.setAttribute("value", "paused");
	}
	else if (currentGameState.getAttribute("value") == "paused") {
		currentGameState.setAttribute("value", "playing");
		startButton.lastChild.nodeValue = "Pause"
	}
}

/* check the game state and decide whether to move the snake */
function checkMove() {
	var oldSpeed = document.getElementById("speed-input").value;
	setTimeout(function moveSnake() {
		var currentSpeed = document.getElementById("speed-input").value;
		var currentGameStateValue = document.getElementById("game-state").value;
		if (currentGameStateValue == "playing") {
			move();
		}
		setTimeout(moveSnake, 1000 - currentSpeed);
	}, oldSpeed);
}

/* move the snake to current direction */
function move() {
	var snake = document.getElementById('snake');
	var snakeNodes = document.getElementsByClassName("snake")
	var direction = snake.getAttribute("direction");
	var oldleft = snakeNodes[0].style.left;
	var oldtop = snakeNodes[0].style.top;
	var newleft = "";
	var newtop = "";

	if (direction == "up") {
		if (parseInt(oldtop) === 0) {
			end();
			return;
		}
		newtop = (parseInt(oldtop) - 10) + "px";
	}
	if (direction == "down") {
		if (parseInt(oldtop) === 490) {
			end();
			return;
		}
		newtop = (parseInt(oldtop) + 10) + "px";
	}
	if (direction == "right") {
		if (parseInt(oldleft) === 490) {
			end();
			return;
		}
		newleft = (parseInt(oldleft) + 10) + "px";
	}
	if (direction == "left") {
		if (parseInt(oldleft) === 0) {
			end();
			return;
		}
		newleft = (parseInt(oldleft) - 10) + "px";
	}

	if (newleft.length > 0) {
		snakeNodes[0].style.left = newleft;
	}
	if (newtop.length > 0) {
		snakeNodes[0].style.top = newtop;
	}
	
	
	var templeft = "", temptop = "";
	for (var i = 1; i < snakeNodes.length; i ++) {
		templeft = snakeNodes[i].style.left;
		temptop = snakeNodes[i].style.top;
		snakeNodes[i].style.left = oldleft;
		snakeNodes[i].style.top = oldtop;
		oldleft = templeft;
		oldtop = temptop;
	}
	
	setDisplay();
	checkGameState();
}

/* figure out how each part of the snake should move */
function setDisplay() {
	var snakeNodes = document.getElementsByClassName("snake");
	if (snakeNodes.length == 1) {
		return;
	}

	/* check how to go */
	var flexDirection = "";
	if (snakeNodes[0].style.left == snakeNodes[1].style.left) {
		flexDirection = "column";
	}
	else {
		flexDirection = "row";
	}

	snakeNodes[0].style.flexDirection = flexDirection;
	for (var i = 0; i < snakeNodes.length; i ++) {
		for (var j = i + 1; j < snakeNodes.length; j ++) {
			if (snakeNodes[i].style.left === snakeNodes[j].style.left || snakeNodes[i].style.top === snakeNodes[j].style.top) {
				snakeNodes[j].style.flexDirection = flexDirection;
			}
			else {
				(flexDirection === "row") ? flexDirection = "column" : flexDirection = "row";
				i = j;
				break;
			}
		}
	}
}

/* change the direction according to the player the command */
function changeDirection() {
	var snake = document.getElementById("snake");
	//console.log(event.key);
	if (event.key == 'w' || event.key == 'W') {
		if (snake.getAttribute("direction") == "down" || snake.getAttribute("direction") == "up") {
			return;
		}
		snake.setAttribute("direction", "up");
	}
	else if (event.key == 's' || event.key == 'S') {
		if (snake.getAttribute("direction") == "down" || snake.getAttribute("direction") == "up") {
			return;
		}
		snake.setAttribute("direction", "down");
	}
	else if (event.key == 'a' || event.key == 'A') {
		if (snake.getAttribute("direction") == "left" || snake.getAttribute("direction") == "right") {
			return;
		}
		snake.setAttribute("direction", "left");
	}
	else if (event.key == 'd' || event.key == 'D') {
		if (snake.getAttribute("direction") == "left" || snake.getAttribute("direction") == "right") {
			return;
		}
		snake.setAttribute("direction", "right");
	}
}

/* for debug */
function keyDownHandler() {
	console.log(event.keyCode);
}

/* check the game state */
function checkGameState() {
	var snakeNodes = document.getElementsByClassName("snake");
	var snake = document.getElementById("snake");
	var head = snakeNodes[0];
	//console.log(head.style.left)
	for (var i = 1; i < snakeNodes.length; i ++) {
		if (snakeNodes[i].style.left === head.style.left && snakeNodes[i].style.top === head.style.top) {
			end();
			return;
		}
	}

	// the snake eats the food and grows
	var currentFood = document.getElementsByClassName("food")[0];
	if (head.style.left == currentFood.style.left && head.style.top == currentFood.style.top) {
		score();
		currentFood.parentNode.removeChild(currentFood);
		var toFollow = snake.lastChild;
		var snakeBody = document.createElement('div');
		snakeBody.setAttribute("class", "snake body");
		snakeBody.style.top = (parseInt(toFollow.style.top) + 10) + "px";
		snakeBody.style.left = toFollow.style.left;
		snake.appendChild(snakeBody);
		makeFood();
	}
}

/* game ends because of the rules */
function end() {
	//console.log("end");
	var currentGameStateInput = document.getElementById("game-state");
	currentGameStateInput.setAttribute("value", "end");
	var startButton = document.getElementById("start-button");
	startButton.lastChild.nodeValue = "Restart";
}

/* fasten the speed of the snake */
function fast() {
	var speedInput = document.getElementById("speed-input");
	if (parseInt(speedInput.value) < parseInt(speedInput.max)) {
		speedInput.value = parseInt(speedInput.value) + parseInt(speedInput.step);
	}
}

/* slow down the speed of the snake */
function slow() {
	var speedInput = document.getElementById("speed-input");
	if (parseInt(speedInput.value) > parseInt(speedInput.min)) {
		speedInput.value = parseInt(speedInput.value) - parseInt(speedInput.step);
	}
}

/* create a new food in a random spot */
function makeFood() {
	var currentGameState = document.getElementById("game-state").value;
	if (currentGameState == "playing") {
		var mapContainer = document.getElementById("map-container");
		var snakeNodes = document.getElementsByClassName("snake");
		var randLeft , randTop;
		var flag = true;
		while (true) {
			randLeft = Math.floor(Math.random() * 49);
			randTop = Math.floor(Math.random() * 49);
			for (var i = 0; i < snakeNodes.length; i ++) {
				if (parseInt(snakeNodes[i].style.left) == randLeft * 10 && parseInt(snakeNodes[i].style.top) === randTop * 10) {
					flag = false;
					break;
				}
			}
			if (flag) {
				break;
			}
		}
		var food = document.createElement("div");
		food.setAttribute("class", "food");
		food.style.left = randLeft * 10 + "px";
		food.style.top = randTop * 10 + "px";
		mapContainer.appendChild(food);
	}
	
	
}

/* score when the snake eats one food */
function score() {
	var score = document.getElementById("score");
	var currentScore = score.getAttribute("value");
	currentScore ++;
	score.setAttribute("value", currentScore);

	/* with every 5 points gotten, fasten the snake */
	if (currentScore && (currentScore % 5) == 0) {
		fast();
	}
}