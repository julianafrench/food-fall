/*
 *   game.js
 *   Main file for Food Fall!
 */

// Speed of Game
sizeOfEntry = 3;
var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
    fontSize: 30,
    fontFamily: 'Arial',
    fill: 'white'
});

function gameInit() {
    if(gameBuild) {
        obstacleCount = 0;
        countDownIndex = 0;
        afterCountDown = false;
        var three = new Sprite(resources['assets/img/sprites/cd-3.png'].texture);
        var two = new Sprite(resources['assets/img/sprites/cd-2.png'].texture);
        var one = new Sprite(resources['assets/img/sprites/cd-1.png'].texture);
        var go = new Sprite(resources['assets/img/sprites/cd-go.png'].texture);
        countDownNumbers = [three, two, one, go];
        gameBuildTime = new Date().getTime();
        initCatcher();
    }
    gameBuild = false;
}

/*
    For displaying and removing the numbers for the countdown.
*/
function displayNo() {
    var curNum = countDownNumbers[countDownIndex];
    if(countDownIndex == 0) {
        game.stage.addChild(curNum);
    } else if(countDownIndex > 0 && countDownIndex < 4){
        var prevNum = countDownNumbers[countDownIndex - 1];
        prevNum.destroy();

        game.stage.addChild(curNum);
    } else {
        var prevNum = countDownNumbers[countDownIndex - 1];
        prevNum.destroy();

    }
    try {
        curNum.x = 100;
        curNum.y = 50;
    } catch (err) {}
    ++countDownIndex;
}

var foodCount = 0;
function makeFood() {
    const MAX_FOOD = 5;
    if(foodCount >= MAX_FOOD) return;
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = new Sprite(
        resources['assets/img/sprites/' + fallingObjects[newFoodIndex].name + '.png'].texture
    );
    newFood.name = fallingObjects[newFoodIndex];
    newFood.x = getRandomInt(newFood.width, GAME_WIDTH - newFood.width);
    newFood.y = -newFood.height;
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    newFood.isFood = true;
    newFood.velocity = 0; //10 pixels per second
    newFood.accelerationY = 210; //
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;
    ++foodCount;

    game.stage.addChild(newFood);
}

function removeItem(childToDelete) {
    game.stage.removeChild(childToDelete);
}

// Determine if basket and food are colliding
function isCollide(basket, food) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    var upperLeft = {x:basket.x - xoffset, y:basket.y - yoffset};
    var lowerRight = {x:(basket.x + basket.width - xoffset), y:(basket.y + 10 - yoffset)};
    var inBasket = (food.x > upperLeft.x) && (food.y > upperLeft.y)
        && (food.x < lowerRight.x) && (food.y < lowerRight.y);
    return inBasket;
}

function foodCatchCollision() {
    var currtime = new Date().getTime();
    var deltaTime = parseFloat((currtime - lastTime)/1000);
    var currentElapsedGameTime = parseInt((currtime - gameBuildTime)/1000);

    if(!afterCountDown && currentElapsedGameTime == countDownIndex) {
        displayNo();
        if (currentElapsedGameTime == 4) {
            afterCountDown = true;
        }
    }
    if(afterCountDown) {
        makeFood();
        makeObstacle();
        var childrenToDelete = [];
        for (var i in game.stage.children) {
            var fallingItem = game.stage.children[i];
            if (fallingItem.isObstacle) {
                var curObstacle = fallingItem;
                curObstacle.x -= 3;
                obstacleCollision(catcher, curObstacle);
                if(curObstacle.x < (-curObstacle.width)) {
                    childrenToDelete.push(curObstacle);
                    curObstacle.destroy();
                    --obstacleCount;
                }
            }
            if (fallingItem.isFood) {
                var deltaY = fallingItem.velocity * deltaTime;
                var deltaVy = fallingItem.accelerationY * deltaTime;
                fallingItem.y += deltaY;
                fallingItem.velocity += deltaVy;
                fallingItem.rotation += fallingItem.rotateFactor;
                 if (fallingItem.y > GAME_HEIGHT) {
                     if (scoreCount > 0) {
                         scoreCount -= 5;
                     }
                     if (scoreCount < 0) {
                         scoreCount = 0;
                     }
                    childrenToDelete.push(fallingItem);
                    fallingItem.destroy();
                    --foodCount;
                }
                try {
                    if (isCollide(catcher, fallingItem)) {
                        modScore(fallingItem);
                        childrenToDelete.push(fallingItem);
                        fallingItem.destroy();
                        sound.play('coin');
                        scoreCount += 10;
                        game.stage.removeChild(score);
                        --foodCount;
                    }
                } catch(err) {}
            }
        }
        for (var i = 0; i < childrenToDelete.length; i++) {
            removeItem(childrenToDelete[i]);
        }
    }

}

function makeObstacle() {
    const MAX_OBSTACLE = 1;
    if(obstacleCount >= MAX_OBSTACLE) return;

    var newTopObstacle = new Sprite(resources['assets/img/sprites/obstacle.png'].texture);
    newTopObstacle.x = newTopObstacle.width + GAME_WIDTH;
    newTopObstacle.height = getRandomInt(30, (2 * (GAME_HEIGHT / 3))); //
    newTopObstacle.y = 0;
    newTopObstacle.width = 50;
    newTopObstacle.isObstacle = true;
    game.stage.addChild(newTopObstacle);


    var newBotObstacle = new Sprite(resources['assets/img/sprites/obstacle.png'].texture);
    newBotObstacle.x =  newTopObstacle.x;
    newBotObstacle.y = newTopObstacle.height + (2 * catcher.height);//newBotObstacle.height ;
    newBotObstacle.height = GAME_HEIGHT - newBotObstacle.y;
    newBotObstacle.width = newTopObstacle.width;
    newBotObstacle.isObstacle = true;
    game.stage.addChild(newBotObstacle);
    obstacleCount += 2;

}

/*
 need xspeed
 */
function bounce() {

}

function obstacleCollision(catcher, obstacle) {
    if (isCollideWholeBasket(catcher, obstacle)) {
        console.log("game over");
        // state = leaderBoardMenu;
    }
}

function isCollideWholeBasket(basket, obstacle) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    return !(((basket.y + basket.height - yoffset) < (obstacle.y)) ||
    ((basket.y - yoffset) > (obstacle.y + obstacle.height)) ||
    ((basket.x + basket.width - xoffset) < obstacle.x) ||
    ((basket.x -xoffset)> (obstacle.x + obstacle.width)));
}

function addScore() {
    score.x = GAME_WIDTH - 100;
    score.y = GAME_HEIGHT - 50;
    score.anchor.x = 0.5;
    score.text = 'Score: ' + scoreCount;
    game.stage.addChild(score);
}

/**
 * Returns the name of the given food.
 * @param food the food to decipher.
 */
function getFoodType(food) {
    return food.name;
}

/**
 * Modifies the score based on the type of food given.
 * @param food
 */
function modScore(food) {
    var type = getFoodType(food);
    if (type.name === "apple") {
        scoreCount += 3;
    }
    if (type.name === "bread") {
        scoreCount += 2;
    }
}
