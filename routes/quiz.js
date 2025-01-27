var express = require('express');
var router = express.Router();

let quizController = require('../controller/quiz');
let adminController = require('../controller/user');

/* GET home page. */
router.post('/create',adminController.Secure, quizController.Create);

router.get('/read',quizController.Read);

router.put('/update/:id', adminController.Secure ,quizController.Update);

router.post('/addQuestion/:id', adminController.Secure ,quizController.AddQuestion);

router.delete('/deleteQuiz/:id', adminController.Secure ,quizController.DeleteQuiz);

router.delete('/deleteQuestion/:id', adminController.Secure ,quizController.DeleteQuestion);

router.get('/PlayQuiz/:id', quizController.PlayQuiz);

router.post('/submitQuiz/:id', quizController.SubmitQuiz);

module.exports = router;
