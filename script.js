const startBtn = document.getElementById("startButton");
if (startBtn) {
    startBtn.addEventListener('click', function() {
        window.location.href = "subject.html"
    })
}

const scoreBtn = document.getElementById("scoreButton");
if (scoreBtn) {
    scoreBtn.addEventListener('click', function() {
        window.location.href = "score.html"
    })
}


const mainMenuBtn = document.getElementById("mainMenu");
if (mainMenuBtn) {
    mainMenuBtn.addEventListener('click', function() {
        window.location.href = "index.html"
    })

}


const historyBtn = document.getElementById("historyButton");
if (historyBtn) {
    historyBtn.addEventListener('click', function() {
        localStorage.setItem('quizCategory', 'history')
        apiUrl = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple'
        window.location.href = "quiz.html"
    })
    
}

const generalBtn = document.getElementById("generalButton")
if (generalBtn) 
    generalBtn.addEventListener('click', function() {
    localStorage.setItem('quizCategory', 'general')
    apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
    window.location.href = "quiz.html"
})


let apiUrl = '';

document.addEventListener('DOMContentLoaded', () => {
    const quizCategory = localStorage.getItem('quizCategory');
    if (quizCategory === 'history') {
        apiUrl = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple';
    } else if (quizCategory === 'general') {
        apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';
    } else {
        alert('Vänligen välj ett ämne innan du går vidare.');
        window.location.href = 'subject.html'; 
    }
});

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;

const startQuizBtn = document.getElementById("startQuiz");
if (startQuizBtn) {
    startQuizBtn.addEventListener('click', function() {
        if (!apiUrl) {
            alert("Pick a subject before starting the quest!")
            return;
        }
        fetchQuestions();
        startQuizBtn.style.display = 'none';
    })
}

const nextQuestionBtn = document.getElementById('nextQuestion');
if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', function() {
        currentQuestionIndex++;
        displayQuestion();
        nextQuestionBtn.style.display = 'none'; 
    });
}
    


function fetchQuestions() {
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error("Can not find API")
        }
        return response.json();
    })
    .then(data => {
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    })
    .catch(error => {
        console.error('Fetch error', error)
    })
}


function displayQuestion() {
    clearInterval(timer);
    timeLeft = 15;

    const questionContainer = document.getElementById("questions");
    questionContainer.innerHTML = '';

    const currentQuestion = questions[currentQuestionIndex]
    const questionText = document.createElement("h3")
    questionText.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`
    questionContainer.appendChild(questionText);


    const timerDisplay = document.createElement("div")
    timerDisplay.id ="timer";
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    questionContainer.appendChild(timerDisplay)

    startTimer();


    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
    allAnswers.sort(() => Math.random() - 0.5);

    allAnswers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.classList.add('answer')
        answerButton.addEventListener('click', () => {
            clearInterval(timer);

            handleAnswerClick(answer, currentQuestion.correct_answer)
        })
        questionContainer.appendChild(answerButton);
    })

    const nextQuestionBtn = document.getElementById("nextQuestion")
    nextQuestionBtn.style.display = 'none';

}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time left: ${timeLeft} seconds`;

        if (timeLeft === 0) {
            clearInterval(timer)
            handleAnswerClick(null, questions[currentQuestionIndex].correct_answer)
        }
    }, 1000);
}


function handleAnswerClick(selectedAnswer, correctAnswer) {
    const allAnswerButtons = document.querySelectorAll(".answer");

    allAnswerButtons.forEach(button => {
        button.disabled = true;

        if(button.textContent === correctAnswer) {
            button.style.backgroundColor = 'green';
        }

        if(selectedAnswer && button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            button.style.backgroundColor = 'red';
        }
    })
    

    if (selectedAnswer === correctAnswer) {
        score++;
        console.log("Correct! Your total point now: " + score)
    }

    else {
        console.log("Wrong! Your total point now: " + score)
    }

    const nextQuestionBtn = document.getElementById('nextQuestion');
    if (currentQuestionIndex < questions.length - 1) {
        nextQuestionBtn.style.display = 'block';
    }
    
    else {
        showFinalScore();
    }
    
}


if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', function() {
        displayQuestion();
        nextQuestionBtn.style.display = 'none'
    })
} 


function showFinalScore() {
    const questionContainer = document.getElementById("questions");
    questionContainer.innerHTML = '';


    const resultText = document.createElement("h2");
    resultText.classList.add("resultText");
    resultText.textContent = `You got ${score} out of ${questions.length} correct!`;
    questionContainer.appendChild(resultText);

    const playerName = prompt("Enter your name:");

    let highscoreList = JSON.parse(localStorage.getItem('highscoreList')) || [];

    highscoreList.push({name: playerName, score: score});

    highscoreList.sort((a, b) => b - a);
    highscoreList = highscoreList.slice(0, 10); 

    localStorage.setItem('highscoreList', JSON.stringify(highscoreList));

    const newHighscoreText = document.createElement('h3');
    newHighscoreText.textContent = `New Score Added: ${score} by ${playerName}`;
    questionContainer.appendChild(newHighscoreText);

    const restartContainer = document.getElementById('restartContainer');
    restartContainer.innerHTML = '';

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Play again!';
    restartBtn.classList.add('restartBtn');
    restartBtn.style.display = 'block';
    restartBtn.style.marginTop = '20px';
    restartBtn.addEventListener('click', () => {
        window.location.href = 'subject.html';
    });

    restartContainer.appendChild(restartBtn);
    questionContainer.appendChild(restartContainer);

    if (startQuizBtn) {
        startQuizBtn.style.display = 'none';
    }
}

