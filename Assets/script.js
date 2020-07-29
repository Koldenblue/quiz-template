"use strict";
// array of questions.

let questionArray = [
    { "question": "How many bits are in a char?",
        "answers": ["8", "16", "32", "64"],
        "correctAnswer": 0
    },

    { "question": "array number 2?",
        "answers": ["1", "3", "4", "5", "22"],
        "correctAnswer": 2
    },

    { "question": "How can you find the answers for this quiz?",
        "answers": ["Inspect the DOM for the button with id='correct'", 
            "Look at the questions in the JavaScript source code", 
            "Do research on the internet", 
            "All of the above"
        ],
        "correctAnswer": 3
    },

    { "question": "what is question?",
        "answers": ["no", "yes", "question?", "It's me"],
        "correctAnswer": 2
    },

    { "question": "Question 4: quest harder?",
        "answers": ["to be or not to be", "quest for glory", "question authority", "answer"],
        "correctAnswer": 3
    },

    { "question": "Who is Batman?",
        "answers": ["I'm Batman", "Bruce Wayne", "Wayne Bruce"],
        "correctAnswer": 1
    },
]

let highScores = {};
let startBtn = document.getElementById('start');
let quizLayout = document.getElementById('quiz');
var newTime = 100;
let timeOver = false;
let questionNumber = 0;

// Add event listener to start button. The start button resets the timer, hides itself, and initializes quiz-related variables..
startBtn.addEventListener("click", function () {
    timeOver = false;
    newTime = 100;
    questionNumber = 0;
    startBtn.style.display="none";
    quizLayout.textContent="";
    timer.textContent = "Time left: " + newTime + " seconds";

    // Start timer.
    decrement();
});
startBtn.addEventListener("click", runQuiz);


/** Creates new Question objects and displays them on the page. */
function runQuiz() {
    // if past last question, deal with high scores instead of continuing questions.
    if (questionNumber === questionArray.length) {
        endQuiz();
        return;
    }
    let currentQuestion = new Question(questionArray[questionNumber], "quiz");
    questionNumber++;
    currentQuestion.removeQuiz();
    currentQuestion.createLayout();
}

function endQuiz() {
    console.log("ITS OVER");
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

    /** Writes a new question, new buttons, and new answers to the quizLayout element. */
    createLayout() {
        // First create a paragraph element for the question and append it to quizLayout.
        let questionPara = document.createElement('p');
        questionPara.textContent = this.questionObj["question"];
        questionPara.setAttribute("class", "question col md-12");
        this.quizLayout.appendChild(questionPara);

        // Next Create buttons and paragraphs for each of 4 answers, and append them to quizLayout.
        for (let i = 0; i < this.numberOfAnswers; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute("class", "row");
            this.quizLayout.appendChild(newRow);

            let answerBtn = document.createElement('button');
            answerBtn.textContent = i + 1 + ".";
            answerBtn.setAttribute("class", "answerBtn btn btn-primary col-md-2");
            answerBtn.setAttribute("type", "button");
            if (this.questionObj.correctAnswer === i) {
                answerBtn.setAttribute("id", "correctAnswer");
            }
            let answerPara = document.createElement('p');
            answerPara.textContent = this.questionObj.answers[i];
            answerPara.setAttribute("class", "answerPara col-md-10");

            newRow.appendChild(answerBtn);
            newRow.appendChild(answerPara);
        }

        // Add an event listener to the parent quiz element, which activates upon a child button press (event delegation).
        // 'this' inside checkAnswer() will refer to quizLayout from the event listener, rather than the Question object.
        this.quizLayout.addEventListener("click", this.checkAnswer);
    }

    /** if answer button is clicked, execute this function.
    * Shows "Right" or "wrong" text, depending on answer */
    checkAnswer(event) {
        event.preventDefault();
        if (event.target.matches("button")) {
            let hrElem = document.getElementById("hr");
            let feedbackText = document.getElementById('right-wrong');
            if (event.target.id === "correctAnswer") {
                feedbackText.textContent = "Correct!!!"
            }
            else {
                feedbackText.textContent = "Wrong :(";
                penalize(10);
            }

            // Unhide the 'right' or 'wrong' text
            hrElem.style.visibility = 'visible';
            feedbackText.style.visibility = 'visible';
        
        // execute runQuiz to continue the quiz
            runQuiz();

            // after a bit of time, hide the right or wrong text again.
            let displayTime = newTime - 2;
            if (displayTime < 0) {
                displayTime = 0;
            }
            let displayInterval = setInterval(
                function() {
                    if (displayTime >= newTime) {
                        newDisplay = false;
                        hrElem.style.visibility = 'hidden';
                        feedbackText.style.visibility = 'hidden';
                        clearInterval(displayInterval);
                    }
                },
                1000
            );
        }
    }

    /** Removes the question its container. */
    removeQuiz() {
        this.quizLayout.innerHTML = "";
    }
}


/** Displays a countdown timer. */
let timer = document.getElementById('timer');
function decrement() {
    let timerInterval = setInterval(
        function() {
            newTime--;
            timer.textContent = "Time left: " + newTime + " seconds";
            if (newTime === 0) {
                clearInterval(timerInterval);
                endQuiz();
                timeOver = true;
            }
        },
        1000
    );
}

/** Penalizes the player by a number of seconds equal to the penaltyTime parameter. */
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



// Problem with clicking on text still triggers event