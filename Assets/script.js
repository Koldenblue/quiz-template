"use strict";

// Quiz questions to be asked.
let questionArray = [
    { "question": "How many bits are in a byte?",
        "answers": ["4", "8", "16", "32", "64"],
        "correctAnswer": 1
    },

    { "question": "In the JavaScript array \"spam = [1, 2, 3, 4, 5]\", what is spam[1] equal to?",
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
        "answers": ["Are People Insane?!", "Asynchronous Possibility Interweaving", "Always Program Intelligently", "Application Programming Interface"],
        "correctAnswer": 3
    },

    { "question": "Which is NOT a type of loop in JavaScript?",
        "answers": ["try... catch loops", "while loops", "do... while loops", "for loops"],
        "correctAnswer": 0
    },
];

const startBtn = document.getElementById('start');
const submitScoreBtn = document.getElementById("submit-score");
const highScoresBtn = document.getElementById('high-scores-btn');
const quizLayout = document.getElementById('quiz');
const timer = document.getElementById('timer');
const nameInputForm = document.getElementById("name-input-form");
let highestScores = [];     // stores the top 10 highest scores
let highScoresObj = {};     // stores high score names and associated scores
let timeOver = true;        // indicates that quiz is over
let newTime = 100;          // Time used by timer
let questionNumber = 0;     // current question being asked from questionArray
let answerDisplayTime;      // The amount of time that "Right" or "Wrong" is displayed
const penaltyTime = 20;     // Penalty time for an incorrect answer
let highScore;              // The player's score at the end of the quiz


// MAIN FUNCTIONS
// --------------

/** Creates the initial quiz explanation and start button, and retrieves local storage. */
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

// Run initial function upon page reload.
initialQuiz();


