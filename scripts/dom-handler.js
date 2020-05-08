const CLASSES = {
  CELL: 'minesweeper-cell',
  ROW: 'minesweeper-row',
  GRID: 'minesweeper-grid',
};

const CELL_CONTENTS = {
  BOMB: 1,
  EMPTY: 0,
  VISITED: 9,
};

class DomHandler {
  game = null;
  gameRootElement = document.getElementById('minesweeper-app');

  constructor(game) {
    this.game = game;
    this._addGridToDom();
    this._setUpEventHandlers();
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
        this._uncoverAllContinuesBlankCells(row, col);
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

    const DFS = (row, col) => {
      console.log(row, col);
      const currentCell = grid[row] ? grid[row][col] : undefined;
      if (currentCell === CELL_CONTENTS.EMPTY) {
        grid[row][col] = CELL_CONTENTS.VISITED;
        const cellEl = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cellEl.classList.add('opened');

        DFS(row - 1, col); // up
        DFS(row, col + 1); // right
        DFS(row + 1, col); // down
        DFS(row, col - 1); // left
      }
    };
    DFS(Number(row), Number(col));
  }
}
