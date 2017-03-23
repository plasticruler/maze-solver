/* configs */
var CANVAS_SIZE = 500;
var CELL_WIDTH = 20;
var ROW_COUNT = CANVAS_SIZE / CELL_WIDTH;
var FRAME_RATE = 60;

var grid = [];
var unvisited = [];
var visited = [];
var solved = false;
var mazeIsSolved = false;

var current;
var start;
var end;

var _NEUTRAL = 1;
var _VISITED = 2;
var _CURRENT = 3;
var _OBSTACLE = 4;
var _START = 5;
var _END = 6;
var pause = true;

/** a-star */
var came_from = [];


/* configs */
function setup() {
    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < ROW_COUNT; j++) {
            grid.push(new Cell(i, j));
        }
    }
    frameRate(FRAME_RATE);
    start = grid[0];
    end = grid[grid.length - 1];
    current = start;
}

function executeMazeBuildStep() {
    current.setCellType(_VISITED)
    current.IsVisited = true;
    var neighbours = current.getUnvisitedNeighbours();
    next = neighbours[Math.floor(Math.random() * neighbours.length)];
    if (next) {
        next.setCellType(_CURRENT);
        removeWall(current, next);
        visited.push(next);
        current = next;
    } else if (visited.length > 0) {
        current = visited.pop(); //reverse
        current.setCellType(_CURRENT);
    }
    if (visited.length == 0) {
        current.setCellType(_VISITED);
        current = start;
        solved = true;
        console.log('Maize build is completed.');
        resetIsVisited();
    }
    start.setCellType(_START);
    end.setCellType(_END);
}

function executeSolveMazeStepGreedy() {

    current.IsVisited = true;
    visited.push(current); //remember the path here
    var r = getReachableUnvisitedNeighbours(current); //get unexplorerd nodes
    var lastVisited;
    if (r.length > 0) {
        for (var i = 0; i < r.length; i++) {
            unvisited.push(r[i]);
        }
    } else {
        //dead end
        //we want to 'reverse' the path
        //reverse until you find a node that has a reachable neighbour
        while ((getReachableUnvisitedNeighbours(current).length == 0)) { //reverse until u get to where you can turn          
            current = visited.pop();
            current.setCellType(_VISITED);
        }
        current.setCellType(_VISITED);
        return;
    }

    current.setCellType(_CURRENT);
    if (unvisited.length > 0) {
        next = unvisited.pop();
        current = next;
        if (current.Row == end.Row && current.Column == end.Column) {
            visited.push(current);
            current.setCellType(_CURRENT);
            mazeIsSolved = true;
        }
    } else {
        mazeIsSolved = true;
    }
}

function getReachableNeighbours(a) {
    var neighbours = a.getNeighbours();
    var r = [];
    for (var i = 0; i < neighbours.length; i++) {
        if (isConnected(a, neighbours[i]))
            r.push(neighbours[i]);
    }
    return r;
}

function getReachableUnvisitedNeighbours(a) {
    var neighbours = a.getNeighbours();
    var r = [];
    for (var i = 0; i < neighbours.length; i++) {
        if (isConnected(a, neighbours[i]) && !neighbours[i].IsVisited)
            r.push(neighbours[i]);
    }
    return r;
}

function resetIsVisited() {
    for (var i = 0; i < grid.length; i++) {
        grid[i].IsVisited = false;
    }
    visited = [];
}

function isConnected(a, b) {

    var x = a.Row - b.Row;
    if (x === -1) {
        if (!a.wallB && !b.wallT && a.Column == b.Column)
            return true;
    } else if (x === 1) {
        if (!b.wallB && !a.wallT && a.Column == b.Column)
            return true;
    }

    x = a.Column - b.Column;
    if (x === -1) {
        if (!b.wallL && !a.wallR && a.Row == b.Row)
            return true;
    } else if (x === 1) {
        if (!a.wallL && !b.wallR && a.Row == b.Row)
            return true;
    }
}



function getIndex(col, row) {
    if (row < 0 || col < 0 || row > ROW_COUNT - 1 || col > ROW_COUNT - 1) {
        return -1;
    }
    return row + col * ROW_COUNT;
}

function getCell(i, j) {
    return grid[getIndex(i, j)];
}

function keyPressed() {
    pause = !pause;
}

function removeWall(a, b) {
    var x = a.Column - b.Column;
    if (x === -1) {
        a.wallR = false;
        b.wallL = false;
    } else if (x === 1) {
        b.wallR = false;
        a.wallL = false;
    }

    x = a.Row - b.Row;
    if (x === 1) {
        a.wallT = false;
        b.wallB = false;
    } else if (x === -1) {
        b.wallT = false;
        a.wallB = false;
    }
}

function draw() {
    background('white');
    if (!solved) {
        if (!pause)
            executeMazeBuildStep();
    } else {
        if (!pause)
            if (!mazeIsSolved)
                executeSolveMazeStepGreedy();
    }
    for (var z = 0; z < grid.length; z++) {
        grid[z].show();
    }
    noFill();
    strokeWeight(3);
    stroke('blue');
    rect(0, 0, CANVAS_SIZE-1, CANVAS_SIZE-1);
}