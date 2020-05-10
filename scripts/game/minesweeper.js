class GridCell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.value = CELL_CONTENTS.EMPTY;
    this.adjacentBombsCount = 0;
    this.fieldOpened = false;
    this.fieldIsFlagged = false;
  }
}

GridCell.prototype.incementBombCount = function () {
  this.adjacentBombsCount++;
};
GridCell.prototype.openField = function () {
  this.fieldOpened = true;
};
GridCell.prototype.flagAField = function () {
  this.fieldIsFlagged = true;
};
GridCell.prototype.isOpened = function () {
  return this.fieldOpened === true;
};
GridCell.prototype.isEmpty = function () {
  return this.value === CELL_CONTENTS.EMPTY;
};
GridCell.prototype.isBomb = function () {
  return this.value === CELL_CONTENTS.BOMB;
};
GridCell.prototype.isFlagged = function () {
  return this.fieldIsFlagged === true;
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
  gameOver = false;
  win = false;

  constructor(gridSize, numberOfMines) {
    this.gridSize = gridSize;
    this.numberOfMines = numberOfMines;
    this.numberOfSafeCells = gridSize * gridSize - numberOfMines;
    this.createGrid();
    this.randomlyPlaceMines();
  }

  createGrid() {
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

  randomlyPlaceMines() {
    let placedMinesCount = 0;

    while (placedMinesCount < this.numberOfMines) {
      let randomRow = Math.floor(Math.random() * this.gridSize);
      let randomCol = Math.floor(Math.random() * this.gridSize);

      if (this.grid[randomRow][randomCol].isEmpty()) {
        this.grid[randomRow][randomCol].value = CELL_CONTENTS.BOMB;
        placedMinesCount++;
        this.incrementNeighboringCellsBombCount(randomRow, randomCol);
      }
    }
  }

  incrementNeighboringCellsBombCount(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        let cell = this.grid[i] && this.grid[i][j] ? this.grid[i][j] : null;
        if (cell && cell.isEmpty()) {
          cell.incementBombCount();
        }
      }
    }
  }

  openCell(row, col, domHandlerCb) {
    domHandlerCb = domHandlerCb || function _() {};
    const { grid } = this;
    const cell = grid[row] ? grid[row][col] : undefined;
    if (!cell) return;

    if (cell.isBomb()) {
      this.gameOver = true;
      domHandlerCb(row, col, true);
      return;
    }

    if (cell.hasAdjacentBombs()) {
      cell.openField();
      this.numberOfVisitedCells++;
      domHandlerCb(row, col, true);
      return cell.adjacentBombsCount;
    }

    this.uncoverAllAdjacentBlankCells(row, col, domHandlerCb);
  }

  checkForWin() {
    const isGameWon = this.numberOfVisitedCells === this.numberOfSafeCells;
    this.win = isGameWon;
    return isGameWon;
  }

  openCellAtCoordinates(row, col) {
    const cell = this.grid[row][col];
    this.openCell(cell);
  }

  uncoverAllAdjacentBlankCells(row, col, domHandlerCb) {
    const { grid } = this;

    /* For performance reasons we want to perform
     * DFS on our in-memory grid, and not on DOM directly.
     * Once we land on empty cell, we update its corresponding
     * "twin" in the DOM, based on their shared
     * coordinates in this.domElementsGrid.
     */
    const DFS = (row, col) => {
      const cell = grid[row] ? grid[row][col] : undefined;
      if (!cell || cell.isOpened()) {
        return;
      }

      cell.openField();
      this.numberOfVisitedCells++;

      if (domHandlerCb) {
        domHandlerCb(row, col);
      }

      /*
       * stop once we land on an empty cell that has
       * bombs adjacent to it
       */
      if (cell.hasAdjacentBombs()) {
        return;
      }

      DFS(row - 1, col); // up
      DFS(row, col + 1); // right
      DFS(row + 1, col); // down
      DFS(row, col - 1); // left
    };
    DFS(Number(row), Number(col));
  }
}
