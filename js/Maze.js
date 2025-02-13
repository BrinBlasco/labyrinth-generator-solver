
class Maze {
    constructor(
        rows, cols, cellsize, framerate
    ) {
        this.rows = rows;
        this.cols = cols;
        this.cellsize = cellsize;
        this.framerate = 1000/framerate;

        this.width = this.cols * cellsize;
        this.height = this.rows * cellsize;
        
        this.ctx = this.initCanvas();
        this.grid = this.initGrid();
    }

    initCanvas(){
        this.destroyCanvas();
        const left = document.querySelector(".main .left .maze");
        const cnv = document.createElement("canvas");

        cnv.width = this.width;
        cnv.height = this.height;
        cnv.id = "cnv";

        left.appendChild(cnv);

        const ctx = cnv.getContext("2d");
        
        return ctx;
    }

    destroyCanvas(){
        document.querySelectorAll("canvas").forEach(e => {
            e.remove();
        });
    }

    initGrid(){
        let grid = [];
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                let cell = new Cell(r, c, this.cellsize);
                grid.push(cell);
                cell.show(this.ctx);
            } 
        }
        return grid;
    }

    refreshGrid(...kwargs){
        if (kwargs.length != 0) {
            kwargs.forEach(cell => {
                cell.show(this.ctx);
            })
            return;
        }
        for(let i = 0; i < this.grid.length; i++){
            this.grid[i].show(this.ctx);
        }
    }

    index(r, c){
        if(r < 0 || c < 0 || c > this.cols - 1 || r > this.rows - 1) return -1;
        return c + r * this.cols;
    }

    randomNeighbor(cell){
        
        let neighbors = [];

        [ // directions, u,r,d,l
            [-1,  0], [ 0,  1],
            [ 1,  0], [ 0, -1]
        ].forEach(dir => {
            let idx = this.index(cell.r+dir[0], cell.c+dir[1]);
            if(idx == -1) return;

            let nextCell = this.grid[idx];
            if(!nextCell.visited){
                neighbors.push(nextCell);
            }
        });
        
        if (neighbors.length > 0){
            let r = Math.floor(Math.random()*neighbors.length);
            return neighbors[r];
        } else {
            return null;
        }

    }

    getNeighbors(cell, ignoreWalls = false){
        
        let neighbors = [];
        
        const walls = Object.values(cell.walls);

        const directions = [ // directions, u,r,d,l
            [-1,  0], [ 0,  1],
            [ 1,  0], [ 0, -1]
        ];

        directions.forEach(([dr, dc], i) => {
            let idx = this.index(cell.r + dr, cell.c + dc);
            if(idx == -1) return;

            let nextCell = this.grid[idx];
            
            if(!nextCell.visited && (ignoreWalls || !walls[i])){
                neighbors.push(nextCell);
            }
        });

        return neighbors;
    }

    resetVisited(){
        for(let cell of this.grid){
            cell.visited = false;
        }
    }

    async generateMaze(initialIndex){

        let next;
        let neighbors;
        let stack = [];
        let curr = this.grid[initialIndex];
        curr.visited = true;

        await setIntervalAwaitable(() => {

            neighbors = this.getNeighbors(curr, true);
            next = neighbors[parseInt(Math.random()*neighbors.length)];
            
            if(next){

                next.visited = true;
                
                stack.push(curr);

                curr.removeWalls(next);
                this.refreshGrid();

                curr = next;

                return false;

            } else if (stack.length >= 0){

                if(stack.length == 0) {

                    this.resetVisited();
                    this.grid[initialIndex].highlight(this.ctx, true, "#B3C5D7");
                    this.grid[this.grid.length-1].highlight(this.ctx, true, "#B3C57");

                    let arrow = document.querySelector(".back-arrow");
                    arrow.style.display = "flex";
                    arrow.click();

                    return true;
                }

                curr = stack.pop();
                return false;
            }
            
            //this.refreshGrid(curr, next);

        },this.framerate);
    };

    solveMazeDfs(){
        console.log("Solving with Dfs...");
        
        let stack = [];
        let curr = this.grid[0];
        let dest = this.grid[this.grid.length-1];
        stack = [curr];

        setIntervalAwaitable(() => {
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
                    //highlightPath(ctx, v);
                    return true;
                }
                

            }
        }, this.framerate);
    }

    solveMazeBfs(){
        console.log("Solving with Bfs..."); 
    }

    solveMazeDijkstra(){
        console.log("Solving with Dijkstra..."); 
    }

    solveMazeAstar(){
        console.log("Solving with Astar..."); 
    }
}

// const main = () => {

//     let defaultValues = {
//         rows : 10,
//         cols : 10,
//         cellsize : 50,
//         fps: 0
//     };

//     let maze = new Maze(...Object.values(defaultValues));
//     maze.generateMaze(0);

// };

// main();