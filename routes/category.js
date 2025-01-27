var express = require('express');
var router = express.Router();
let categoryController = require('../controller/category');





/* GET home page. */
router.get('/read', categoryController.readCategory);

router.post('/creat', categoryController.createCategory);

router.patch('/update/:id', categoryController.updateCategory);

router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
