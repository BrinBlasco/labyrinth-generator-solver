let rowsField = document.querySelector("#numrowsDisp");
let colsField = document.querySelector("#numcolsDisp");
let cellField = document.querySelector("#cellsizeDisp");
let frameField = document.querySelector("#framerateDisp");

let dispFields = [rowsField, colsField, cellField, frameField];

let defaultValues = {
    rows : 10,
    cols : 10,
    cellsize : 50,
    fps: 0
};

const algs = Object.freeze({
    DFS : "dfs"
})

const arrow = document.querySelector(".right .back-arrow");
const mazeParameters = document.querySelector(".right .maze-parameters");
const solvingAlgorithms = document.querySelector(".right .solving-algorithms");

arrow.addEventListener("click", (e) => {
    solvingAlgorithms.classList.toggle("hidden");
    mazeParameters.classList.toggle("hidden");
    arrow.classList.toggle("rotate");
});
arrow.style.display = "none";


document.querySelectorAll('input[type="range"]').forEach((el, i) => {
    el.addEventListener("input", (e) => {
        dispFields[i].textContent = e.target.value;
        //defaultValues[i] = parseInt(e.target.value);
        defaultValues[Object.keys(defaultValues)[i]] = parseInt(e.target.value);
    });
});

document.querySelector("#generate").addEventListener("click", async (e) => {

    let generateButton = document.querySelector("#generate");
    let solveButton = document.querySelector("#solve");

    generateButton.disabled = true;
    let maze = new Maze(...Object.values(defaultValues));
    maze.generateMaze(0); // pogrunti za starting position kku nastimat
    generateButton.disabled = false;

    solveButton.addEventListener("click", () => {
        let alg = document.querySelector("input[name='alg']:checked").value;
        solveButton.disabled = true;

        switch (alg) {
            case "dfs":
                maze.solveMazeDfs();
                break;
            case "bfs":
                maze.solveMazeBfs();
                break;
            case "dijkstra":
                maze.solveMazeDijkstra();
                break; 
            case "astar":
                maze.solveMazeAstar();
                break;
            default:
                console.log("Unlockey u hit default");
                break;
        }

        solveButton.disabled = false;
        
    });

    // let maze = document.querySelector(".maze");
    // let cellR;
    // let cellY;

    // maze.addEventListener("click", function (e) {
    //     let bounds = e.target.getBoundingClientRect();

    //     let x = e.clientX - bounds.left;
    //     let y = e.clientY - bounds.top;

    //     cellR = x;
    //     cellC = y;
    //     console.log(x, y);
        
    //     let row = Math.ceil(y / 50) - 1;
    //     let column = Math.ceil(x / 50) - 1;

    //     let index = column + row * 10;
    //     console.log(index, row, column);
    // });

});