"use strict";
// array of questions. Move to top later.
let questionArray = [
    { "question": "What is a variable?",
    "answer1": "1",
    "answer2": "2",
    "answer3": "3",
    "answer4": "4",
    "correctAnswer":"1"
    },

    { "question": "quest2?",
    "answer1": "1",
    "answer2": "2",
    "answer3": "3",
    "answer4": "4",
    "correctAnswer":"1"
    },
]


let startBtn = document.getElementById('start');

startBtn.addEventListener("click", runQuiz);

function runQuiz() {
    for (let i of questionArray) {
        console.log(i);
        let currentQuestion = new Question(i);
    }
}


/*** Creates a new question for display, using questions and answers from a 
 * question object.
 */
class Question {
    constructor(questionObj) {
        ;
    }
    // given the question object, format it properly for viewing in the page.
}
