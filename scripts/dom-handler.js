class DomHandler {
  game = null;
  domElementsGrid = null;
  gameRootElement = document.getElementById('minesweeper-app');
  minesBanner = document.getElementById('number-of-mines-banner');
  gameOverModal = document.getElementById('game-over-modal');
  gameOverStatusMessage = document.getElementById('game-over-status');
  restartGameButton = document.getElementById('restart-game');

  constructor(game) {
    this.game = game;
    this.minesBanner.textContent = `Number of mines: ${game.numberOfMines}`;
    this._setUpDomElementsGrid();
    this._addGridToDom();
    this._setUpEventHandlers();
  }
  _setUpDomElementsGrid() {
    /* Sets up a grid that will miror the game grid
     * except it will contain the actual dom elements
     * so we don't have to query for them each time
     * we want to change their visual representation.
     */
    const { gridSize } = this.game;
    this.domElementsGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
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
    this._uncoverAllCellsOnGameOver();
    this.gameOverModal.classList.remove(CLASSES.HIDE);
  }
  _uncoverAllCellsOnGameOver() {
    for (let row = 0; row < this.domElementsGrid.length; row++) {
      for (let col = 0; col < this.domElementsGrid[row].length; col++) {
        let domCell = this.domElementsGrid[row][col];
        let inMemoryCell = this.game.grid[row][col];
        if (inMemoryCell.isBomb()) {
          domCell.classList.add(CLASSES.BOMB_EXPOSED);
        } else if (!inMemoryCell.hasAdjacentBombs() && !inMemoryCell.isBomb()) {
          domCell.classList.add(CLASSES.OPENED_BLANK_CELL);
        } else if (inMemoryCell.hasAdjacentBombs()) {
          domCell.classList.add(`${CLASSES.BOMB_COUNT}-${inMemoryCell.adjacentBombsCount}`);
        }
      }
    }
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
        this.domElementsGrid[rowIndex][colIndex] = cellEl;
        rowEl.appendChild(cellEl);
        this.__exposeBombsForTestingPurposes(cell, cellEl);
      });
    });

    this.gameRootElement.appendChild(tableEl);
  }

  _openCellWithABomb(clickedElement, cell) {
    clickedElement.classList.add(CLASSES.BOMB_EXPLODED);
    this._openInMemoryCell(cell);
    this._gameOver(true);
  }
  _openCellsWithAdjacentBombs(clickedElement, cell) {
    clickedElement.classList.add(`${CLASSES.BOMB_COUNT}-${cell.adjacentBombsCount}`);
    this._openInMemoryCell(cell);
  }
  _openBlankCellsWithoutAdjacentBombs(clickedElement, row, col) {
    clickedElement.classList.add(CLASSES.OPENED_BLANK_CELL);
    this._uncoverAllAdjacentBlankCells(row, col);
  }

  _openInMemoryCell(cell) {
    this.game.openCell(cell);
    if (this.game.checkForWin()) {
      this._gameOver(false);
    }
  }

  _openDomCell(clickedElement, cell, row, col) {
    if (cell.isBomb()) {
      this._openCellWithABomb(clickedElement, cell);
    } else if (!cell.hasAdjacentBombs() && !cell.isBomb()) {
      this._openBlankCellsWithoutAdjacentBombs(clickedElement, row, col);
    } else if (cell.hasAdjacentBombs()) {
      this._openCellsWithAdjacentBombs(clickedElement, cell);
    }
  }

  _cellClickPressed(event) {
    const clickedElement = event.target;
    if (event.button === MOUSE_BUTTON_CLICK.RIGHT || !clickedElement.classList.contains(CLASSES.CELL)) {
      return false;
    }

    clickedElement.classList.add(CLASSES.CELL_PRESSED);
  }
  _cellClickReleased(event) {
    const clickedElement = event.target;

    if (event.button === MOUSE_BUTTON_CLICK.RIGHT || !clickedElement.classList.contains(CLASSES.CELL)) {
      return false;
    }
    clickedElement.classList.remove(CLASSES.CELL_PRESSED);
    const { row, col } = clickedElement.dataset;
    const { grid } = this.game;
    const cell = grid[row][col];
    this._openDomCell(clickedElement, cell, row, col);
  }
  _flaggCell(event) {
    event.preventDefault();
    const clickedElement = event.target;
    if (!clickedElement.classList.contains(CLASSES.CELL)) {
      return false;
    }
    if (event.button === MOUSE_BUTTON_CLICK.RIGHT) {
      clickedElement.classList.toggle(CLASSES.FLAGGED);
    }
    return false;
  }

  _setUpEventHandlers() {
    this.gameRootElement.addEventListener('mouseup', this._cellClickReleased.bind(this));
    this.gameRootElement.addEventListener('mousedown', this._cellClickPressed.bind(this));
    this.gameRootElement.addEventListener('contextmenu', this._flaggCell.bind(this));
    this.restartGameButton.addEventListener('click', (e) => location.reload());
  }

  _uncoverAllAdjacentBlankCells(row, col) {
    const { grid } = this.game;

    /* For performance reasons we want to perform
     * DFS on our in-memory grid, and not on DOM directly.
     * Once we land on empty cell, we update its corresponding
     * "twin" in the DOM, based on their shared in this.domElementsGrid.
     */
    const DFS = (row, col) => {
      debugger;
      console.log(row, col);
      const cell = grid[row] ? grid[row][col] : undefined;
      if (!cell || cell.isVisited()) {
        return;
      }

      const cellElement = this.domElementsGrid[row][col];

      if (cell.hasAdjacentBombs()) {
        this._openCellsWithAdjacentBombs(cellElement, cell);
        return;
      }

      this._openInMemoryCell(cell);

      cellElement.classList.add(CLASSES.OPENED_BLANK_CELL);

      DFS(row - 1, col); // up
      DFS(row, col + 1); // right
      DFS(row + 1, col); // down
      DFS(row, col - 1); // left
    };
    DFS(Number(row), Number(col));
  }
}
