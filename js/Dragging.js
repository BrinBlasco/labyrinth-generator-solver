const initSquares = () => {

    //CANVASES SHIT YES THE CANVAS 2 HERE WHERE WE CHANGE STARTING AND END POINTS 
    //BUT HOW DO I DO THE ACTUAL SHIT 

    let activeSquare = null;
    let isDragging = false;

    const drawSquares = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        squares.forEach(({ x, y, size, color }) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size);
        });
    };

    const getSquareAt = (x, y) => {
        return squares.find(sq =>
            x >= sq.x && x <= sq.x + sq.size &&
            y >= sq.y && y <= sq.y + sq.size
        );
    };

    const startDragging = (e) => {
        activeSquare = getSquareAt(e.offsetX, e.offsetY);
        if (activeSquare) isDragging = true;
    };

    const stopDragging = () => {
        isDragging = false;
        activeSquare = null;
    };

    const moveSquare = (e) => {
        if (!isDragging || !activeSquare) return;

        let bounds = canvas.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        let y = e.clientY - bounds.top;

        let row = Math.floor(y / activeSquare.size);
        let col = Math.floor(x / activeSquare.size);

        let newX = col * activeSquare.size;
        let newY = row * activeSquare.size;

        if (newX !== activeSquare.x || newY !== activeSquare.y) {
            activeSquare.x = newX;
            activeSquare.y = newY;
            drawSquares();
        }
    };

    canvas.addEventListener("mousedown", startDragging);
    canvas.addEventListener("mousemove", moveSquare);
    canvas.addEventListener("mouseup", stopDragging);
    canvas.addEventListener("mouseleave", stopDragging);

};
