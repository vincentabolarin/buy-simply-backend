const router = require('express').Router();
const { LogIn, LogOut } = require('../controllers/AuthControllers');

router.post('/login', LogIn);
router.post('/logout', LogOut);

module.exports = router;