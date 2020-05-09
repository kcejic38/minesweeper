function runTests() {
  const { expect } = chai;
  let game;
  describe('Minesweeper functionality', function () {
    beforeEach(function () {
      game = new Minesweeper(10, 10);
    });

    it('Should have a default "gridSize" property of 10', function () {
      expect(game.gridSize).to.equal(10);
    });
    it('Should have a 2D array size 10 x 10', function () {
      let numOfRows = 0;
      let numOfCols = 0;

      for (let i = 0; i < game.grid.length; i++) {
        numOfRows++;
      }
      for (let j = 0; j < game.grid[0].length; j++) {
        numOfCols++;
      }
      expect(numOfRows).to.equal(10);
      expect(numOfCols).to.equal(10);
    });
    it('Grid should contain cells with row, col, value, and adjacentBombsCount properties', function () {
      let someRandomCell = game.grid[3][5];

      expect(someRandomCell).to.have.property('row');
      expect(someRandomCell).to.have.property('col');
      expect(someRandomCell).to.have.property('value');
      expect(someRandomCell).to.have.property('adjacentBombsCount');
      expect(someRandomCell).to.not.have.property('random-non-existend-prop');
    });
  });
}
