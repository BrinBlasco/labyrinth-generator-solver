
const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");

let WIDTH = 5000;
let HEIGHT = 5000;
let CELL_SIZE = 50;
let FRAME_RATE = 1000/30;

let grid = [];
let COLS = Math.floor(WIDTH/CELL_SIZE);
let ROWS = Math.floor(HEIGHT/CELL_SIZE);

const drawRect = (x, y, width, height, color="#000", fill=true) => {
    ctx.fillStyle = color;
    if (fill){
        ctx.fillRect(x, y, width, height);
    } else {
        ctx.strokeRect(x, y, width, height);
    }
};

const drawLine = (xc, yc, xd, yd, color="#000") => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(xc, yc);
    ctx.lineTo(xd, yd);
    ctx.stroke();
    ctx.closePath();
};

const initGrid = () => {
    for(let r = 0; r < ROWS; r++){
        for(let c = 0; c < COLS; c++){
            let cell = new Cell(r, c);
            grid.push(cell);
            cell.show();
        }
    }
};

const refreshGrid = () => {
    for(let i = 0; i < grid.length; i++){
        grid[i].show();
    }
};

const index = (r, c) => {
    if(r < 0 || c < 0 || c > COLS - 1 || r > ROWS - 1){
        return -1;
    }
    return c + r * COLS;
};

class Cell {

    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.visited = false;

        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
    }

    show() {

        let w = CELL_SIZE;
        let x = this.c * w;
        let y = this.r * w;
        
        const [top, right, bottom, left] = Object.values(this.walls);
        // c for current, d for destination
        //   xc,  yc,  xd,  yd
        if (top)    drawLine(x, y, x + w, y);
        if (right)  drawLine(x + w, y, x + w, y + w);
        if (bottom) drawLine(x + w, y + w, x, y + w);
        if (left)   drawLine(x, y + w, x, y);

        if(this.visited){
            drawRect(x,y,w,w,"rgb(160, 50, 160)");
        }
    }

    getNeighbors(){
        
        let neighbors = [];

        [ // directions, u,r,d,l
            [-1,  0],
            [ 0,  1],
            [ 1,  0],
            [ 0, -1]
        ].forEach(dir => {
            let idx = index(this.r+dir[0], this.c+dir[1]);
            if(idx == -1) return;

            let cell = grid[index(this.r+dir[0], this.c+dir[1])];
            if(!cell.visited){
                neighbors.push(cell);
            }
        });

        
        if (neighbors.length > 0){
            let r = Math.floor(Math.random()*neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }

    }

    highlight(){
        let w = CELL_SIZE;
        let x = this.c * w;
        let y = this.r * w;

        drawRect(x,y,w,w,"rgb(100,0,100)");
    }
}

const removeWalls = (curr, next) => {
    let x = curr.c - next.c;
    let y = curr.r - next.r;
    
    if(x === 1){ // to the right
        curr.walls.left = false;
        next.walls.right = false;

    } else if (x === -1) {        
        curr.walls.right = false;
        next.walls.left = false;
    }

    if(y === 1){
        curr.walls.top = false;
        next.walls.bottom = false;

    } else if (y === -1) {
        curr.walls.bottom = false;
        next.walls.top = false;
    }
};

const resetMaze = () => {
    grid.length = 0;
    drawRect(0,0,WIDTH,HEIGHT,"rgb(49,49,49)", true);
};


const generateMaze = () => {

    cnv.width = WIDTH;
    cnv.height = HEIGHT;
    
    let current;
    initGrid();

    current = grid[0];
    current.visited = true;

    stack = [];

    setInterval(() => {
        
        let next = current.getNeighbors();
        if(next) {
            
            next.visited = true;

            stack.push(current);

            removeWalls(current, next);
            
            current = next;

            refreshGrid();

            // /next.highlight();

        } else if (stack.length > 0){
            current = stack.pop();
        } else if (stack.length == 0){
            refreshGrid();
        }

    }, FRAME_RATE);
    
};


const main = () => {
    generateMaze();
    //resetMaze();
};
main();
