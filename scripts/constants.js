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
};

const CELL_CONTENTS = {
  BOMB: 1,
  EMPTY: 0,
  VISITED: 9,
};

const MOUSE_BUTTON_CLICK = {
  LEFT: 0,
  WHEEL_MIDDLE: 1,
  RIGHT: 2,
};
