const easyQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Jupiter", "Venus", "Saturn"],
        correctAnswer: 0
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1
    }
];

const mediumQuestions = [
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correctAnswer: 1
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correctAnswer: 2
    }
];

const hardQuestions = [
    {
        question: "What is the smallest prime number greater than 100?",
        options: ["101", "103", "107", "109"],
        correctAnswer: 1
    },
    {
        question: "Who wrote the play 'Waiting for Godot'?",
        options: ["Samuel Beckett", "Arthur Miller", "Tennessee Williams", "Eugene O'Neill"],
        correctAnswer: 0
    },
    {
        question: "What is the capital of Burkina Faso?",
        options: ["Ouagadougou", "Bamako", "Niamey", "Dakar"],
        correctAnswer: 0
    }
];

let quizData = [];
let currentQuestion = 0;
let score = 0;
let answered = [];
let timeLeft = 30;
let timerInterval;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBarEl = document.getElementById("progress-bar");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const startScreenEl = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const feedbackEl = document.getElementById("feedback");

function startQuiz() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case "easy":
            quizData = easyQuestions;
            break;
        case "medium":
            quizData = mediumQuestions;
            break;
        case "hard":
            quizData = hardQuestions;
            break;
    }
    answered = new Array(quizData.length).fill(false);
    startScreenEl.style.display = "none";
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;

    optionsEl.innerHTML = "";
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;
        button.addEventListener("click", () => selectOption(index));
        optionsEl.appendChild(button);
    });

    updateProgressBar();
    updateButtons();
}

function selectOption(index) {
    if (answered[currentQuestion]) return;

    const options = optionsEl.children;
    const correctAnswer = quizData[currentQuestion].correctAnswer;

    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("correct", "incorrect");
        if (i === correctAnswer) {
            options[i].classList.add("correct");
        } else if (i === index) {
            options[i].classList.add("incorrect");
        }
    }

    if (index === correctAnswer) {
        score++;
        showFeedback("Correct!", "#4CAF50");
    } else {
        showFeedback("Incorrect!", "#f44336");
    }

    answered[currentQuestion] = true;
    updateButtons();
    checkQuizCompletion();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBarEl.innerHTML = `<div class="progress-bar-fill" style="width: ${progress}%"></div>`;
}

function updateButtons() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = currentQuestion === quizData.length - 1 && answered[currentQuestion];
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? "Finish" : "Next";
}

function checkQuizCompletion() {
    if (answered.every(a => a)) {
        clearInterval(timerInterval);
        resultEl.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
        nextBtn.disabled = true;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectOption(-1); // Force selection of no option
            nextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    startTimer();
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
        resetTimer();
    } else {
        checkQuizCompletion();
    }
}

function showFeedback(message, color) {
    feedbackEl.textContent = message;
    feedbackEl.style.backgroundColor = color;
    feedbackEl.style.display = "block";
    setTimeout(() => {
        feedbackEl.style.display = "none";
    }, 2000);
}

prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        resetTimer();
    }
});

nextBtn.addEventListener("click", nextQuestion);

startBtn.addEventListener("click", startQuiz);