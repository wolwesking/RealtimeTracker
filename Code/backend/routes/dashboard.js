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
  res.render('index', { title: 'Express' }); 
});

router.post('/', )

module.exports = router;
