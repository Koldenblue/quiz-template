"use strict";
// array of questions.

let questionArray = [
    { "question": "What is a variable?",
        "answers": ["1", "2", "3", "4"],
        "correctAnswer": 0
    },

    { "question": "quest2?",
        "answers": ["1", "2", "3", "4"],
        "correctAnswer": 1
    },

    { "question": "How can you find the answers for this quiz?",
        "answers": ["Inspecting the DOM for the button with id='correct'", 
            "Looking at the questions in the JavaScript source code", 
            "Doing research on the internet", 
            "All of the above"
        ],
        "correctAnswer": 3
    },
]

let highScores = {};

let startBtn = document.getElementById('start');
let quizLayout = document.getElementById('quiz');
var newTime = 100;
let timeOver = false;

// Add event listener to start button. Reset time variables. Hide button and initial text content when clicked.
startBtn.addEventListener("click", function () {
    timeOver = false;
    newTime = 100;
    startBtn.style.display="none";
    quizLayout.textContent="";
});
// Start the quiz.
startBtn.addEventListener("click", runQuiz);


/** Creates new Question objects and displays them on the page. */
function runQuiz() {
    for (let obj of questionArray) {
        console.log(obj);
        let currentQuestion = new Question(obj, "quiz");
        currentQuestion.createLayout();
        // Pause to wait for user input here - let the removeChildren function only be executed 
        // after a button click event
        // can use setTimeout(function, milliseconds)
    }

}


/** Properties for a quiz Question, and methods for displaying and removing the Question. */
class Question {
    /**
     * @param {Object} questionObj Each question object should consist of a question property, 
     *  an array of answers, and a correct answer with an array index as a value (in that order).
     * @param {string} quizLayout The id of an element in the HTML. The Question contents will be
     * children of this element.*/
    constructor(questionObj, quizLayout) {
        this.questionObj = questionObj;
        this.quizLayout = document.getElementById(quizLayout);
        this.numberOfAnswers = questionObj.answers.length;
    }

    /** Writes a new question, new buttons, and new answers to the page. */
    createLayout() {
        // First create a paragraph element for the question and append it to the document.
        let questionPara = document.createElement('p');
        questionPara.textContent = this.questionObj["question"];
        questionPara.setAttribute("class", "question");
        this.quizLayout.appendChild(questionPara);
        // can add an event listener here using event delegation

        // Next Create buttons and paragraphs for each of 4 answers.
        // Add event listeners to each button.
        // For the click event, if the button corresponds to the correct answer,
        // add the right() function. Else add wrong().
        for (let i = 0; i < this.numberOfAnswers; i++) {
            let answerBtn = document.createElement('button');
            answerBtn.textContent = i + 1 + ".";
            answerBtn.setAttribute("class", "answerBtn");
            if (this.questionObj.correctAnswer === i) {
                answerBtn.setAttribute("id", "correctAnswer");
            }
            let answerPara = document.createElement('p');
            answerPara.textContent = this.questionObj.answers[i];
            answerPara.setAttribute("class", "answerPara");
            
            this.quizLayout.appendChild(answerBtn);
            this.quizLayout.appendChild(answerPara);
        }

        // Add an event listener to the parent quiz element, which activates upon a child button press.
        // Question object is bound to checkAnswer function (otherwis 'this' would refer to quizLayout in checkAnswer())
        this.quizLayout.addEventListener("click", this.checkAnswer.bind(this));
    }

    checkAnswer(event) {
        // 'this' refers to quizLayout, since the eventListener on quizLayout calls this function
        console.log("this is ");
        console.log(this);
        event.preventDefault();
        console.log(quizLayout);
        if (event.target.matches("button")) {
            console.log("you clicked me!");
            let feedbackBar = document.createElement("hr");
            let feedbackText = document.createElement("p");
            if (event.target.id === "correctAnswer") {
                console.log("correct!");
                feedbackText.textContent = "Correct!!!"
                
            }
            else {
                console.log("Wrong!");
                feedbackText.textContent = "Wrong :(";

            }
            this.quizLayout.appendChild(feedbackBar);
            this.quizLayout.appendChild(feedbackText);
        }
    } 

    removeQuiz() {
        this.quizLayout.innerHTML = "";
    }

    /** As an althernative to setting all innerHTML to an empty string with removeQuiz(), removeQuestion() 
     * removes all Question object content from the page. */
    removeQuestion() {
        console.log(this.quizLayout);
        let questionPara = document.getElementsByClassName('question');
        let answerPara = document.getElementsByClassName('answerPara');
        let answerBtn = document.getElementsByClassName('answerBtn');

        // elements must be removed backwards to avoid errors in counting array elements
        // (since array elements are being actively removed!)
        for (let i = answerPara.length - 1; i >= 0; i--) {
            this.quizLayout.removeChild(answerPara[i]);
        }
        
        for (let i = answerBtn.length - 1; i >= 0; i--) {
            this.quizLayout.removeChild(answerBtn[i]);
        }
        
        this.quizLayout.removeChild(questionPara[0]);
    }
}


let timer = document.getElementById('timer');
function decrement() {
    let timerInterval = setInterval(
        function() {
            newTime--;
            timer.textContent = "Time left: " + newTime + " seconds";
            if (newTime === 0) {
                clearInterval(timerInterval);
                
                // end quiz here
                timeOver = true;
            }
        },
        1000
    );
}

function penalize(penaltyTime) {
    newTime -= penaltyTime;
}

function youGotAHighScore() {
    ;
}

function displayHighScores () {
    ;
}


/** Removes all elements of a given class. */
function removeClass(className) {
    let targetToRemove = document.getElementsByClassName(className);

    if (targetToRemove.length === 0) {
        return;
    }

    // remove the last child of the parent element of the targeted class.
    targetToRemove[targetToRemove.length - 1].parentNode.removeChild(targetToRemove[targetToRemove.length - 1]);

    // Keep running the function until no targets remain.
    removeClass(className);
}
