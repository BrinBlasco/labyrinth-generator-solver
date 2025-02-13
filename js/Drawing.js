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
