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

let highestScores = [];
let highScoresObj = {};
const startBtn = document.getElementById('start');
const submitScoreBtn = document.getElementById("submit-score");
const highScoresBtn = document.getElementById('high-scores-btn')
const quizLayout = document.getElementById('quiz');
const timer = document.getElementById('timer');
const nameInputForm = document.getElementById("name-input-form");
let timeOver = true;        // indicates that quiz is over
let newTime = 100;          // Time used by timer
let questionNumber = 0;     // current question being asked from questionArray
let answerDisplayTime;      // The amount of time that "Right" or "Wrong" is displayed
const penaltyTime = 10;     // Penalty time for an incorrect answer
let highScore               // The player's score at the end of the quiz.


/** Creates the initial quiz explanation and start button. */
function initialQuiz() {
    console.log("Page reloaded.");
    quizLayout.innerHTML = "Answer all the questions within the time limit! Incorrect answers will subtract " + penaltyTime + " seconds from the time.";
    startBtn.style.display = "visible";

    // retrieve high scores lists from local storage.
    let storedHighScoresArray = JSON.parse(localStorage.getItem("highestScoresArray"));
    if (storedHighScoresArray !== null) {
        highestScores = storedHighScoresArray;
    }
    let storedHighScoreList = JSON.parse(localStorage.getItem("storedHighScoreList"));
    if (storedHighScoreList !== null) {
        highScoresObj = storedHighScoreList;
    }
}

initialQuiz();


// The start button resets the timer, hides itself, erases intitial content, and resets quiz-related variables.
startBtn.addEventListener("click", function () {
    highScoresBtn.style.display = "none"
    newTime = 100;
    timeOver = false;
    questionNumber = 0;
    startBtn.style.display = "none";
    quizLayout.textContent = "";
    timer.textContent = "Time left: " + newTime + " seconds";
    document.getElementsByClassName("name-input-row")[0].style.display="none";
    
    // Start timer and run the quiz.
    decrement();
    runQuiz();
});


/** If there are remaining questions, erases the current quiz layout container and displays them on the page. */
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


// HIGH SCORE FUNCTIONS
// ---------------------

nameInputForm.addEventListener("submit", function() {
    submitName(event);
});
submitScoreBtn.addEventListener("click", function() {
    submitName(event);
});

document.getElementById("high-scores-btn").addEventListener("click", displayHighScores);

function youGotAHighScore() {
    // set timeOver to true, so that the timer stops. Remove the right-wrong bar after stopping timer.
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
    timer.textContent = "Timer";
    highScore = newTime;
    if (highScore < 0) {
        highScore = 0;
    }

    // Create a new <p> to display the score.
    let highScoreDisplay = document.createElement('p');
    highScoreDisplay.setAttribute("class", "col-md-12 high-score");
    quizLayout.textContent = "Your score was: " + highScore;

    if (highScore === 0) {
        highScoreDisplay.textContent += "\nOuch, better luck next time!";
        quizLayout.appendChild(highScoreDisplay);
    }
    // check high scores list. Only 10 high scores will be accepted.
    else if (!isHighScore(highScore)) {
        highScoreDisplay.textContent += "\nGood job! But you didn't get a high score this time!";
        quizLayout.appendChild(highScoreDisplay);
        document.getElementsByClassName("name-input-row")[0].style.display="block";
    }
    // Give opportunity to add to high scores list.
    else {
        highScoreDisplay.textContent += "\nGood job!";
        quizLayout.appendChild(highScoreDisplay);
        document.getElementsByClassName("name-input-row")[0].style.display="block";
    }

    // Display start button again. Display high scores button.
    startBtn.textContent = "Restart?";
    startBtn.style.display = "inline-block";
    highScoresBtn.style.display = "inline-block";
}

// prevent page from reloading upon pressing enter while focused on the form. 
// Remove the form from the page, and display the high scores.
function submitName(event) {
    event.preventDefault();
    inputName(highScore);
    document.getElementsByClassName("name-input-row")[0].style.display="none";
    displayHighScores();
}


