class Minesweeper {
  gridSize = 0;
  numberOfMines = 0;
  grid = null;

  constructor(gridSize, numberOfMines) {
    this.gridSize = gridSize;
    this.numberOfMines = numberOfMines;
    this._createGrid();
    this._randomlyPlaceMines();
  }

  _createGrid() {
    this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(0));
  }

  _randomlyPlaceMines() {
    let placedMinesCount = 0;

    while (placedMinesCount < this.numberOfMines) {
      let randomRow = Math.floor(Math.random() * this.gridSize);
      let randomCol = Math.floor(Math.random() * this.gridSize);

      if (this.grid[randomRow][randomCol] === 0) {
        this.grid[randomRow][randomCol] = 1;
        placedMinesCount++;
      }
    }
  }
}
