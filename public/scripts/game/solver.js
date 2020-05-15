class Solver {
  game = null;
  NUMBER_OF_ATTEMPTS = 100000; // 100,000
  currentAttemptNumber = 0;
  winsCount = 0;
  lossesCount = 0;
  constructor(gamesArray, solverFinishedCb) {
    this.gamesArray = gamesArray;
    for (let i = 0; i < gamesArray.length; i++) {
      this.game = gamesArray[i];
      this.beginGame();
    }
    this.winsCount = this.NUMBER_OF_ATTEMPTS - this.lossesCount;
    solverFinishedCb(this.winsCount);
  }

  beginGame() {
    const row = 0;
    const col = 0;
    this.currentAttemptNumber++;
    this.makeNextClick(row, col);
  }

  makeNextClick(row, col) {
    if (this.game.gameOver) {
      this.lossesCount++;
      this.game = new Minesweeper(10, 10);
      return;
    }

    const currentCell = this.game.grid[row] ? this.game.grid[row][col] : null;

    if (!currentCell || currentCell.isOpened()) return;

    if (currentCell.adjacentBombsCount > 1) {
      this.handleCellsWithAdjacentBombs(row, col);
      return;
    }

    this.game.openCell(row, col);
    const [nextAvailableRow, nextAvailableCol] = this.findNextUnopenedCell();
    return this.makeNextClick(nextAvailableRow, nextAvailableCol);
  }

  handleCellsWithAdjacentBombs(row, col) {
    const currentCell = this.game.grid[row] ? this.game.grid[row][col] : null;

    let unvisitedNeighborsCount = 0;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i !== row && j !== col) {
          let cell = this.game.grid[i] ? this.game.grid[i][j] : null;
          if (cell && !cell.isOpened()) {
            unvisitedNeighborsCount++;
          }
        }
      }
    }

    if (currentCell.adjacentBombsCount === 1 && unvisitedNeighborsCount === 1) {
      this.flagCellAsBomb(row, col);
      this.uncoverAllNeighbors(row, col);
    }
  }

  uncoverAllNeighbors(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i !== row && j !== col) {
          let cell = this.game.grid[i] ? this.game.grid[i][j] : null;
          if (cell) {
            this.game.openCell(i, j);
          }
        }
      }
    }
  }
  flagCellAsBomb(row, col) {
    const currentCell = this.game.grid[row] ? this.game.grid[row][col] : null;
    currentCell && currentCell.flagAField();
  }

  findNextUnopenedCell() {
    for (let row = 0; row < this.game.grid.length; row++) {
      for (let col = 0; col < this.game.grid[row].length; col++) {
        let cell = this.game.grid[row][col];
        if (!cell.isOpened()) {
          return [row, col];
        }
      }
    }
  }

  checkGameOver() {
    if (this.game.win) {
      alert('game over!');
      return;
    }
  }
}

/* 

*/
