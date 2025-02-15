

const drawRect = (ctx, x, y, width, height, color="#000", fill=true) => {
    ctx.fillStyle = color;
    if (fill){
        ctx.fillRect(x, y, width, height);
    } else {
        ctx.strokeRect(x, y, width, height);
    }
};

const drawLine = (ctx, xc, yc, xd, yd, color="#D8E1E9", strokeWidth = 2) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = "round";
    ctx.moveTo(xc, yc);
    ctx.lineTo(xd, yd);
    ctx.stroke();
    ctx.closePath();
};

const initCanvas = (width, height) => {

    const left = document.querySelector(".main .left .maze");
    const cnv = document.createElement("canvas");

    cnv.width = width;
    cnv.height = height;
    cnv.id = "cnv";
    
    const cnvOv = document.createElement("canvas");
    cnvOv.width = width;
    cnvOv.height = height;
    cnv.id = "cnvOv"


    left.appendChild(cnv);
    left.appendChilc(cnvOv);
    
    const ctx = cnv.getContext("2d");

    return [cnv, ctx];
};

const destroyCanvas = (id) => {
    document.querySelectorAll(`canvas ${id}`).forEach(e => {
        e.remove();
    });
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

const refreshGrid = (ctx, grid) => {
    for(let i = 0; i < grid.length; i++){
        grid[i].show(ctx);
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
    
    if(x == 1){ // to the right
        curr.walls.left = false;
        next.walls.right = false;

    } else if (x == -1) {        
        curr.walls.right = false;
        next.walls.left = false;
    }

    if(y == 1){
        curr.walls.top = false;
        next.walls.bottom = false;

    } else if (y == -1) {
        curr.walls.bottom = false;
        next.walls.top = false;
    }
};

const highlightPath = (ctx, node, color="#0f0") => {
    setInterval(() => {
        if(node.parent){
            node.parent.drawPath(ctx, node, color);
            node = node.parent;
        }
    }, 0);
};

function setIntervalAwaitable(callback, interval){
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            let shouldStop = callback();

            if(shouldStop) {
                clearInterval(intervalId);
                resolve();
            }
        }, interval)
    })
}

const generateMaze = async (rows, cols, cell_size, framerate) => {

    destroyCanvas();

    let grid = [];

    let WIDTH = cols * cell_size;
    let HEIGHT = rows * cell_size;
    let CELL_SIZE = cell_size;
    let FRAME_RATE = 1000/framerate;

    let COLS = cols;
    let ROWS = rows;

    let [cnv, ctx] = initCanvas(WIDTH, HEIGHT);
    grid = initGrid(ctx, ROWS, COLS, CELL_SIZE);

    let current = grid[0]; // starting point -- prvi top left
    current.visited = true;

    stack = [];
    
    await setIntervalAwaitable(() => {
        
        let next = current.randomNeighbor(grid, ROWS, COLS);
        if(next) {
            
            next.visited = true;
            
            stack.push(current);

            removeWalls(current, next);
            
            current = next;

            refreshGrid(ctx, grid);

            //next.highlight(ctx);

            return false;

        } else if (stack.length >= 0){

            if (stack.length == 0){
                for(let i = 0; i < grid.length; i++){
                    grid[i].visited = false;
                } // resetVisited()

                grid[0].highlight(ctx, true, "#B3C5D7");
                grid[grid.length-1].highlight(ctx, true, "#B3C5D7");

                let arrow = document.querySelector(".back-arrow");
                arrow.style.display = "flex";
                arrow.click();

                return true;
            }
            current = stack.pop();
            return false;
        } 

    }, FRAME_RATE);

    stack.length = 0;
    let curr = grid[0];
    let dest = grid[grid.length-1];
    stack = [curr];

    await setIntervalAwaitable(() => {
        if (stack.length > 0){

            v = stack.pop();

            if (v.visited) return false;
            v.visited = true;
    
            let w;
            for(w of v.getNeighbors(grid,rows,cols)){
                if (w.visited) continue;

                w.parent = v;
                stack.push(w)
            }

            if (v.parent) v.parent.drawPath(ctx, v);

            if (v.r == dest.r && v.c == dest.c){
                highlightPath(ctx, v);
                return true;
            }
            

        }
    }, FRAME_RATE);
    
    return grid;
};

const solveMaze = (grid) => {
    console.log(grid)
};


const main = () => {    

    let rowsField = document.querySelector("#numrowsDisp");
    let colsField = document.querySelector("#numcolsDisp");
    let cellField = document.querySelector("#cellsizeDisp");
    let frameField = document.querySelector("#framerateDisp");

    //rows,  cols,  cellsize, fps
    let defaultValues = [10, 10, 50, 0];

    // let defaultValues = {
    //     rows : 10,
    //     cols : 10,
    //     cellsize : 50,
    //     fps: 0
    // };

    let dispFields = [rowsField, colsField, cellField, frameField];

    let arrow = document.querySelector(".back-arrow");
    arrow.style.display = "none";

    document.querySelectorAll('input[type="range"]').forEach((el, i) => {
        el.addEventListener("input", (e) => {
            dispFields[i].textContent = e.target.value;
            defaultValues[i] = parseInt(e.target.value);
            //defaultValues[Object.keys(defaultValues)[i]] = parseInt(e.target.value);
        });
    });

    document.querySelector("#generate").addEventListener("click", async (e) => {

        let generateButton = document.querySelector("#generate");
        let solveButton = document.querySelector("#solve");
        generateButton.disabled = true;

        let output = await generateMaze(...Object.values(defaultValues));
        generateButton.disabled = false;


        
        let maze = document.querySelector(".maze");
        let cellR;
        let cellY;

        maze.addEventListener("click", function (e) {
            let bounds = e.target.getBoundingClientRect();

            let x = e.clientX - bounds.left;
            let y = e.clientY - bounds.top;

            cellR = x;
            cellC = y;
            console.log(x, y);
            
            let row = Math.ceil(y / 50) - 1;
            let column = Math.ceil(x / 50) - 1;

            let index = column + row * 10;
            console.log(index, row, column);
        });

        solveButton.addEventListener("click", () => {
            solveMaze(output);
        });
    });

};

main();