/** Determines whether a score is a high score. Also sorts and adds scores to the high scores array.
* Only the top 10 high scores will be stored. */
function isHighScore(score) {

    // if there are less than 10 scores in the high score list, then add to the high scores.
    highestScores.sort();
    if (highestScores.length < 10) {
        highestScores.push(score);  //TODO: ONLY PUsh score if player enters name
        localStorage.setItem("highestScoresArray", JSON.stringify(highestScores));
        return true;
    }

    // since scores are sorted, only need to check if the given score is higher than the lowest score.
    if (score > highestScores[0]) {
        highestScores.push(score);
        highestScores.shift();
        localStorage.setItem("highestScoresArray", JSON.stringify(highestScores));
        return true;
    }
    return false;
}

/** Need description and name validation. */
function inputName(highScore) {
    let nameInput = document.querySelector("#name-text").value;

    // allow a player with a given name to have more than one high score.
    if (highScoresObj[nameInput] === undefined) {
        highScoresObj[nameInput] = [];
        highScoresObj[nameInput].push(highScore);
        localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
    }
    else {
        highScoresObj[nameInput].push(highScore);
        localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
    }
}


function displayHighScores() {
    quizLayout.innerHTML = "";

    // each name property in the highScoresObj has an associated array of Number scores
    let sortedScores = [];
    for (let scoreName in highScoresObj) {
        for (let i = 0, j = highScoresObj[scoreName].length; i < j; i++) {
            let individualScore = [];
            individualScore.push(highScoresObj[scoreName][i]);
            individualScore.push(scoreName);
            sortedScores.push(individualScore);
        }
    }
    console.log(sortedScores);
    scoreSort(sortedScores);
    console.log(sortedScores);


    // append a score row to the quiz
    // for num of high scores in object list
    // get each obj name and value
    let alternateBackground = true
    for (let scoreName in highScoresObj) {
        for (let i = 0, j = highScoresObj[scoreName].length; i < j; i++) {
            let scoreRow = document.createElement("div");
            if (alternateBackground) {
                scoreRow.setAttribute("class", "row high-score-row odd-row");
                alternateBackground = false;
            }
            else {
                scoreRow.setAttribute("class", "row high-score-row even-row");
                alternateBackground = true;
            }
            quizLayout.appendChild(scoreRow);

            // put the high score list inside each row
            let nameCol = document.createElement("div");
            nameCol.setAttribute("class", "col-md-11");
            nameCol.textContent = scoreName;
            scoreRow.appendChild(nameCol);
            let scoreCol = document.createElement("div");
            scoreCol.setAttribute("class", "col-md-1");
            scoreCol.textContent = highScoresObj[scoreName][i];
            scoreRow.appendChild(scoreCol);
        }
    }
    // create a row for each high score, up to 10 rows
}

/** Uses bubble sort to sort a 2D array of names and scores, from highest to lowest.
 * where scoreArray[i][0] is a score, and scoreArray[i][1] is the associated name. */
function scoreSort(scoreArray) {
    // bubble sort: swap adjacent numbers out of order. if no numbers swapped (swap === 0), end loop.
    do {
        // Using var instead of let, otherwise swap is inaccessible to the while statement at the end.
        var swap = 0;
        for (let i = 0, j = scoreArray.length - 1; i < j; i++) {
            if (scoreArray[i][0] < scoreArray[i + 1][0]) {
                let tmp = scoreArray[i];
                scoreArray[i] = scoreArray[i + 1];
                scoreArray[i + 1] = tmp;
                swap++;
            } 
        }
    } while (swap != 0);
}

// QUIZ QUESTION FUNCTIONS
// -----------------------

    /** Writes a new question, new buttons, and new answers to the quizLayout element.
     * @param {Object} questionObj Each questionObj should consist of a 'question' property,
     *  an 'answers' property with an array as a value, and a 'correctAnswer' property with the array index as a value. */
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


// TIMER FUNCTIONS
// ----------------

/** Displays a countdown timer. */
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