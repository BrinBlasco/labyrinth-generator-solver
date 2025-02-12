
class Cell {

    constructor(r, c, w) {
        this.r = r;
        this.c = c;
        this.w = w;
        this.visited = false;

        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
    }

    show(ctx) {

        let w = this.w;
        let x = this.c * w;
        let y = this.r * w;
        
        const [top, right, bottom, left] = Object.values(this.walls);
        // c for current, d for destination
        //   xc,  yc,  xd,  yd
        if (top)    drawLine(ctx, x, y, x + w, y);
        if (right)  drawLine(ctx, x + w, y, x + w, y + w);
        if (bottom) drawLine(ctx, x + w, y + w, x, y + w);
        if (left)   drawLine(ctx, x, y + w, x, y);

        if(this.visited){
            drawRect(ctx, x,y,w,w,"rgb(160, 50, 160)");
        }
    }

    randomNeighbor(grid){
        
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

    highlight(ctx){
        let w = CELL_SIZE;
        let x = this.c * w;
        let y = this.r * w;

        drawRect(ctx,x,y,w,w,"rgb(100,0,100)");
    }
}


const drawRect = (ctx, x, y, width, height, color="#000", fill=true) => {
    ctx.fillStyle = color;
    if (fill){
        ctx.fillRect(x, y, width, height);
    } else {
        ctx.strokeRect(x, y, width, height);
    }
};

const drawLine = (ctx, xc, yc, xd, yd, color="#000") => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(xc, yc);
    ctx.lineTo(xd, yd);
    ctx.stroke();
    ctx.closePath();
};

const initCanvas = (cnv, width, height) => {
    cnv.width = width;
    cnv.height = height;
};

const initGrid = (ctx, rows, cols, cell_size) => {
    let grid = [];
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let cell = new Cell(r, c, cell_size);
            grid.push(cell);
            cell.show(ctx);
        }
    }
    return grid;
};

const refreshGrid = (grid) => {
    for(let i = 0; i < grid.length; i++){
        grid[i].show();
    }
};

const index = (r, c, rows, cols) => {
    if(r < 0 || c < 0 || c > cols - 1 || r > rows - 1){
        return -1;
    }
    return c + r * cols;
};


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

const resetMaze = (ctx, grid) => {
    grid.length = 0;
    drawRect(ctx, 0,0,WIDTH,HEIGHT,"rgb(49,49,49)", true);
};


const generateMaze = (rows, cols, cell_size, framerate) => {

    let grid = [];

    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    let WIDTH = cols * cell_size;
    let HEIGHT = rows * cell_size;
    let CELL_SIZE = cell_size;
    let FRAME_RATE = 1000/framerate;

    let COLS = cols;
    let ROWS = rows;

    initCanvas(cnv, WIDTH, HEIGHT); 
    grid = initGrid(ctx, ROWS, COLS, CELL_SIZE);
    console.log(grid);

    let current = grid[0]; // starting point -- prvi top left
    current.visited = true;

    stack = [];

    setInterval(() => {
        
        let next = current.randomNeighbor(grid);
        if(next) {
            
            next.visited = true;

            stack.push(current);

            removeWalls(current, next);
            
            current = next;

            refreshGrid(grid);

            // /next.highlight();

        } else if (stack.length > 0){
            current = stack.pop();
        } else if (stack.length == 0){
            refreshGrid(grid);
        }

    }, FRAME_RATE);
    
};


const main = () => {

    generateMaze(10,10,10,1);
    //resetMaze();
};
main();
