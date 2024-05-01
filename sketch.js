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
let currentAngle = 0;

let points = 10;
let asteroids = [];


function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);
    textAlign(CENTER);

    /* DEBUGGING */
    for (let i = 0; i < 5; i++) {
        spawnNewAsteroid();
    }
}


function draw() {
    background(200);
    drawOriginLines();

    /* calculations */
    currentQuadrant = getQuadrant();
    mousePosToCortesian();
    currentAngle = coordinateToAngle(coordinateX, coordinateY);

    /* drawing */
    push();
	translate(200, 200);
    // rotate(reverseAngle(currentAngle));
    rotate(-currentAngle);
    translate(-200, -200);
    drawShield();
    pop();
    drawPlayer();
    drawAsteroids();

    // printCoordinates();
    // printMouseAngle();
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
        asteroidX = cos(value.angle) * value.distance;
        asteroidY = sin(value.angle) * value.distance;
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
    let referenceAngle = atan(cy/cx);

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

/* ========== Asteroid Functions ========== */

function spawnNewAsteroid() {
    const asteroidAngle = random(0, 360);
    asteroids.push(new Asteroid(asteroidAngle, ASTEROID_SPAWN_RADIUS));
}


function checkDestroyAsteroids() {

}

/* ========== Utility Functions ========== */


/* ========== Debugging Functions ========== */
function drawOriginLines() {
    stroke(0);
    line(0, ORIGIN_LINE, width, ORIGIN_LINE);
    line(ORIGIN_LINE, 0, ORIGIN_LINE, height);
}

function printMouseAngle() {
    console.log(`Current Angle: ${round(currentAngle)} | Quadrant: ${currentQuadrant}`);
}

function printCoordinates() {
    console.log(`(${coordinateX}, ${coordinateY})`);
}
