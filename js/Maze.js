
class Maze {
    constructor(rows, cols, cellsize, framerate) {
        this.rows = rows;
        this.cols = cols;
        this.cellsize = cellsize;
        this.framerate = 1000/framerate;

        this.width = this.cols * cellsize;
        this.height = this.rows * cellsize;
        
        this.sctx = this.initCanvas("cnvOv");
        this.ctx = this.initCanvas("cnv");
        this.grid = this.initGrid();
    }

    initCanvas(id){
        this.destroyCanvas(id);
        const left = document.querySelector(".main .left .maze");
        const cnv = document.createElement("canvas");

        cnv.width = this.width;
        cnv.height = this.height;
        cnv.id = `${id}`;

        const ctx = cnv.getContext("2d");
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        
        left.appendChild(cnv);
        
        return ctx;
    }

    destroyCanvas(id){
        if(id){
            let cnv = document.querySelector(`#${id}`);
            if(cnv) cnv.remove();
        } else {
            document.querySelectorAll("canvas").forEach(e => {
                e.remove();
            }); 
        }
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

    highlightPath(cell){
        setInterval(() => {
            if(cell.parent){
                cell.parent.drawPath(this.sctx, cell, "#bcc90c");
                cell = cell.parent;
            }
        }, 0);
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
                    this.grid[initialIndex].highlight(this.sctx, true, "#B3C5D7");
                    this.grid[this.grid.length-1].highlight(this.sctx, true, "#B3C57");

                    let arrow = document.querySelector(".back-arrow");
                    arrow.style.display = "flex";
                    arrow.click();

                    return true;
                }

                curr = stack.pop();
                return false;
            }
            

        },this.framerate);

    };

    solveMazeDfs(){
        console.log("Solving with Dfs...");
        this.sctx.reset();
        this.resetVisited();
        
        let stack = [];
        let curr = this.grid[0];
        let dest = this.grid[this.grid.length-1];
        stack.push(curr);
        

        setIntervalAwaitable(() => {
            if (stack.length > 0){

                let v = stack.pop();

                if (v.visited) return false;
                v.visited = true;
        
                let w;
                for(w of this.getNeighbors(v)){
                    if (w.visited) continue;
                    w.parent = v;
                    stack.push(w)
                }

                if (v.parent) v.parent.drawPath(this.sctx, v);

                if (v.r == dest.r && v.c == dest.c){
                    this.highlightPath(v);
                    return true;
                }
            }
            return false;

        }, this.framerate);
    }

    solveMazeBfs(){
        console.log("Solving with Bfs...");
        this.sctx.reset();
        this.resetVisited();

        let queue = [];
        let curr = this.grid[0];
        let dest = this.grid[this.grid.length-1];
        queue.push(curr);

        setIntervalAwaitable(() => {
            if (queue.length > 0){

                let v = queue.shift();

                if (v.visited) return false;
                v.visited = true;
        
                let w;
                for(w of this.getNeighbors(v)){
                    if (w.visited) continue;
                    w.parent = v;
                    queue.push(w)
                }

                if (v.parent) v.parent.drawPath(this.sctx, v);

                if (v.r == dest.r && v.c == dest.c){
                    this.highlightPath(v);
                    return true;
                }
            }
            return false;

        }, this.framerate);
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