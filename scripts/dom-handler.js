class DomHandler {
  game = null;
  gameRootElement = document.getElementById('minesweeper-app');
  minesBanner = document.getElementById('number-of-mines-banner');
  gameOverModal = document.getElementById('game-over-modal');
  gameOverStatusMessage = document.getElementById('game-over-status');
  restartGameButton = document.getElementById('restart-game');

  constructor(game) {
    this.game = game;
    this.minesBanner.textContent = `Number of mines: ${this.game.numberOfMines}`;
    this._addGridToDom();
    this._setUpEventHandlers();
    console.log(this.game);
  }

  __exposeBombsForTestingPurposes(cell, cellEl) {
    if (cell.isBomb()) {
      cellEl.classList.add(CLASSES.BOMB_EXPLODED);
    }
  }

  _gameOver(steppedOnAMine) {
    if (steppedOnAMine) {
      this.gameOverStatusMessage.textContent = 'You stepped on a mine!';
    } else {
      this.gameOverStatusMessage.textContent = 'Nice work! You win!';
    }
    this.gameOverModal.classList.remove(CLASSES.HIDE);
  }

  _addGridToDom() {
    const tableEl = document.createElement('table');
    tableEl.className = CLASSES.GRID;

    this.game.grid.forEach((row, rowIndex) => {
      const rowEl = document.createElement('tr');
      rowEl.className = CLASSES.ROW;
      tableEl.appendChild(rowEl);

      row.forEach((cell, colIndex) => {
        const cellEl = document.createElement('td');
        cellEl.className = CLASSES.CELL;
        cellEl.setAttribute('data-row', rowIndex);
        cellEl.setAttribute('data-col', colIndex);
        // this.__exposeBombsForTestingPurposes(cell, cellEl);
        rowEl.appendChild(cellEl);
      });
    });

    this.gameRootElement.appendChild(tableEl);
  }

  _openCellWithABomb(clickedElement, cell) {
    clickedElement.classList.add(CLASSES.BOMB_EXPLODED);
    this._openACell(cell);
    this._gameOver(true);
  }
  _openCellsWithAdjacentBombs(clickedElement, cell) {
    clickedElement.classList.add(`${CLASSES.BOMB_COUNT}-${cell.adjacentBombsCount}`);
    this._openACell(cell);
  }
  _openBlankCellsWithoutAdjacentBombs(clickedElement, row, col) {
    clickedElement.classList.add(CLASSES.OPENED_BLANK_CELL);
    this._uncoverAllAdjacentBlankCells(row, col);
  }

  _openACell(cell) {
    this.game.openCell(cell);
    if (this.game.checkForWin()) {
      this._gameOver(false);
    }
  }

  _cellClickPressed(event) {
    const clickedElement = event.target;
    if (!clickedElement.classList.contains(CLASSES.CELL)) {
      return;
    }
    clickedElement.classList.add(CLASSES.CELL_PRESSED);
  }
  _cellClickReleased(event) {
    const clickedElement = event.target;
    if (!clickedElement.classList.contains(CLASSES.CELL)) {
      return;
    }
    clickedElement.classList.remove(CLASSES.CELL_PRESSED);
    const { row, col } = clickedElement.dataset;
    const { grid } = this.game;
    const cell = grid[row][col];

    if (cell.isBomb()) {
      this._openCellWithABomb(clickedElement, cell);
    } else if (!cell.hasAdjacentBombs() && !cell.isBomb()) {
      this._openBlankCellsWithoutAdjacentBombs(clickedElement, row, col);
    } else if (cell.hasAdjacentBombs()) {
      this._openCellsWithAdjacentBombs(clickedElement, cell);
    }
  }

  _setUpEventHandlers() {
    this.gameRootElement.addEventListener('mouseup', this._cellClickReleased.bind(this));
    this.gameRootElement.addEventListener('mousedown', this._cellClickPressed.bind(this));
    this.restartGameButton.addEventListener('click', (e) => location.reload());
  }

  _uncoverAllAdjacentBlankCells(row, col) {
    const { grid } = this.game;

    /* For performance reasons we want to perform
     * DFS on our in-memory grid, and not on DOM directly.
     * Once we land on empty cell, we update its corresponding
     * "twin" in the DOM, based on their shared coordinates.
     */
    const DFS = (row, col) => {
      console.log(row, col);
      const cell = grid[row] ? grid[row][col] : undefined;
      if (!cell || cell.isVisited()) {
        return;
      }

      const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

      if (cell.hasAdjacentBombs()) {
        this._openCellsWithAdjacentBombs(cellElement, cell);
        return;
      }

      this._openACell(cell);

      cellElement.classList.add(CLASSES.OPENED_BLANK_CELL);

      DFS(row - 1, col); // up
      DFS(row, col + 1); // right
      DFS(row + 1, col); // down
      DFS(row, col - 1); // left
    };
    DFS(Number(row), Number(col));
  }
}
