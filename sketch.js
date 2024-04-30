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


/* ========== Variables ========== */
/** (mouseX, mouseY) --> Cortesian (coordinateX, coordinateY) */
let coordinateX = 0;
let coordinateY = 0;
let currentQuadrant = 0;
let currentAngle = 0;

let points = 10;


function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);
    textAlign(CENTER);
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
    rotate(reverseAngle(currentAngle));
    translate(-200, -200);
    drawShield();
    pop();
    drawPlayer();

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
    arc(ORIGIN_LINE, ORIGIN_LINE, SHIELD_DIAMETER, SHIELD_DIAMETER, -45, 0);
    strokeWeight(1);
}


function drawAsteroids() {}


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


function reverseAngle(inp) {
    return 360 - inp;
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
