class Dragger {
    constructor(ctx, rows, cols, cellSize) {
        this.ctx = ctx;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.squares = [];  // Holds up to 2 squares
        this.isDragging = null;  // Index of the square being dragged
    }

    // Add a square based on its 1D grid index
    addSquare = (index) => {
        if (this.squares.length >= 2) return;

        const col = index % this.cols;
        const row = Math.floor(index / this.cols);

        const square = {
            index,
            x: col * this.cellSize,
            y: row * this.cellSize,
        };

        this.squares.push(square);
        console.log(this.ctx);
        this.drawSquares();
        
    };

    // Draw squares on the canvas
    drawSquares = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.squares.forEach((square, i) => {
            let color = i === 0 ? "blue" : "red";
            this.ctx.fillStyle = color;
            this.ctx.fillRect(square.x, square.y, this.cellSize, this.cellSize);
        });
    };

    // Event Handlers as arrow functions (automatically bind 'this')
    handleMouseDown = (e) => {
        console.log("mousedown event triggered");
        const { offsetX, offsetY } = e;

        this.squares.forEach((square, i) => {
            if (
                offsetX >= square.x &&
                offsetX <= square.x + this.cellSize &&
                offsetY >= square.y &&
                offsetY <= square.y + this.cellSize
            ) {
                console.log("Square selected for dragging:", i);
                this.isDragging = i;
            }
        });
    };

    handleMouseMove = (e) => {
        if (this.isDragging === null) return;
        console.log("mousemove event triggered while dragging square", this.isDragging);

        const bounds = this.ctx.canvas.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        let row = Math.floor(y / this.cellSize);
        let col = Math.floor(x / this.cellSize);

        // Ensure the square stays within grid bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;

        // Update square position and index
        this.squares[this.isDragging].x = col * this.cellSize;
        this.squares[this.isDragging].y = row * this.cellSize;
        this.squares[this.isDragging].index = row * this.cols + col;

        this.drawSquares();
    };

    handleMouseUp = (e) => {
        console.log("mouseup event triggered");
        this.isDragging = null;
    };

    handleMouseLeave = (e) => {
        console.log("mouseleave event triggered");
        this.isDragging = null;
    };

    // Enable dragging event listeners on the canvas
    enableDragging() {
        console.log("Enabling dragging events");
        const canvas = this.ctx.canvas;
        canvas.addEventListener("mousedown", this.handleMouseDown);
        canvas.addEventListener("mousemove", this.handleMouseMove);
        canvas.addEventListener("mouseup", this.handleMouseUp);
        canvas.addEventListener("mouseleave", this.handleMouseLeave);
    }

    // Remove event listeners
    disableDragging() {
        console.log("Disabling dragging events");
        const canvas = this.ctx.canvas;
        canvas.removeEventListener("mousedown", this.handleMouseDown);
        canvas.removeEventListener("mousemove", this.handleMouseMove);
        canvas.removeEventListener("mouseup", this.handleMouseUp);
        canvas.removeEventListener("mouseleave", this.handleMouseLeave);
    }

    // Clear all squares and remove event listeners
    reset() {
        this.squares = [];
        this.isDragging = null;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.disableDragging();
    }
}
