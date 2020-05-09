class DomHandler {
  game = null;
  gameRootElement = document.getElementById('minesweeper-app');

  constructor(game) {
    this.game = game;
    this._addGridToDom();
    // this._setUpEventHandlers();
    console.log(this.game);
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

        if (cell.isEmpty()) {
          cellEl.classList.add(`${CLASSES.BOMB_COUNT}-${cell.adjacentBombsCount}`);
        } else {
          cellEl.classList.add(CLASSES.BOMB_EXPOSED);
        }
        rowEl.appendChild(cellEl);
      });
    });

    this.gameRootElement.appendChild(tableEl);
  }

  _setUpEventHandlers() {
    this.gameRootElement.addEventListener('mouseup', (event) => {
      const clickedElement = event.target;
      if (!clickedElement.classList.contains(CLASSES.CELL)) {
        return;
      }

      const { row, col } = clickedElement.dataset;
      const { grid } = this.game;

      if (grid[row][col] === CELL_CONTENTS.BOMB) {
        clickedElement.style.backgroundImage = `url(${icons.explodedBomb})`;
      } else if (grid[row][col] === CELL_CONTENTS.EMPTY) {
        clickedElement.style.backgroundImage = `url(${icons.bombs[0]})`;
        this._uncoverAllContinuousBlankCells(row, col);
      } else {
        clickedElement.style.backgroundImage = `url(${icons.blank})`;
      }
    });

    this.gameRootElement.addEventListener('mousedown', (event) => {
      const clickedElement = event.target;
      if (!clickedElement.classList.contains(CLASSES.CELL)) {
        return;
      }
      clickedElement.style.backgroundImage = `url(${icons.pressed})`;
    });
  }

  _uncoverAllContinuousBlankCells(row, col) {
    const { grid } = this.game;

    /* For performance reasons we want to perform
     * DFS on our in-memory grid, and not on DOM directly.
     * Once we land on empty cell, we update its corresponding
     * "twin" in the DOM, based on their shared coordinates.
     */
    const DFS = (row, col) => {
      console.log(row, col);
      const currentCell = grid[row] ? grid[row][col] : undefined;
      if (currentCell !== CELL_CONTENTS.EMPTY) {
        return;
      }
      grid[row][col] = CELL_CONTENTS.VISITED;
      const cellEl = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      cellEl.classList.add('opened');

      DFS(row - 1, col); // up
      DFS(row, col + 1); // right
      DFS(row + 1, col); // down
      DFS(row, col - 1); // left
    };
    // DFS(Number(row), Number(col));
  }
}
