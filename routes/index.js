var express = require('express');
var router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(rootDir,'views','homepage.html'));
});

module.exports = router;
