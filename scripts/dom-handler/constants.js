const CLASSES = {
  CELL: 'minesweeper-cell',
  ROW: 'minesweeper-row',
  GRID: 'minesweeper-grid',
  FLAGGED: 'flagged',
  BOMB_EXPOSED: 'bomb-exposed',
  BOMB_EXPLODED: 'bomb-exploded',
  BOMB_COUNT: 'bomb-count',
  OPENED_BLANK_CELL: 'opened-blank-cell',
  CELL_PRESSED: 'cell-pressed',
  HIDE: 'hide',
  HIDE_CELL_CONTENTS: 'hide-cell-contents',
  MODAL: 'modal',
};

const IDS = {
  MINESWEEPER_APP: 'minesweeper-app',
  NUMBER_OF_MINES_BANNER: 'number-of-mines-banner',
  GAME_OVER_MODAL: 'game-over-modal',
  SOLVERS_MODAL: 'solvers-modal',
  GAME_OVER_STATUS: 'game-over-status',
  RESTART_GAME: 'restart-game',
  START_SOLVERS: 'start-solvers',
  SOLVERS_RESULTS: 'solvers-results',
  SOLVERS_WIN_COUNTER: 'solvers-wins-counter',
};

const CELL_CONTENTS = {
  BOMB: 1,
  EMPTY: 0,
  FLAG: 8,
  VISITED: 9,
};

const MOUSE_BUTTON_CLICK = {
  LEFT: 0,
  WHEEL_MIDDLE: 1,
  RIGHT: 2,
};
