"use strict";
// array of questions.

let questionArray = [
    { "question": "How many bits are in a byte?",
        "answers": ["4", "8", "16", "32", "64"],
        "correctAnswer": 1
    },

    { "question": "If I have a JavaScript array, 'spam = [1, 2, 3, 4, 5]', then what is spam[1] equal to?",
        "answers": ["1", "[1, 2, 3, 4, 5]", "2", "undefined"],
        "correctAnswer": 2
    },

    { "question": "If you were a detective looking for the quiz answers, where might you look?",
        "answers": ["Inspect the DOM for the button with id='correct'", 
            "Look for the questions in the JavaScript source code", 
            "Do research on the internet", 
            "All of the above"
        ],
        "correctAnswer": 3
    },

    { "question": "What does API stand for, in the context of web development?",
        "answers": ["Are people insane?", "Asynchronous Possibility Interweaving", "Always Program Intelligently", "Application Programming Interface"],
        "correctAnswer": 3
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

let highScoresObj = {};
const startBtn = document.getElementById('start');
const submitScoreBtn = document.getElementById("submit-score");
const highScoresBtn = document.getElementById('high-scores-btn')
const quizLayout = document.getElementById('quiz');
let timeOver = true;       // indicates that quiz is over
let newTime = 100;          // Time used by timer
let questionNumber = 0;     // current question being asked from questionArray
let answerDisplayTime;      // The amount of time that "Right" or "Wrong" is displayed
const penaltyTime = 20;     // Penalty time for an incorrect answer


/** Creates the initial quiz explanation and start button. */
function initialQuiz() {
    quizLayout.innerHTML = "Answer all the questions within the time limit! Incorrect answers will subtract " + penaltyTime + " seconds from the time."
    startBtn.style.display = "visible";
}

initialQuiz();

document.getElementById("high-scores-btn").addEventListener("click", displayHighScores)

// The start button resets the timer, hides itself, erases intitial content, and resets quiz-related variables.
startBtn.addEventListener("click", function () {
    highScoresBtn.style.display = "none"
    newTime = 100;
    timeOver = false;
    questionNumber = 0;
    startBtn.style.display = "none";
    quizLayout.textContent = "";
    timer.textContent = "Time left: " + newTime + " seconds";
    document.getElementsByClassName("name-input-form")[0].style.display="none";

    // Start timer.
    decrement();
});

startBtn.addEventListener("click", runQuiz);


/** If there are more questions, erases the current quiz layout container and displays them on the page. */
function runQuiz() {
    // if past last question, deal with high scores instead of continuing questions.
    if (questionNumber === questionArray.length) {
        youGotAHighScore();
        return;
    }
    quizLayout.innerHTML = "";
    createLayout(questionArray[questionNumber]);
    questionNumber++;
}


function youGotAHighScore() {
    // set timeOver to true, so that the timer stops. Remove the right-wrong bar after 2 seconds.
    timeOver = true;
    let displayInterval = setTimeout(
        function() {
            document.getElementById("answer-bar").style.visibility = "hidden";
            document.getElementById('right-wrong').style.visibility = "hidden";
        },
        2000
    );

    // Remove any remaining quiz questions from the page.
    quizLayout.innerHTML = "";
    console.log("ITS OVER");

    // Define score as time remaining. Score cannot be lower than zero.
    let highScore = newTime;

    // Create a new <p> to display the score.
    let highScoreDisplay = document.createElement('p');
    highScoreDisplay.setAttribute("class", "col-md-12 high-score");
    quizLayout.textContent = "Your score was: " + highScore;


    timer.textContent = "Timer";
    if (highScore < 0) {
        highScore = 0;
    }
    if (highScore === 0) {
        highScoreDisplay.textContent += "\nOuch, better luck next time!";
        quizLayout.appendChild(highScoreDisplay);
    }
    else {
        highScoreDisplay.textContent += "\nGood job!";
        quizLayout.appendChild(highScoreDisplay);
        document.getElementsByClassName("name-input-form")[0].style.display="block";
        
        submitScoreBtn.addEventListener("click", function(event) {
            event.preventDefault();
            let nameInput = document.querySelector("#name-text").value;
            
        })

    }


    localStorage.setItem("high score", highScore);
    // Display score.

    // Display start button again. Display high scores button.
    startBtn.textContent = "Restart?";
    startBtn.style.display = "inline-block";
    highScoresBtn.style.display = "inline-block";
}


function displayHighScores () {
    ;
}


    /** Writes a new question, new buttons, and new answers to the quizLayout element.
     * @param {Object} questionObj Each questionObj should consist of a 'question' property,
     *  an 'answers' property with an array as a value, and a 'correctAnswer' property with the array index as a value (in that order). */
function createLayout(questionObj) {
    let numberOfAnswers = questionObj.answers.length;

    // First create a paragraph element for the question and append it to quizLayout.
    let questionPara = document.createElement('p');
    questionPara.textContent = questionObj["question"];
    questionPara.setAttribute("class", "question col md-12");
    quizLayout.appendChild(questionPara);

    // Use for loop to create buttons and paragraphs for each of 4 answers, and append them to quizLayout.
    for (let i = 0; i < numberOfAnswers; i++) {
        let newRow = document.createElement('div');
        newRow.setAttribute("class", "row");
        quizLayout.appendChild(newRow);

        let answerBtn = document.createElement('button');
        // add 1 to i on answer button text, so answers start from 1 rather than 0
        answerBtn.textContent = i + 1 + ".";
        answerBtn.setAttribute("class", "answerBtn btn btn-primary col-md-2");
        answerBtn.setAttribute("type", "button");
        // add correctAnswer id to the correct answer button
        if (questionObj.correctAnswer === i) {
            answerBtn.setAttribute("id", "correctAnswer");
        }
        // create paragraphs containing answer options
        let answerPara = document.createElement('p');
        answerPara.textContent = questionObj.answers[i];
        answerPara.setAttribute("class", "answerPara col-md-10");

        // Final step of loop: append the created elements.
        newRow.appendChild(answerBtn);
        newRow.appendChild(answerPara);
    }

    // To complete the layout function, add an event listener to the parent quiz element.
    // The listener activates upon a child button press (event delegation).
    // Note: 'this' inside checkAnswer() will refer to this.quizLayout from the event listener, rather than the Question object.
    quizLayout.addEventListener("click", checkAnswer);
}


    /** if answer button is clicked, execute this function. Shows "Right" or "wrong" text, depending on answer */
function checkAnswer(event) {
    event.preventDefault();
    if (event.target.matches("button")) {
        let hrElem = document.getElementById("answer-bar");
        let feedbackText = document.getElementById('right-wrong');
        if (event.target.id === "correctAnswer") {
            feedbackText.textContent = "Correct!!!"
        }
        else {
            feedbackText.textContent = "Wrong :(";
            penalize(penaltyTime);
        }

        // Unhide the 'right' or 'wrong' text
        hrElem.style.visibility = 'visible';
        feedbackText.style.visibility = 'visible';

        // execute runQuiz to continue the quiz by displaying a new question
        runQuiz();

        // After a bit of time, hide the right or wrong text again.
        // Notes: If answerDisplayTime is defined within this function, it gets defined each time the function is called.
        // This results in setInterval hiding the text according to each local answerDisplayTime variable.
        // Therefore answerDisplayTime is a global time variable. Similar situation for setTimeout().
        answerDisplayTime = newTime - 2;
        if (answerDisplayTime < 0) {
            answerDisplayTime = 0;
        }
        let displayInterval = setInterval(
            function() {
                if (answerDisplayTime >= newTime) {
                    hrElem.style.visibility = 'hidden';
                    feedbackText.style.visibility = 'hidden';
                    clearInterval(displayInterval);
                }
            },
            1000
        );
    }
}


/** Displays a countdown timer. */
let timer = document.getElementById('timer');
function decrement() {
    let timerInterval = setInterval(
        function() {
            newTime--;
            timer.textContent = "Time left: " + newTime + " seconds";
            if (newTime <= 0) {
                clearInterval(timerInterval);
                youGotAHighScore();
            }
            if (timeOver) {
                clearInterval(timerInterval);
                timer.textContent = "Timer";
            }
        },
        1000
    );
}


/** Penalizes the player by a number of seconds equal to the penaltyTime parameter. */
function penalize(penaltyTime) {
    newTime -= penaltyTime;
}