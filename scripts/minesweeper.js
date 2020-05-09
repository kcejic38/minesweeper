class GridCell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.value = CELL_CONTENTS.EMPTY;
    this.adjacentBombsCount = 0;
    this.fieldOpened = false;
  }
}

GridCell.prototype.incementBombCount = function () {
  this.adjacentBombsCount++;
};

GridCell.prototype.opened = function () {
  this.fieldOpened = true;
};
GridCell.prototype.isVisited = function () {
  return this.fieldOpened === true;
};

GridCell.prototype.isEmpty = function () {
  return this.value === CELL_CONTENTS.EMPTY;
};
GridCell.prototype.isBomb = function () {
  return this.value === CELL_CONTENTS.BOMB;
};
GridCell.prototype.hasAdjacentBombs = function () {
  return this.adjacentBombsCount > 0;
};

class Minesweeper {
  gridSize = 0;
  numberOfMines = 0;
  numberOfSafeCells = 0;
  numberOfVisitedCells = 0;
  grid = null;

  constructor(gridSize, numberOfMines) {
    this.gridSize = gridSize;
    this.numberOfMines = numberOfMines;
    this.numberOfSafeCells = gridSize * gridSize - numberOfMines;
    this._createGrid();
    this._randomlyPlaceMines();
  }

  _createGrid() {
    const grid = [];
    for (let row = 0; row < this.gridSize; row++) {
      let gridRow = [];
      for (let col = 0; col < this.gridSize; col++) {
        gridRow.push(new GridCell(row, col));
      }
      grid.push(gridRow);
    }
    this.grid = grid;
  }

  _randomlyPlaceMines() {
    let placedMinesCount = 0;

    while (placedMinesCount < this.numberOfMines) {
      let randomRow = Math.floor(Math.random() * this.gridSize);
      let randomCol = Math.floor(Math.random() * this.gridSize);

      if (this.grid[randomRow][randomCol].isEmpty()) {
        this.grid[randomRow][randomCol].value = CELL_CONTENTS.BOMB;
        placedMinesCount++;
        this._incrementNeighboringCellsBombCount(randomRow, randomCol);
      }
    }
  }

  _incrementNeighboringCellsBombCount(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        let cell = this.grid[i] && this.grid[i][j] ? this.grid[i][j] : null;
        if (cell && cell.isEmpty()) {
          cell.incementBombCount();
        }
      }
    }
  }

  openCell(cell) {
    cell.opened();
    this.numberOfVisitedCells++;
  }
  checkForWin() {
    return this.numberOfVisitedCells === this.numberOfSafeCells;
  }
}
