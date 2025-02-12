
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

    show(ctx, color="#7392B7") {

        let w = this.w;
        let x = this.c * w;
        let y = this.r * w;
        
        const [top, right, bottom, left] = Object.values(this.walls);
        // c for current, d for destination
        //   xc,  yc,  xd,  yd
        if (top)    drawLine(ctx, x,     y,     x + w, y    );
        if (right)  drawLine(ctx, x + w, y,     x + w, y + w);
        if (bottom) drawLine(ctx, x + w, y + w, x,     y + w);
        if (left)   drawLine(ctx, x,     y + w, x,     y    );

        if(this.visited){
            drawRect(ctx, x,y,w,w,color); // 115, 55, 115
        }
    }

    drawPath(ctx, next){
        let w = this.w;
        let x1 = this.c * w + w / 2;
        let y1 = this.r * w + w / 2; 
        
        let x2 = next.r * w + w / 2;
        let y2 = next.c * w + w / 2;

        drawLine(ctx, x1, y1, x2, y2, "#000", w-2);
    }

    randomNeighbor(grid, rows, cols){
        
        let neighbors = [];

        [ // directions, u,r,d,l
            [-1,  0], [ 0,  1],
            [ 1,  0], [ 0, -1]
        ].forEach(dir => {
            let idx = index(this.r+dir[0], this.c+dir[1], rows, cols);
            if(idx == -1) return;

            let cell = grid[idx];
            if(!cell.visited){
                neighbors.push(cell);
            }
        });

        
        if (neighbors.length > 0){
            let r = Math.floor(Math.random()*neighbors.length);
            return neighbors[r];
        } else {
            return null;
        }

    }

    getNeighbors(grid, rows, cols){
        let neighbors = [];
        const [top, right, bottom, left] = Object.values(this.walls);

        let cellTop    = grid[index(this.r-1, this.c,   rows, cols)];
        let cellRight  = grid[index(this.r,   this.c+1, rows, cols)];
        let cellBottom = grid[index(this.r+1, this.c,   rows, cols)];
        let cellLeft   = grid[index(this.r,   this.c-1, rows, cols)];

        if(!top    && !cellTop.visited)    neighbors.push(cellTop)
        if(!right  && !cellRight.visited)  neighbors.push(cellRight)
        if(!bottom && !cellBottom.visited) neighbors.push(cellBottom)
        if(!left   && !cellLeft.visited)   neighbors.push(cellLeft);

        return neighbors;
    }

    highlight(ctx, small, color="#000"){
        let w = this.w;
        let x = this.c * w;
        let y = this.r * w;
        
        if(small){
            drawRect(ctx,x+w/2-w/10,y+w/2-w/10,w/5,w/5, color); //rgb(100,0,100)
        } else {
            drawRect(ctx, x, y, w, w, color);        
        }
    }
}