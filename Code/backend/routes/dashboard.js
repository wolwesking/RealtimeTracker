const express = require('express');
const router = express.Router();
const view = require('../modules/userCounter')

/* GET home page. */
/*
  Panels:
  - log of activities
  - top list of different UTM
  - number of users count
*/
router.get('/', function(req, res, next) {
  const initData = 
  {
    userCount: view.getCounter(),

  }
  res.render('index', { title: 'Express', data: initData }); 
});

router.post('/', )

module.exports = router;
