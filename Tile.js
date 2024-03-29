export default class Tile {
    #tileElement
    #x
    #y
    #value

    constructor(tileContainer, value = 0) {
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add("tile")
        tileContainer.append(this.#tileElement)
        this.value = value
    }

    get tileElement() {
        return this.#tileElement
    }

    get value() {
        return this.#value
    }

    set value(v) {
        this.#value = v
        this.#tileElement.textContent = v
    }

    set x(value) {
        this.#x = value
        this.#tileElement.style.setProperty("--x", value)
    }

    set y(value) {
        this.#y = value
        this.#tileElement.style.setProperty("--y", value)
    }

    set color(color) {
        this.#tileElement.style.setProperty("color", color)
    }

    remove() {
        this.#tileElement.remove()
    }
}