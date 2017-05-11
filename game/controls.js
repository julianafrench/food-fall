//Capture the keyboard arrow keys
var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

<<<<<<< HEAD

=======
>>>>>>> 5a455eb13a9c613d04236fdc51ec6062dfe36fa3
function moveToPointer() {
    if (pointer.x < catcher.x) {
        leftPress();
    }
    if (pointer.y < catcher.y) {
        upPress();
    }
    if (pointer.x > catcher.x) {
        rightPress();
    }
    if (pointer.y > catcher.y) {
        downPress();
    }
}

//Keyboard Controls Definition
function keyControls() {
    //Left arrow key `press` method
    left.press = function () {
        leftPress();
    };
    //Left arrow key `release` method
    left.release = function () {
        leftRelease();
    };
    //Up
    up.press = function () {
        upPress();
    };
    up.release = function () {
        upRelease();
    };
    //Right
    right.press = function () {
        rightPress();
    };
    right.release = function () {
        rightRelease();
    };
    //Down
    down.press = function () {
        downPress();
    };
    down.release = function () {
        downRelease();
    };
}
function leftPress() {
    //Change the catcher velocity when the key is pressed
    if (catcher.vx > -maxXspeed && catcher.x > 0) {
        catcher.accelerationX = -catcher.speed;
        catcher.frictionX = 1;
    }
}
function leftRelease() {
    /*If the left arrow has been released, and the right arrow isn't down,
     and the catcher isn't moving vertically, Stop the catcher*/
    if (!right.isDown) {
        catcher.accelerationX = 0;
        catcher.frictionX = catcher.drag;
    }
}
function upPress() {
    if (catcher.vy > -maxYspeed && catcher.y > GAME_HEIGHT / 6) {
        catcher.accelerationY = -catcher.speed;
        catcher.frictionY = 1;
    }
}
function upRelease() {
    if (!down.isDown) {
        catcher.accelerationY = 0;
        catcher.frictionY = catcher.drag;
    }
}
function rightPress() {
    if (catcher.vx < maxXspeed && catcher.x < GAME_WIDTH * 0.9) {
        catcher.accelerationX = catcher.speed;
        catcher.frictionX = 1;
    }
}
function rightRelease() {
    if (!left.isDown) {
        catcher.accelerationX = 0;
        catcher.frictionX = catcher.drag;
    }
}
function downPress() {
    if (catcher.vy < maxYspeed && catcher.y < GAME_WIDTH * 0.9)
        catcher.accelerationY = catcher.speed;
    catcher.frictionY = 1;
}
function downRelease() {
    if (!up.isDown) {
        catcher.accelerationY = 0;
        catcher.frictionY = catcher.drag;
    }
}
//Binds catcher to part of the screen
function bound() {
    if (catcher.vy < 0 && catcher.y < GAME_HEIGHT / 6) {
        catcher.vy = 0;
        upRelease();
    }
    if (catcher.vy > 0 && catcher.y > GAME_HEIGHT * 0.9) {
        catcher.vy = 0;
        downRelease();
    }
    if (catcher.vx < 0 && catcher.x < 0 + GAME_WIDTH * 0.1) {
        catcher.vx = 0;
        leftRelease();
    }
    if (catcher.vx > 0 && catcher.x > GAME_WIDTH * 0.9) {
        catcher.vx = 0;
        rightRelease();
    }
}
//Keyboard object definition
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
function playerMovement() {

    //Implementing acceleration
    catcher.vx += catcher.accelerationX;
    catcher.vy += catcher.accelerationY;
    //Implementing friction
    catcher.vx *= catcher.frictionX;
    catcher.vy *= catcher.frictionY;
    //Implementing movement
    catcher.x += catcher.vx;
    catcher.y += catcher.vy;
    bound();
}
