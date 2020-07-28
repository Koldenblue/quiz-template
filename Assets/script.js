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
        currentQuestion.createLayout();
        currentQuestion.removeChildren()
    // }
}


/*** Creates a new question for display, using questions and answers from a 
 * question object. */
class Question {
    constructor(questionObj) {
        this.questionObj = questionObj;
    }

    /*** Writes a new question, new buttons, and new answers to the page. */
    createLayout() {
        // First create a paragraph element for the question and append it to the document.
        let questionPara = document.createElement('p');
        questionPara.textContent = this.questionObj["question"];
        questionPara.setAttribute("class", "question");
        quizLayout.appendChild(questionPara);

        // Next Create buttons and paragraphs for each of 4 answers.
        // Add event listeners to each button.
        // For the click event, if the button corresponds to the correct answer,
        // add the right() function. Else add wrong().
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

    /*** Removes all Question content from the page. */
    removeChildren() {
        let questionPara = document.getElementsByClassName('question');
        let answerPara = document.getElementsByClassName('answerPara');
        let answerBtn = document.getElementsByClassName('answerBtn');

        // elements must be removed backwards to avoid errors in counting array elements
        // (since array elements are being actively removed!)
        for (let i = answerPara.length - 1; i >= 0; i--) {
            quizLayout.removeChild(answerPara[i]);
        }
        
        for (let i = answerBtn.length - 1; i >= 0; i--) {
            quizLayout.removeChild(answerBtn[i]);
        }
        
        for (let i = questionPara.length - 1; i >= 0; i--) {
            quizLayout.removeChild(questionPara[i]);
        }
    }
}
