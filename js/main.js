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

let step = 0;
document.querySelectorAll('input[type="range"]').forEach((el, i) => {
    el.addEventListener("input", (e) => {
        dispFields[i].textContent = e.target.value;
        defaultValues[Object.keys(defaultValues)[i]] = parseInt(e.target.value);
        step = 0;
    }); 
});


const arrow = document.querySelector(".right .back-arrow");
const generateButton = document.querySelector("#generate");
const mazeParameters = document.querySelector(".right .maze-parameters");
const solvingAlgorithms = document.querySelector(".right .solving-algorithms");

arrow.style.display = "none";
arrow.addEventListener("click", () => {
    solvingAlgorithms.classList.toggle("hidden");
    mazeParameters.classList.toggle("hidden");
    arrow.classList.toggle("rotate");
});


let dragging;
let startingIndex = 0;
let maze = new Maze(...Object.values(defaultValues));

generateButton.addEventListener("click", async (e) => { 
    if (step == 0){
        maze.initCanvas("overlay");
        maze.initCanvas("grid");
        maze.initGrid();
        maze.initDragger();

        maze.dragger.addSquare(0);
        maze.dragger.enableDragging();
        
        step++;
        return;
    }
    dragging.disableDragging();
    startingIndex = dragging.squares.at(0).index;
    dragging.reset();

    generateButton.disabled = true;
    await maze.generateMaze(startingIndex);
    generateButton.disabled = false;

    let solveButton = document.querySelector("#solve");
    let clearButton = document.querySelector("#clear");
    
    clearButton.disabled = true;
    solveButton.addEventListener("click", () => {

        let alg = document.querySelector("input[name='alg']:checked")?.value || "default";
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
        clearButton.disabled = false;
    });

    clearButton.addEventListener("click", () => {
        maze.sctx.reset();
        clearButton.disabled = true;
    });

});

// const getClickedCell = () => {
//     let promise;

//     promise = new Promise((res, rej) => {
//         const maze = document.querySelector(".maze");
//         maze.addEventListener("click", (e) => {
//             let bounds = e.target.getBoundingClientRect();

//             let x = e.clientX - bounds.left;
//             let y = e.clientY - bounds.top;
            
//             let row = Math.ceil(y / defaultValues.cellsize) - 1;
//             let column = Math.ceil(x / defaultValues.cellsize) - 1;

//             //let startIndex = column + row * defaultValues.cols;
//             lastClickedPosition = column + row * defaultValues.cols;
            
//             console.log("Stored position: ", lastClickedPosition);
//             storedResolveFunc = res;
//         });
//     });
    
//     return promise;
// };
    