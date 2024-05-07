/* ========== Classes ========== */

class Asteroid {
    constructor(angle, distance) {
        this.angle = angle;
        this.distance = distance;
    };
};


/* ========== Constants ========== */

const ORIGIN_LINE = 200;
const SHIELD_DIAMETER = 60;
const SHIELD_RADIUS = SHIELD_DIAMETER / 2;
const SHIELD_LENGTH = 45;

const ASTEROID_SPAWN_RADIUS = 175;
const ASTEROID_DIAMETER = 25;

/* ========== Variables ========== */
/** (mouseX, mouseY) --> Cortesian (coordinateX, coordinateY) --> degress (with (200, 200) as origin) */
let coordinateX = 0;
let coordinateY = 0;
let currentQuadrant = 0;
let shieldAngle = 0;

let points = 10;
let asteroids = [];
let asteroidsSpeed = 1;

let hasLost = false;

function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);
    textAlign(CENTER);

    
    setInterval(spawnNewAsteroid, 2000);
    /* speed of asteroids increase as time goes on, starts at 1, maxes at 5 */
    setInterval(() => asteroidsSpeed += 0.1, 2000);
}


function draw() {
    if (points === 0) {
        showLossScreen();
    } else {
        runGame();
        printDebugInfo();
    }
}


/* ========== Game Screens ========== */

function runGame() {
    background(200);
    // drawOriginLines();

    /* calculations */
    currentQuadrant = getQuadrant();
    mousePosToCortesian();
    shieldAngle = coordinateToAngle(coordinateX, coordinateY);

    /* drawing */
    push();
    translate(200, 200);
    // rotate(reverseAngle(currentAngle));
    rotate(-shieldAngle);
    translate(-200, -200);
    drawShield();
    pop();

    /* changing and checking */
    moveAsteroidsTowardsCenter();
    checkDestroyAsteroids();
    checkDamagePlayer();

    drawPlayer();
    drawAsteroids();

}

function showLossScreen() {
    background(0);
    textSize(50);
    fill(255, 0, 0);
    text("YOU LOST", ORIGIN_LINE, ORIGIN_LINE);
}

/* ========== Drawing Functions ========== */

function drawPlayer() {
    fill(150);
    ellipse(ORIGIN_LINE, ORIGIN_LINE, 30);
    fill(0);
    text(points, ORIGIN_LINE, ORIGIN_LINE + 4);
}


function drawShield() {
    noFill();
    stroke(0, 0, 255);
    strokeWeight(2);
    arc(ORIGIN_LINE, ORIGIN_LINE, SHIELD_DIAMETER, SHIELD_DIAMETER, -SHIELD_LENGTH, 0);
    strokeWeight(1);
}


function drawAsteroids() {
    let asteroidX = 0;
    let asteroidY = 0;

    fill(150);

    asteroids.forEach((value) => {
        asteroidX = cortesianToPosition(cos(value.angle) * value.distance);
        asteroidY = cortesianToPosition(sin(value.angle) * value.distance);
        ellipse(asteroidX, asteroidY, ASTEROID_DIAMETER);
        // console.debug(`New Asteroid: (${Math.round(asteroidX)}, ${Math.round(asteroidY)}, ${value.angle})`);
    });
}


/* ========== Angle-Coordinate Conversion Functions ========== */

/**
 * converts Cortesian coordinate to angle in degrees
 * 
 * @param {number} cx coordinate-x
 * @param {number} cy coordinate-y
 */
function coordinateToAngle(cx, cy) {
    /*
        (200, 0) -> 0 [360]
        (0, 200) -> 90
        (-200, 0) -> 180
        (-200, -200) -> 270
    */

    let totalAngle = 0;
    let referenceAngle = atan(cy / cx);

    switch (currentQuadrant) {
        case 1:
            totalAngle = referenceAngle;
            break;
        case 2:
        case 3:
            totalAngle = (180 + referenceAngle);
            break;
        case 4:
            totalAngle = (360 + referenceAngle);
            break;
    }

    return totalAngle;
}


function angleToCortesian() {

}


