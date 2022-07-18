import Grid from './Grid.js'
import Tile from './Tile.js'

const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)
for (let i=0; i<20; i++) {
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.addBomb()
}


grid.updateCells()
setupInput()

function setupInput() {
    window.addEventListener("click", handleInput, {once: true})
}

async function handleInput(e) {
    if (e.target.closest(".cell")) {
        e.target.id = "click"
        test()
    }

    setupInput()
}

function test() {
    const cells = document.getElementsByClassName("cell")
    for (let i=0; i<cells.length; i++) {
        if (cells[i].id == "click") {
            grid.cells[i].click()
            cells[i].removeAttribute('id')
        }
    }
    grid.updateCells()
}

