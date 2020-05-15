document.addEventListener('DOMContentLoaded', function (event) {
  mocha.setup({
    ui: 'bdd',
    bail: true,
  });
  mocha.run();
  runTests();
});
