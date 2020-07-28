"use strict";
// array of questions.
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

const numberOfAnswers = 4;
let quizLayout = document.getElementById('quiz');
let startBtn = document.getElementById('start');

// Add event listener to start button. Hide button and initial text content when clicked.
startBtn.addEventListener("click", function () {
    startBtn.style.display="none";
    quizLayout.textContent="";
});
startBtn.addEventListener("click", runQuiz);


/*** Creates new Question objects and displays them on the page. */
function runQuiz() {
    // create a new question, one by one, from the questionArray.
    // for (let i of questionArray) {
    //     console.log(i);
        let currentQuestion = new Question(questionArray[0]);
    // }
}


/*** Creates a new question for display, using questions and answers from a 
 * question object.
 */
class Question {
    constructor(questionObj) {
        this.questionObj = questionObj;

        // create a paragraph element for the question and append it to the document.
        let questionPara = document.createElement('p');
        questionPara.textContent = this.questionObj["question"];
        questionPara.setAttribute("class", "question");
        quizLayout.appendChild(questionPara);

        // create buttons and paragraphs for each of 4 answers.
        // if the button corresponds to the correct answer, add the right() function.
        // Else add wrong().
        for (let i = 0; i < numberOfAnswers; i++) {
            let answerBtn = document.createElement('button');
            answerBtn.textContent = i + 1 + ".";
            answerBtn.setAttribute("class", "answerBtn");
            let answerPara = document.createElement('p');
            answerPara.textContent = this.questionObj["answer" + (i + 1)];
            answerPara.setAttribute("class", "answerPara");
            
            // append button and answer to document.
            quizLayout.appendChild(answerBtn);
            quizLayout.appendChild(answerPara);
        }
    }

    // given the question object, format it properly for viewing in the page.

    removeChildren() {
        ;
    }
}
