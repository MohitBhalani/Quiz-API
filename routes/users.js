var express = require('express');
var router = express.Router();

let userController = require('../controller/user');

/* GET users listing. */
router.get('/read',userController.Secure ,userController.read);

router.post('/signup', userController.Signup); 

router.post('/login',userController.Login);

router.patch('/update/:id',userController.update);

router.delete('/delete/:id', userController.Secure,  userController.isAdmin ,userController.delete);

module.exports = router;
