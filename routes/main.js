const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../views/index.ejs'), {
    title: 'Bem-vindo(a) à API!'
  });
});

module.exports = router;
