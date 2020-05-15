class GameState {
  game = null;
  domElementsGrid = null;
  gameRootElement = document.getElementById(IDS.MINESWEEPER_APP);
  minesBanner = document.getElementById(IDS.NUMBER_OF_MINES_BANNER);
  gameOverModal = document.getElementById(IDS.GAME_OVER_MODAL);
  solversModal = document.getElementById(IDS.SOLVERS_MODAL);
  gameOverStatusMessage = document.getElementById(IDS.GAME_OVER_STATUS);
  restartGameButton = document.getElementById(IDS.RESTART_GAME);
  startSolversButton = document.getElementById(IDS.START_SOLVERS);
  solversResults = document.getElementById(IDS.SOLVERS_RESULTS);
  solversWinCounter = document.getElementById(IDS.SOLVERS_WIN_COUNTER);

  constructor(game) {
    this.game = game;
    this.minesBanner.textContent = `Number of mines: ${game.numberOfMines}`;
  }

  openDomCell(clickedElement, row, col) {
    clickedElement = clickedElement || this.domElementsGrid[row][col];
    clickedElement.classList.remove(CLASSES.HIDE_CELL_CONTENTS);
    this.game.openCell(row, col, this.uncoverDomCellAtCoordinates.bind(this));

    if (this.game.checkForWin()) {
      this.gameOver(false);
    }
  }
  uncoverDomCellAtCoordinates(row, col, isBomb) {
    const clickedElement = this.domElementsGrid[row][col];
    if (isBomb) {
      clickedElement.classList.add(CLASSES.BOMB_EXPLODED);
      this.gameOver(true);
    }

    clickedElement.classList.remove(CLASSES.HIDE_CELL_CONTENTS);
  }

  uncoverAllAdjacentBlankCells(row, col) {
    /* For performance reasons we want to perform
     * DFS on our in-memory grid, and not on DOM directly.
     * Once we land on empty cell, we update its corresponding
     * "twin" in the DOM, based on their shared
     * coordinates in this.domElementsGrid.
     */

    this.game.uncoverAllAdjacentBlankCells(row, col, this.uncoverDomCellAtCoordinates.bind(this));
  }

  gameOver(steppedOnAMine) {
    debugger;
    if (steppedOnAMine) {
      this.gameOverStatusMessage.textContent = 'You stepped on a mine!';
    } else {
      this.gameOverStatusMessage.textContent = 'Nice work! You win!';
    }
    this.uncoverAllCellsOnGameOver();
    this.gameOverModal.classList.remove(CLASSES.HIDE);
  }

  uncoverAllCellsOnGameOver() {
    for (let row = 0; row < this.domElementsGrid.length; row++) {
      for (let col = 0; col < this.domElementsGrid[row].length; col++) {
        let domCell = this.domElementsGrid[row][col];
        domCell.classList.remove(CLASSES.HIDE_CELL_CONTENTS);
      }
    }
  }
}
