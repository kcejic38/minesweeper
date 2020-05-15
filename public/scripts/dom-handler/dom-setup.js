class DomSetup extends EventsHandler {
  constructor(game) {
    super(game);
    this.setUpGrid();
    this.populateDom();
  }
  setUpGrid() {
    /* Sets up a grid that will miror the game grid
     * except it will contain the actual dom elements
     * so we don't have to query for them each time
     * we want to change their visual representation.
     */
    const { gridSize } = this.game;
    this.domElementsGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  }

  populateDom() {
    const { grid } = this.game;
    const tableEl = document.createElement('table');
    tableEl.className = CLASSES.GRID;

    for (let row = 0; row < grid.length; row++) {
      const tr = this.createDomRow();
      tableEl.appendChild(tr);

      for (let col = 0; col < grid[row].length; col++) {
        const td = this.createDomCell(row, col);
        tr.appendChild(td);
        this.domElementsGrid[row][col] = td;
      }
    }
    this.gameRootElement.appendChild(tableEl);
  }

  createDomCell(row, col) {
    const cell = this.game.grid[row][col];
    const td = document.createElement('td');
    td.classList.add(CLASSES.CELL, CLASSES.HIDE_CELL_CONTENTS);
    td.setAttribute('data-row', row);
    td.setAttribute('data-col', col);

    if (cell.isBomb()) {
      td.classList.add(CLASSES.BOMB_EXPOSED);
    } else if (cell.hasAdjacentBombs()) {
      td.classList.add(`${CLASSES.BOMB_COUNT}-${cell.adjacentBombsCount}`);
    } else if (cell.isEmpty()) {
      td.classList.add(CLASSES.OPENED_BLANK_CELL);
    }
    return td;
  }

  createDomRow() {
    const tr = document.createElement('tr');
    tr.className = CLASSES.ROW;
    return tr;
  }
}
