// ===== All Quiz Sets =====
const quizSets = [
  // ---- First Quiz ----
  [
    { q: "Pakistan has how many provinces?", options: ["3","4","5","6"], answer: "4" },
    { q: "Who is the national hero of Pakistan?", options: ["Allama Iqbal","Quaid-e-Azam","Liaquat Ali Khan","Benazir Bhutto"], answer: "Quaid-e-Azam" },
    { q: "What is 2 + 2?", options: ["3","4","5","6"], answer: "4" },
    { q: "What is the capital of Pakistan?", options: ["Karachi","Islamabad","Lahore","Quetta"], answer: "Islamabad" },
    { q: "Which is the national language of Pakistan?", options: ["Punjabi","Urdu","Sindhi","Pashto"], answer: "Urdu" },
    { q: "Which is the national flower of Pakistan?", options: ["Rose","Jasmine","Tulip","Sunflower"], answer: "Jasmine" },
    { q: "Which animal is the national animal of Pakistan?", options: ["Lion","Markhor","Elephant","Tiger"], answer: "Markhor" },
    { q: "Which is the largest city of Pakistan?", options: ["Lahore","Karachi","Islamabad","Peshawar"], answer: "Karachi" },
    { q: "What is 5 - 3?", options: ["1","2","3","4"], answer: "2" },
    { q: "Which is the national game of Pakistan?", options: ["Cricket","Hockey","Football","Kabaddi"], answer: "Hockey" }
  ],
  // ---- Second Quiz ----
  [
    { q: "What color is the sky on a clear day?", options: ["Blue","Green","Yellow","Pink"], answer: "Blue" },
    { q: "Which animal barks?", options: ["Cat","Dog","Cow","Horse"], answer: "Dog" },
    { q: "What is 3 + 5?", options: ["6","7","8","9"], answer: "8" },
    { q: "How many days in a week?", options: ["5","6","7","8"], answer: "7" },
    { q: "What is the opposite of hot?", options: ["Cold","Warm","Cool","Heat"], answer: "Cold" },
    { q: "Which fruit is yellow?", options: ["Apple","Banana","Grapes","Orange"], answer: "Banana" },
    { q: "What do we drink to stay hydrated?", options: ["Juice","Water","Milk","Tea"], answer: "Water" },
    { q: "What comes after Tuesday?", options: ["Wednesday","Thursday","Friday","Monday"], answer: "Wednesday" },
    { q: "Which is a domestic animal?", options: ["Lion","Dog","Tiger","Elephant"], answer: "Dog" },
    { q: "How many fingers on one hand?", options: ["4","5","6","7"], answer: "5" }
  ]
];

// ===== Variables =====
let questions = [];            // Current quiz questions
let currentQuestion = 0;       // Current question number
let score = 0;                 // Current score
let userAnswers = [];          // Store user answers
let currentQuizIndex = 0;      // Store which quiz is currently running

const quizBox = document.getElementById('quiz-box');

// ===== Start New Quiz (Random Quiz) =====
function startNewQuiz() {
  quizBox.innerHTML = '';
  // Pick a random quiz index (different quiz can load)
  currentQuizIndex = Math.floor(Math.random() * quizSets.length);
  questions = quizSets[currentQuizIndex];
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  loadQuestion();
}

// ===== Restart Same Quiz =====
function restartSameQuiz() {
  quizBox.innerHTML = '';
  // Load the same quiz again using stored currentQuizIndex
  questions = quizSets[currentQuizIndex];
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  loadQuestion();
}

// ===== Load a Question =====
function loadQuestion() {
  const qObj = questions[currentQuestion]; // Get current question object

  quizBox.innerHTML = `
    <div class="question-number">Question ${currentQuestion + 1} of ${questions.length}</div>
    <h2>${qObj.q}</h2>
    <ul class="options">
      ${qObj.options.map(opt => `
        <li>
          <label>
            <input type="radio" name="option" value="${opt}" ${userAnswers[currentQuestion] === opt ? 'checked' : ''}>
            ${opt}
          </label>
        </li>
      `).join('')}
    </ul>
    <label>Or type your answer:</label>
    <input type="text" class="text-input" id="customAnswer" placeholder="Your answer here"
      value="${userAnswers[currentQuestion] && !qObj.options.includes(userAnswers[currentQuestion]) ? userAnswers[currentQuestion] : ''}"/>

    <div class="nav-buttons">
      <button id="prevBtn" ${currentQuestion === 0 ? 'style="visibility:hidden;"' : ''}>Previous</button>
      <button id="nextBtn">${currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}</button>
    </div>

    <p id="liveScore">Current Score: ${score}</p>
  `;

  // Attach button functionality
  document.getElementById('nextBtn').onclick = handleNext;
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) prevBtn.onclick = handlePrev;

  // Save answer when user selects option or types custom answer
  document.querySelectorAll('input[name="option"]').forEach(r =>
    r.addEventListener('change', () => { saveUserAnswer(); checkSubmitAvailability(); })
  );
  document.getElementById('customAnswer').addEventListener('input', () => {
    saveUserAnswer();
    checkSubmitAvailability();
  });

  checkSubmitAvailability();
}

