const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.static(path.join(__dirname, '/node_modules/')));
app.use(express.static(path.join(__dirname, '/data/')));
app.get('/hot/clothes', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.readFile('./data/data.json', (err, data) => {
    res.send(data);
  })
})
app.listen(3000, () => {
  console.log('running')
});