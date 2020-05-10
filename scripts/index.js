document.addEventListener('DOMContentLoaded', function (event) {
  const game = new Minesweeper(10, 10);
  const domSetup = new DomSetup(game);
});
