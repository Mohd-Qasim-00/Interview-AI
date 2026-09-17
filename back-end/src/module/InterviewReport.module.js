const mongoose=require('mongoose');
const User=require('./user.module');


/**
 * - job description
 * resume text 
 * self description 
 * 
 * match score: number 
 * 
 *  - technical question :
 * [{
 * question: "question text",
 * intetion: "what the question is trying to test",
 * answer: "answer text",
 * 
 * }]
 * 
 * -Behavioural question:[{
 *  question: "question text",
 * intetion: "what the question is trying to test",
 * answer: "answer text",
 * 
 * }]
 * 
 * -Skill gaps :[{
 *  skill: "skill name",
 * sovierty {
 *   type string 
 *   enum : ["low", "medium", "high"]
 * }
 * 
 * }]
 * 
 * -Preparation palne :[{
 * day: number,
 * task: "task text",
 * }]
 * 
 */

const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type: String,
        required: [true, 'Question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{
  _id: false
}
);

const behaviouralQuestionSchema=new mongoose.Schema({
  question:{
        type: String,
        required: [true, 'Question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{
  _id: false
}
);

const skillGapSchema=new mongoose.Schema({
  skill:{
        type: String,
        required: [true, 'Skill is required']
    },
    severity:{
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required']
    }
},{
  _id: false
}
);

const preparationPlanSchema=new mongoose.Schema({
  day:{
        type: Number,
        required: [true, 'Day is required']
    },
   focus: {
        type: String,
        required: [true, 'Focus is required']
    },
    task:[{
        type: String,
        required: [true, 'Task is required']
    }]
},{
  _id: false
}
);

const InterviewReportSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobDescription:{
        type: String,
        required: [true, 'Job description is required']
    },

    resume:{
        type: String,
        
    },
    selfDescription:{
        type: String
    },
    matchScore:{
        type: Number,
        min: 0,
        max: 100
},



technicalQuestions:[technicalQuestionSchema],
behaviouralQuestions:[behaviouralQuestionSchema],
skillGaps:[skillGapSchema],
preparationPlans:[preparationPlanSchema],

title:{
  type: String,
  required: [true, 'Title is required']
}

}, { timestamps: true });





module.exports=mongoose.model('InterviewReport', InterviewReportSchema);