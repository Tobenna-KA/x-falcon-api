let express = require('express');
let router = express.Router();
let auth = require('../app/auth/controllers')
/* GET users listing. */
router.get('/', auth.Auth.LOGIN);

module.exports = router;
