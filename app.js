const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Sucessful response');
});

module.exports = app;