// The start button resets the timer, hides itself, hides high score elements, erases intitial content, and resets quiz-related variables.
startBtn.addEventListener("click", function () {
    highScoresBtn.style.display = "none";
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


/** Run the quiz. If there are remaining questions, erase the current quiz layout container and display questions on the page.
 * If not, deal with high scores. */
function runQuiz() {
    // If past last question, deal with high scores instead of continuing questions:
    if (questionNumber === questionArray.length) {
        youGotAHighScore();
        return;
    }
    // Display next question:
    quizLayout.innerHTML = "";
    createLayout(questionArray[questionNumber]);
    questionNumber++;
}


// HIGH SCORE FUNCTIONS
// ---------------------

// Add event listener functionality to high score forms and buttons:
nameInputForm.addEventListener("submit", function() {
    submitName(event);
});
submitScoreBtn.addEventListener("click", function() {
    submitName(event);
});
document.getElementById("high-scores-btn").addEventListener("click", displayHighScores);
document.getElementById("top-left-high-scores").addEventListener("click", function() {
    startBtn.style.display = "inline-block";
    displayHighScores();
});


/** Ends the quiz by erasing quiz content. Then, determines the score, and whether a high score was obtained.
 * If a high score was obtained, the high score input form is displayed. */
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
    }
    // If high score, give opportunity to add to high scores list.
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


/** Determines whether a score is a high score. Also sorts the high scores array.
* Only the top 10 high scores will be stored. */
function isHighScore(highScore) {
    // if there are less than 10 scores in the high score list, return true.
    highestScores.sort();
    if (highestScores.length < 10) {
        return true;
    }
    // Since highestScores is sorted, only check if the given highScore is higher than the lowest score.
    if (highScore > highestScores[0]) {
        return true;
    }
    return false;
}


/** submitName() is the function called by the event listener for the high score form.
 * submitName() first calls inputName() to validate and store a name given by the user.
 * If the name is valid, it then trims the list of scores to the top 10, 
 * and displays the high scores using displayHighScores(). */
function submitName(event) {
    // Prevent page from reloading upon enter key press.
    event.preventDefault();
    // By this time, isHighScore() will already have sorted and checked the high scores array, highestScores.

    // Only store 10 scores at a time.
    if (inputName(highScore)) {
        if (highestScores.length >= 10) {
            // Sort scores from highScoresObj
            // For reference: sortedScores[i][0] is a score associated with a name at sortedScores[i][1].
            // sortedScores in in order from highest to lowest score.
            let sortedScores = scoreSort();
            let lowScorerName = sortedScores[sortedScores.length - 1][1]; // this is the score / name of the lowest scorer
            highScoresObj[lowScorerName].sort();
            // Delete first score (the lowest score) in array for associated name:
            highScoresObj[lowScorerName].splice(0, 1);
            // Finally, remove the lowest score from the high score array.
            highestScores.shift();
        }

        // Add the newest high score and put it into local storage.
        highestScores.push(highScore);
        localStorage.setItem("highestScoresArray", JSON.stringify(highestScores));

        // Display the high scores list.
        document.getElementsByClassName("name-input-row")[0].style.display="none";
        displayHighScores();
    }
}


/** inputName() validates name inputs.
 * After validation, it adds the input name and score to the highScoresObj Object. */
function inputName(highScore) {
    let nameInput = document.querySelector("#name-text").value;

    // Validate name:
    if (nameInput === "") {
        alert("You must have at least one character in your name!");
        return false;
    }
    if (nameInput.length > 50) {
        alert("Maximum character length for names is 50 characters!");
        return false;
    }

    // The score will be input as a part of an array of scores. Each score array is associated with
    // a unique name property, which is part of the Object highScoresObj.
    // This allows a given name to have more than one high score associated with it.
    // So, if the name is not already in use, create the new name and associated score array.
    if (highScoresObj[nameInput] === undefined) {
        highScoresObj[nameInput] = [];
        highScoresObj[nameInput].push(highScore);
        localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
    }
    else {
        highScoresObj[nameInput].push(highScore);
        localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
    }
    return true;
}


/** Sort and display high scores, in order from highest to lowest. */
function displayHighScores() {
    quizLayout.innerHTML = "";
    highScoresBtn.style.display = "none";

    // scoreSort() returns a sorted 2D array of names and scores.
    let sortedScores = scoreSort();

    let alternateBackground = true      // indicates alternate background colors for alternating rows
    // A loop that first appends a score row to the quiz. Then it adds two columns, one for names and one for scores.
    for (let i = 0, j = sortedScores.length; i < j; i++) {
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

        let nameCol = document.createElement("div");
        nameCol.setAttribute("class", "col-md-11");
        nameCol.textContent = sortedScores[i][1];
        scoreRow.appendChild(nameCol);
        let scoreCol = document.createElement("div");
        scoreCol.setAttribute("class", "col-md-1");
        scoreCol.textContent = sortedScores[i][0];
        scoreRow.appendChild(scoreCol);
    }
}


/** Gets the names and high scores from highScoresObj and puts them into a 2D arrray.
 * Then uses bubble sort to sort the 2D array of names and scores, from highest to lowest.
 * The returned array scoreArray[i][0] is a score, and scoreArray[i][1] is the associated name. */
function scoreSort() {
    // Get names and scores into new array, scoreArray:
    let scoreArray = [];
    for (let scoreName in highScoresObj) {
        for (let i = 0, j = highScoresObj[scoreName].length; i < j; i++) {
            let individualScore = [];
            individualScore.push(highScoresObj[scoreName][i]);
            individualScore.push(scoreName);
            scoreArray.push(individualScore);
        }
    }

    // bubble sort on scoreArray, sorting in descending order:
    do {
        // Using var here instead of let, otherwise 'swap' is inaccessible to the while statement at the end.
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
    return scoreArray;
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

    // Use a for loop to create buttons and paragraphs for each of 4 answers, and append them to quizLayout.
    for (let i = 0; i < numberOfAnswers; i++) {
        let newRow = document.createElement('div');
        newRow.setAttribute("class", "row");
        quizLayout.appendChild(newRow);

        let answerBtn = document.createElement('button');
        // Here, add 1 to i on the answer button text, so answers start from 1 rather than 0
        answerBtn.textContent = i + 1 + ".";
        answerBtn.setAttribute("class", "answerBtn btn btn-primary col-md-1");
        answerBtn.setAttribute("type", "button");
        // add correctAnswer id to the correct answer button
        if (questionObj.correctAnswer === i) {
            answerBtn.setAttribute("id", "correctAnswer");
        }
        // create paragraphs containing the answer options
        let answerPara = document.createElement('p');
        answerPara.textContent = questionObj.answers[i];
        answerPara.setAttribute("class", "answerPara col-md-11");

        // Final step of loop: append the created elements.
        newRow.appendChild(answerBtn);
        newRow.appendChild(answerPara);
    }

    // To complete the layout function, add an event listener to the parent quiz div element.
    // The listener activates upon an answer button press, since the answer buttons are children. (event delegation).
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
        // Notes: If the variable answerDisplayTime is defined within this function, it gets defined each time the function is called.
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