// ===== Handle Next/Submit =====
function handleNext() {
  saveUserAnswer();

  // If not last question, move to next
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    // If all answered, show result
    if (allQuestionsAnswered()) {
      showFinalResult();
    } else {
      // If some unanswered, show alert
      const notAnswered = questions
        .map((_, i) => i + 1)
        .filter(i => !userAnswers[i - 1] || userAnswers[i - 1].trim() === "");
      alert("Please answer all questions.\nUnanswered: " + notAnswered.join(", "));
    }
  }
}

// ===== Handle Previous =====
function handlePrev() {
  saveUserAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

// ===== Save User Answer =====
function saveUserAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  const custom = document.getElementById('customAnswer').value.trim();

  if (selected) {
    userAnswers[currentQuestion] = selected.value;
  } else if (custom) {
    userAnswers[currentQuestion] = custom;
  } else {
    userAnswers[currentQuestion] = undefined;
  }

  updateLiveScore();
}

// ===== Update Live Score =====
function updateLiveScore() {
  score = questions.reduce((acc, q, i) =>
    acc + ((userAnswers[i] || '').toLowerCase() === q.answer.toLowerCase() ? 1 : 0), 0);
  const scoreEl = document.getElementById('liveScore');
  if (scoreEl) scoreEl.textContent = `Current Score: ${score}`;
}

// ===== Check if all questions are answered =====
function allQuestionsAnswered() {
  return questions.every((_, i) => userAnswers[i] && userAnswers[i].trim() !== "");
}

// ===== Enable/Disable submit =====
function checkSubmitAvailability() {
  const nextBtn = document.getElementById('nextBtn');
  if (currentQuestion === questions.length - 1) {
    nextBtn.disabled = !allQuestionsAnswered();
  }
}

// ===== Show Final Result =====
function showFinalResult() {
  updateLiveScore();
  const incorrectQuestions = questions
    .map((q, i) => ({ ...q, user: userAnswers[i] }))
    .filter(q => (q.user || '').toLowerCase() !== q.answer.toLowerCase());

  quizBox.innerHTML = `
    <div class="result">
      <h2>Your Final Score: ${score} / ${questions.length}</h2>
      <button id="reviewBtn">View Incorrect Answers</button>
      <div class="dual-buttons">
        <button id="retrySameBtn">Try Again This Quiz</button>
        <button id="retryNewBtn">Try Another Quiz</button>
      </div>
    </div>
  `;

  // Attach button events after result
  document.getElementById('retrySameBtn').onclick = restartSameQuiz;
  document.getElementById('retryNewBtn').onclick = startNewQuiz;

  // Show incorrect answers when clicked
  document.getElementById('reviewBtn').onclick = () => {
    if (incorrectQuestions.length === 0) {
      quizBox.innerHTML = `
        <h3>Perfect! No incorrect answers.</h3>
        <div class="dual-buttons">
          <button id="retrySameBtn">Try Again This Quiz</button>
          <button id="retryNewBtn">Try Another Quiz</button>
        </div>
      `;
      // Attach buttons again after review
      document.getElementById('retrySameBtn').onclick = restartSameQuiz;
      document.getElementById('retryNewBtn').onclick = startNewQuiz;
      return;
    }

    quizBox.innerHTML = `
      <div class="incorrect-answers">
        <h3>Incorrectly Answered Questions:</h3>
        ${incorrectQuestions.map((q,i)=>`
          <div>
            <p><strong>Q${i+1}:</strong> ${q.q}</p>
            <p>Your Answer: ${q.user || "(blank)"} <br>Correct Answer: ${q.answer}</p>
          </div>
        `).join('<hr/>')}
        <div class="dual-buttons">
          <button id="retrySameBtn">Try Again This Quiz</button>
          <button id="retryNewBtn">Try Another Quiz</button>
        </div>
      </div>
    `;
    // Attach buttons again after review
    document.getElementById('retrySameBtn').onclick = restartSameQuiz;
    document.getElementById('retryNewBtn').onclick = startNewQuiz;
  };
}

// ===== First Launch =====
startNewQuiz();