function mousePosToCortesian() {
    switch (currentQuadrant) {
        case 1:
            coordinateX = mouseX - ORIGIN_LINE;
            coordinateY = ORIGIN_LINE - mouseY;
            break;
        case 2:
            coordinateX = -(ORIGIN_LINE - mouseX);
            coordinateY = ORIGIN_LINE - mouseY;
            break;
        case 3:
            coordinateX = -(ORIGIN_LINE - mouseX);
            coordinateY = -(mouseY - ORIGIN_LINE);
            break;
        case 4:
            coordinateX = mouseX - ORIGIN_LINE;
            coordinateY = -(mouseY - ORIGIN_LINE);
            break;
    }

}


function getQuadrant() {
    if ((mouseX >= ORIGIN_LINE) && (mouseY <= ORIGIN_LINE)) {
        return 1;
    } else if ((mouseX <= ORIGIN_LINE) && (mouseY <= ORIGIN_LINE)) {
        return 2;
    } else if ((mouseX <= ORIGIN_LINE) && (mouseY >= ORIGIN_LINE)) {
        return 3;
    } else if ((mouseX >= ORIGIN_LINE) && (mouseY >= ORIGIN_LINE)) {
        return 4;
    }
}


function cortesianToPosition(n) {
    return ORIGIN_LINE + n;
}


function reverseAngle(n) {
    return 360 - n;
}


/* ========== Asteroid Functions ========== */

function spawnNewAsteroid() {
    const asteroidAngle = random(0, 360); 
    asteroids.push(new Asteroid(asteroidAngle, ASTEROID_SPAWN_RADIUS));
}


function checkDestroyAsteroids() {
    if (asteroids.length === 0) return;

    /* only need to check the first asteroid, since it will be the closest */
    const aDistance = asteroids[0].distance;
    const aAngle = reverseAngle(asteroids[0].angle);

    let isClose;
    let isBlocked;

    /* edge case for when shield crosses 360 deg and aAngle is near 360 deg */
    if ((aAngle < SHIELD_LENGTH) && ((shieldAngle + SHIELD_LENGTH) > 360)) {
        isBlocked = ((aAngle + 360) > shieldAngle) && ((aAngle + 360) < (shieldAngle + SHIELD_LENGTH));
    }
    else {
        isBlocked = (aAngle > shieldAngle) && (aAngle < (shieldAngle + SHIELD_LENGTH));
    }
    
    isClose = (aDistance <= (SHIELD_RADIUS + 10)) && (aDistance >= SHIELD_RADIUS);
    
    if (isClose && isBlocked) {
        asteroids.shift();
    }

}


function checkDamagePlayer() {
    if (asteroids.length === 0) return;

    if (asteroids[0].distance <= 0) {
        points--;
        asteroids.shift();
    }

}


function moveAsteroidsTowardsCenter() {
    asteroids.forEach(v => v.distance -= asteroidsSpeed);
}


/* ========== Utility Functions ========== */

/**
 * 
 * @param {number} n 
 * @param {number} min 
 * @param {number} max inclusive 
 * @returns 
 */
function inRange(n, min, max) {
    return (n > min) && (n <= max);
}


/* ========== Debugging Functions ========== */
function drawOriginLines() {
    stroke(0);
    line(0, ORIGIN_LINE, width, ORIGIN_LINE);
    line(ORIGIN_LINE, 0, ORIGIN_LINE, height);
}


function drawAsteroidSpawnCircle() {
    noFill();
    stroke(252, 2, 248);
    strokeWeight(2);
    ellipse(ORIGIN_LINE, ORIGIN_LINE, ASTEROID_SPAWN_RADIUS * 2);
    strokeWeight(1);
}


function printMouseAngle() {
    console.log(`Current Angle: ${round(shieldAngle)} | Quadrant: ${currentQuadrant}`);
}


function printCoordinates() {
    console.log(`(${coordinateX}, ${coordinateY})`);
}


function printDebugInfo() {
    fill(0);
    text(`Shield Angle: ${round(shieldAngle)} | Asteroids[0] Angle: ${round(reverseAngle(asteroids[0]?.angle))}`, width - 200, 50);
}
