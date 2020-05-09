const CLASSES = {
  CELL: 'minesweeper-cell',
  ROW: 'minesweeper-row',
  GRID: 'minesweeper-grid',
  BOMB_EXPOSED: 'bomb-exposed',
  BOMB_EXPLODED: 'bomb-exposed',
  BOMB_COUNT: 'bomb-count',
  OPENED_BLANK_CELL: 'opened-blank-cell',
  CELL_PRESSED: 'cell-pressed',
};

const CELL_CONTENTS = {
  BOMB: 1,
  EMPTY: 0,
  VISITED: 9,
};

document.addEventListener('DOMContentLoaded', function (event) {
  const game = new Minesweeper(10, 10);
  const domHandler = new DomHandler(game);
});
