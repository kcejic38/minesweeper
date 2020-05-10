class EventsHandler extends GameState {
  constructor(game) {
    super(game);
    this.setUpEventHandlers();
  }
  setUpEventHandlers() {
    this.gameRootElement.addEventListener('mouseup', this.cellClickReleased.bind(this));
    this.gameRootElement.addEventListener('mousedown', this.cellClickPressed.bind(this));
    this.gameRootElement.addEventListener('contextmenu', this.flagCell.bind(this));
    this.restartGameButton.addEventListener('click', (e) => location.reload());
    this.startSolversButton.addEventListener('click', this.setUpAutomaticSolver.bind(this));
  }

  cellClickReleased(event) {
    const clickedElement = event.target;
    if (event.button === MOUSE_BUTTON_CLICK.RIGHT || !clickedElement.classList.contains(CLASSES.CELL)) {
      return false;
    }
    clickedElement.classList.remove(CLASSES.CELL_PRESSED);
    const { row, col } = clickedElement.dataset;
    this.openDomCell(clickedElement, row, col);
  }

  cellClickPressed(event) {
    const clickedElement = event.target;
    if (event.button === MOUSE_BUTTON_CLICK.RIGHT || !clickedElement.classList.contains(CLASSES.CELL)) {
      return false;
    }

    clickedElement.classList.add(CLASSES.CELL_PRESSED);
  }

  flagCell(event) {
    const clickedElement = event.target;
    if (!clickedElement.classList.contains(CLASSES.CELL)) {
      return;
    }
    if (event.button === MOUSE_BUTTON_CLICK.RIGHT) {
      clickedElement.classList.toggle(CLASSES.FLAGGED);
      clickedElement.classList.toggle(CLASSES.HIDE_CELL_CONTENTS);
      event.preventDefault();
    }
  }

  setUpAutomaticSolver() {
    this.solversModal.classList.remove(CLASSES.HIDE);
    document.querySelector('.loader').classList.remove(CLASSES.HIDE);
    const NUMBER_OF_ATTEMPTS = 100000;
    const games = [];

    setTimeout(() => {
      for (let i = 0; i < NUMBER_OF_ATTEMPTS; i++) {
        games.push(new Minesweeper(10, 10));
      }

      new Solver(games, this.solverFinishedHandler.bind(this));
    }, 500);
  }

  solverFinishedHandler(numOfWins) {
    this.solversWinCounter.textContent = numOfWins.toLocaleString();
    document.querySelector('.loader').classList.add(CLASSES.HIDE);
    this.solversResults.classList.remove(CLASSES.HIDE);
    console.log('WINS: ', numOfWins);
  }
}
