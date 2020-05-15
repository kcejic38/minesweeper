const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/tests', function (req, res) {
  res.sendFile(path.join(__dirname, './tests.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Minesweeper app listening on port ' + port + '!');
});
