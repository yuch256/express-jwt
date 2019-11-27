const express = require('express');
const router = express.Router();
const url = require('url');
const jwt = require('jsonwebtoken');
const decrypt = require('../utils/crypto').decrypt;
const render = require('../utils/render').signinRender;
const secret = require('../utils/config').secrept_jwt;

/* GET signin page. */
router.get('/', (req, res) => {
  render.get(res)
});

router.get('/verify', async (req, res) => {
  let { email, pwd } = url.parse(req.url, true).query;
  console.log(JSON.stringify(url.parse(req.url, true).query))

  // 用户查询
  const User = require('../models/user');
  const doc = await User.findOne({ email });
  console.log('doc:' + doc)

  // 登录检测
  if (doc) {
    const r = await decrypt(pwd, doc.salt);
    console.log('r:' + r)
    if (r !== doc.pwd) render.err(res, '密码错误！')
    else {
      const t = jwt.sign({ email, pwd: r }, secret, { expiresIn: 60 })
      console.log('token:' + t)
      res.send({ result: 1, msg: '登录成功', token: t })
    }
  } else {
    res.send({ result: 0, msg: '用户不存在！' })
  }
});

module.exports = router;
