const quizData = [
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
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correctAnswer: 1
    }
];

let currentQuestion = 0;
let score = 0;
let answered = new Array(quizData.length).fill(false);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBarEl = document.getElementById("progress-bar");
const resultEl = document.getElementById("result");

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
        resultEl.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
        nextBtn.disabled = true;
    }
}

prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        checkQuizCompletion();
    }
});

loadQuestion();