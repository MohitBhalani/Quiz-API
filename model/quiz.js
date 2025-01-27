let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: { 
        type: String, 
        trim: true,
        required: [true, 'Title is required'] 
    },
    description: { 
        type: String,
        trim: true,
        required: [true, 'Description is required']
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CATEGORY',
        required : [true, 'Category is required']
    },
    questions: [
        {
            question: { type: String, trim : true , required: [true, 'Question Is required'] },
            options: [String],
            correctAnswer: { type: String, trim : true ,required: [true, 'Please enater Correct Answer'] },
        },
    ],
    // createdBy: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'USER', 
    //     required: true 
    // },
    // category: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'CATEGORY', 
    //     required: true 
    // },
}, { timestamps: true });

let QUIZ = mongoose.model('QUIZ_question', quizSchema);
module.exports = QUIZ;