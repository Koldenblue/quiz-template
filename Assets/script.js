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

    // { "question": "quest2?",
    // "answer1": "1",
    // "answer2": "2",
    // "answer3": "3",
    // "answer4": "4",
    // "correctAnswer":"2"
    // },
]

let startBtn = document.getElementById('start');
let quizLayout = document.getElementById('quiz');

// Add event listener to start button. Hide button and initial text content when clicked.
startBtn.addEventListener("click", function () {
    startBtn.style.display="none";
    quizLayout.textContent="";
});
startBtn.addEventListener("click", runQuiz);


/** Creates new Question objects and displays them on the page. */
function runQuiz() {
    // create a new question, one by one, from the questionArray.
    let currentTimer = new Timer(100, 10);
    currentTimer.decrement();

    for (let obj of questionArray) {
        console.log(obj);
        let currentQuestion = new Question(obj, "quiz");
        currentQuestion.createLayout();
        // Pause to wait for user input here - let the removeChildren function only be executed 
        // after a button click event
        // can use setTimeout(function, milliseconds)
        currentQuestion.removeQuestion();
    }
}


/** Creates a new question for display, using questions and answers from a 
 * question object. */
class Question {
    /**
     * @param {Object} questionObj Each question object should consist of a question property, 
     *  any number of answer properties, and a correct answer property (in that order).
     * @param {string} quizLayout The id of an element in the HTML. The Question contents will be
     * children of this element.*/
    constructor(questionObj, quizLayout) {
        this.questionObj = questionObj;
        this.quizLayout = document.getElementById(quizLayout);
        // Potential improvement: could turn the answers into an array so that numberOfAnswers === answers[].length
        this.numberOfAnswers = 4;
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
            let answerPara = document.createElement('p');
            answerPara.textContent = this.questionObj["answer" + (i + 1)];
            answerPara.setAttribute("class", "answerPara");
            
            this.quizLayout.appendChild(answerBtn);
            this.quizLayout.appendChild(answerPara);
        }
    }

    /** Removes all Question object content from the page. */
    removeQuestion() {
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
        
        // here, technically loop is unnecessary for just one question
        for (let i = questionPara.length - 1; i >= 0; i--) {
            this.quizLayout.removeChild(questionPara[i]);
        }
    }

    /*** Recursively removes all elements of a given class. */
    removeClass(className) {
        ;
    }
}

/** Creates a new Timer object. The desired starting time and penalty times 
 * can be input as parameters. The timer can count down to 0 with decrement(), 
 * and it can also subtract a penalty time with penalize(). */
class Timer {
    /**
     * @param {Number} timeAllotted Time given, in seconds.
     * @param {Number} penalty Time to be penalized, in seconds. */
    constructor(timeAllotted, penalty) {
        this.timeAllotted = timeAllotted;
        console.log(this.timeAllotted);
        this.penalty = penalty;
        this.timer = document.getElementById('timer');
    }

    decrement() {
        // It is necessary to create a new variable, newTime, for use within the anonymous function.
        // This is because the anonymous function cannot "see" or change this.timeAllotted
        let newTime = this.timeAllotted;
        let timerInterval = setInterval(
            function() {
                newTime--;
                this.timer.textContent = "Time left: " + newTime + " seconds";
                if (newTime === 0) {
                    clearInterval(timerInterval);
                    // end quiz here
                }
            },
            1000
        );
    }

    penalize() {
        ;
    }
}