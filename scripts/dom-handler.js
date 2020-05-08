const CLASSES = {
  CELL: 'minesweeper-cell',
  ROW: 'minesweeper-row',
  GRID: 'minesweeper-grid',
};

class DomHandler {
  game = null;
  gameRootElement = document.getElementById('minesweeper-app');

  constructor(game) {
    this.game = game;
    this._addGridToDom();
    this._setUpEventHandler();
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

  _setUpEventHandler() {
    this.gameRootElement.addEventListener('click', (event) => {
      if (!event.target.classList.contains(CLASSES.CELL)) {
        return;
      }

      console.log('clicked on a cell!');
    });
  }
}
