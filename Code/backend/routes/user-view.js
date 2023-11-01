var express = require('express');
var router = express.Router();

/* GET home page. */
// TODO, do the user
router.get('/', function(req, res, next) {
  res.send('User view page') // REMOVE ONLY DEV
});

router.post('/', function(req, res, next) {
  const data = req.body;
});

module.exports = router;
