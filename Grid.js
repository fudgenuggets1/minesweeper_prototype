const GRID_SIZE = 8
const CELL_SIZE = 12
const CELL_GAP = 0.5


export default class Grid {
	#cells

	constructor(gridElement) {
		gridElement.style.setProperty("--grid-size", GRID_SIZE)
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
		gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
		this.#cells = createCellElements(gridElement).map((cellElement, index) => {
			return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
		})
	}

    get cells() {
		return this.#cells
	}

	get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.y] = cellGrid[cell.y] || []
			cellGrid[cell.y][cell.x] = cell
			return cellGrid
		}, [])
	}

	get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.x] = cellGrid[cell.x] || []
			cellGrid[cell.x][cell.y] = cell
			return cellGrid
		}, [])
	}

	get #emptyCells() {
		return this.#cells.filter(cell => cell.tile == null && cell.bomb == null)
	}

	randomEmptyCell() {
		const randomIndex = this.randomEmptyCellIndex()
		return this.#emptyCells[randomIndex]
	}

    randomEmptyCellIndex() {
        return Math.floor(Math.random() * this.#emptyCells.length)
    }

    addBomb() {
        const index = this.randomEmptyCellIndex()
        this.#cells[index].bomb = true
    }

    updateCells() {
        let N = GRID_SIZE * -1
        let E = 1
        let S = GRID_SIZE
        let W = -1

        let NE = N + 1
        let NW = N - 1
        let SE = S + 1
        let SW = S - 1
        let compass = [N, E, W, S, NE, NW, SE, SW]

        let done = true
        for (let i=0; i<this.#cells.length; i++) {
            const cell = this.#cells[i]
            if (cell.tile == null || cell.tile.value > 8) continue
            let adjacentCells = []
            for (let j=0; j<compass.length; j++) {
                adjacentCells.push(compass[j] + i)
            }
            if (cell.y == 0) {                  // Cell in top row
                adjacentCells = removeElements(adjacentCells, [N + i, NE + i, NW + i])
            }
            if (cell.x == 0) {                  // Cell is on left
                adjacentCells = removeElements(adjacentCells, [W + i, NW + i, SW + i])
            }
            if (cell.x+1 == GRID_SIZE) {         // Cell is on right
                adjacentCells = removeElements(adjacentCells, [E + i, NE + i, SE + i])
            }
            if (cell.y+1 == GRID_SIZE) {         // Cell is on bottom
                adjacentCells = removeElements(adjacentCells, [S + i, SE + i, SW + i])
            }
            let v = 0
            let b = 0
            for (let k=0; k<adjacentCells.length; k++) {
                if (this.#cells[adjacentCells[k]].bomb && this.#cells[adjacentCells[k]].tile == null) v++
                if (this.#cells[adjacentCells[k]].guess) b++
            }
            this.#cells[i].tile.value = v
            if (v > b) {
                this.#cells[i].tile.color = "blue"
                done = false
            }
            if (v == b) this.#cells[i].tile.color = "black"
            if (v < b) {
                this.#cells[i].tile.color = "red"
                done = false
            }
        }
        if (done) {
            alert("You win!")
        }
    }
}


class Cell {
	#cellElement
	#x
	#y
	#tile
    #click
    #bomb

	constructor(cellElement, x, y) {
		this.#cellElement = cellElement
		this.#x = x
		this.#y = y
        this.#click = 0
	}

	get x() {
		return this.#x
	}

	get y() {
		return this.#y
	}

	get tile() {
		return this.#tile
	}

    get guess() {
        return this.#click == 1 ? true : false
    }

    get bomb() {
        return this.#bomb
    }

    set bomb(value) {
        this.#bomb = value
    }

	set tile(value) {
		this.#tile = value
		if (value == null) return
		this.#tile.x = this.#x
		this.#tile.y = this.#y
	}

    click() {
        if (this.#tile != null) return
        this.#click++
        if (this.#click > 2) {
            this.#click = 0
            this.#cellElement.textContent = ""
        }
        if (this.#click == 1) this.#cellElement.textContent = "B"
        if (this.#click == 2) this.#cellElement.textContent = "X"
    }
}

function createCellElements(gridElement) {
	const cells = []
	for (let i=0; i<GRID_SIZE*GRID_SIZE; i++) {
		const cell = document.createElement("div")
		cell.classList.add("cell")
		cells.push(cell)
		gridElement.append(cell)
	}
	return cells
}

function removeElement(a, e) {          // Remove element e from array a
    const index = a.indexOf(e)
    if (index >= 0) a.splice(index, 1)
    return a
}

function removeElements(a, elements) {  // Remove multiple elements from array a
    for (let i=0; i<elements.length; i++) {
        a = removeElement(a, elements[i])
    }
    return a
}