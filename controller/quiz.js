let QUIZ = require('../model/quiz');
let CATEGORY = require('../model/category');


exports.Read = async (req, res) => {
    try {
        let findQuiz;
        if (req.query.search) {

            const category = await CATEGORY.find({ 
                name: { $regex: req.query.search, $options: 'i' } 
            });

            const categoryId = category.map(cat => cat._id);

            findQuiz = await QUIZ.find({ 
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { category: { $in: categoryId } }
                ] 
            }).populate('category');
        } else {
            findQuiz = await QUIZ.find().populate('category');
        }

        res.status(200).json({
            status: "Success",
            message: "Quiz Read Successfully",
            findQuiz
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}


exports.Create = async (req, res) => {
    try {
        let { title, description, questions, category } = req.body;

        if (!title || !description || !questions || questions.length === 0 || !category) {
            return res.status(400).json({
                status: "Failed",
                message: "All fields are required, and questions must be provided"
            });
        }

        // Create a new quiz object
        const data = await QUIZ.create({
            title,
            description,
            questions,
            category
        });

        res.status(201).json({
            status: "Success",
            message: "Quiz created successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}


exports.Update = async (req, res) => {
    try {

        let quizId = req.params.id;
        // console.log(quizId);

        let quiz = await QUIZ.findById(quizId)
        if (!quiz) throw new Error("Quiz not found");

        let { questionId, updateQuestion } = req.body;
        if (!questionId || !updateQuestion) throw new Error("Question ID and update question must be provided");

        let questionIndex = quiz.questions.findIndex(question => question._id.toString() === questionId);

        if (questionIndex !== -1) {
            quiz.questions[questionIndex] = updateQuestion;
        } else {
            throw new Error("Question not found");
        }

        let data = await quiz.save();


        res.status(200).json({
            status: "Success",
            message: "Quiz updated successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }

}


exports.AddQuestion = async (req, res) => {
    try {
        let quizId = req.params.id;

        let quiz = await QUIZ.findById(quizId);
        if (!quiz) throw new Error("Quiz not found");

        let { newQuestion } = req.body;
        if (!newQuestion) throw new Error("New question must be provided");

        if (!newQuestion.question || !newQuestion.question.length === 0 || !newQuestion.options || newQuestion.options.length === 0 || !newQuestion.correctAnswer || !newQuestion.correctAnswer.length === 0) throw new Error("Question, options and correct answer must be provided");

        quiz.questions.push(newQuestion);

        let data = await quiz.save();

        res.status(200).json({
            status: "Success",
            message: "Question added successfully",
            data
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}


exports.DeleteQuiz = async (req, res) => {
    try {

        let findData = await QUIZ.findById(req.params.id);
        if (!findData) throw new Error("Data is not found");

        let data = await QUIZ.findByIdAndDelete(req.params.id);


        res.status(200).json({
            status: "Success",
            message: "Quiz deleted successfully",
            data
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}


exports.DeleteQuestion = async (req, res) => {
    try {
        let quizId = req.params.id;

        let quiz = await QUIZ.findById(quizId);
        if (!quiz) throw new Error("Quiz not found");

        let { questionId } = req.body;
        if (!questionId) throw new Error("Question ID must be provided");

        let questionIndex = quiz.questions.findIndex(question => question._id.toString() === questionId);

        if (questionIndex !== -1) {
            quiz.questions.splice(questionIndex, 1);
        } else {
            throw new Error("Question not found");
        }

        let data = await quiz.save();

        res.status(200).json({
            status: "Success",
            message: "Question deleted successfully",
            data
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}


exports.PlayQuiz = async (req, res) => {
    try {
        let quizId = req.params.id;

        let quiz = await QUIZ.findById(quizId);
        if (!quiz) throw new Error("Quiz not found");

        if (quiz.questions.length === 0) throw new Error("No questions found");

        // Shuffle the questions array
        const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);

        // Include the correctAnswer field in each question
        // const questionsWithAnswers = shuffledQuestions.map(question => question.toObject());

        res.status(200).json({
            status: "Success",
            message: "Quiz played successfully",
            data: shuffledQuestions
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}



exports.SubmitQuiz = async (req, res) => {
    try {
        let quizId = req.params.id;
        let userAnswers = req.body.answers

        let quiz = await QUIZ.findById(quizId);
        if (!quiz) throw new Error("Quiz not found");

        if (quiz.questions.length === 0) throw new Error("No questions found");

        let score = 0;

        userAnswers.forEach(userAnswer => {
            let question = quiz.questions.find(ans => ans._id.toString() === userAnswer.questionId)
            if (question && question.correctAnswer === userAnswer.answer) {
                score++;
            }
        })

        res.status(200).json({
            status: "Success",
            message: "Quiz Submit successfully",
            score,
            totalQuestions: quiz.questions.length
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
}