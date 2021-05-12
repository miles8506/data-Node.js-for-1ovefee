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
  });
});

//register
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
    body.wishList = [];
    body.cart = [];
    userData.push(body);
    data = JSON.stringify(data);
    fs.writeFile('./data/login.json', data, (err) => {
      if (err) return console.log('err');
      //status為1代表註冊成功
      res.send('1');
    });
  });
});

//login
app.post('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const body = req.body;
  fs.readFile('./data/login.json', (err, data) => {
    if (err) return console.log('err');
    let userData = JSON.parse(data);
    const flag = userData[0].user.some(item => {
      return item.registerAccount == body.account && item.registerPsw == body.psw;
    })
    if (flag) {
      const user = userData[0].user.find(item => {
        if (item.registerAccount == body.account) return item;
      })
      const wish = user.wishList;
      const cart = user.cart;
      //status為1代表登入成功
      res.send({ status: "1", wish, cart });
    } else {
      //status為0代表登入失敗(並無此用戶)
      res.send('0');
    }
  })
});

//logout
app.get('/logout', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const cartList = req.query.cartList;
  if (cartList === undefined) return;
  const user = req.query.user;
  fs.readFile('./data/login.json', 'utf8', (err, res) => {
    if (err) return console.log('err');
    res = JSON.parse(res);
    let data = res[0].user;
    let userData = data.find(item => item.registerAccount == user);
    userData.cart = cartList;
    console.log(res);
    res = JSON.stringify(res);
    fs.writeFile('./data/login.json', res, (err) => {
      if (err) return console.log('err');
    });
  });
});

//wish_list
app.get('/wish', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const wishList = req.query.data.wishList;
  const account = req.query.data.account;
  if (wishList !== undefined) {
    fs.readFile('./data/login.json', 'utf8', (err, res) => {
      if (err) return console.log('err');
      let data = JSON.parse(res);
      const index = data[0].user.findIndex(item => item.registerAccount === account)
      data[0].user[index].wishList = wishList
      data = JSON.stringify(data);
      fs.writeFile('./data/login.json', data, (err) => {
        if (err) console.log(err);
      });
    });
  } else {
    fs.readFile('./data/login.json', 'utf8', (err, res) => {
      if (err) return console.log('err');
      let data = JSON.parse(res);
      const index = data[0].user.findIndex(item => item.registerAccount === account)
      data[0].user[index].wishList = [];
      data = JSON.stringify(data);
      fs.writeFile('./data/login.json', data, (err) => {
        if (err) console.log(err);
      });
    });
  };
  res.send('1');
});

//search
app.get('/search', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const query = req.query.data;
  fs.readFile('./data/data.json', 'utf8', (err, data) => {
    if (err) return console.log('err');
    const countData = [];
    data = JSON.parse(data)[1].count;
    const filterArray = data.filter(item => {
      if (item.goodsName.includes(query)) {
        return item;
      };
    });
    if (filterArray.length == 0) return;
    res.send(filterArray);
  });
});

app.get('/detail', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const iid = req.query.iid;
  const sort = req.query.sort;
  fs.readFile('./data/data.json', 'utf8', (err, data) => {
    if (err) return console.log('err');
    data = JSON.parse(data)[1].count;
    const findData = data.find(item => {
      return item.id == iid && item.sort == sort;
    });
    res.send(findData);
  })
})

app.get('/deletewish', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const query = req.query.data;
  const wishList = query.wishList;
  if (wishList === undefined) query.wishList = [];
  fs.readFile('./data/login.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
    const user = data[0].user.find(item => item.registerAccount == query.account);
    user.wishList = wishList;
    data = JSON.stringify(data);
    fs.writeFile('./data/login.json', data, (err) => {
      if (err) return console.log(err);
      res.send('1');
    });
  });
});


app.listen(3000, () => {
  console.log('running')
});