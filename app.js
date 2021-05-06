const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/node_modules/')));
app.use(express.static(path.join(__dirname, '/data/')));

//data
app.get('/hot/clothes', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.readFile('./data/data.json', (err, data) => {
    res.send(data);
  })
})

//login adduser
app.post('/register', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const body = req.body;
  fs.readFile('./data/login.json', 'utf8', (err, data) => {
    if (err) return console.log('err');
    data = JSON.parse(data);
    let userData = data[0].user;
    //判斷json內是否有data
    if (userData.length !== 0) {
      const flag = userData.some(item => {
        return item.registerAccount == body.registerAccount;
      })
      if (flag) {
        //status為0代表帳號已被註冊
        res.send('0');
        return;
      };
    };
    userData.push(body);
    data = JSON.stringify(data);
    fs.writeFile('./data/login.json', data, (err) => {
      if (err) return console.log('err');
      //status為1代表註冊成功
      res.send('1')
    })
  })

})

app.listen(3000, () => {
  console.log('running')
});