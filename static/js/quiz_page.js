let currentPathname = window.location.pathname;
currentPathname = currentPathname.substring(1)
const quizApiUrl = `http://127.0.0.1:8000/api/quiz/${currentPathname}`;

const quiz = document.getElementById('quiz');
const quizQuestions = document.getElementById('quiz-questions');
const quizIndicator = document.getElementById('quiz-indicator');
const quizResult = document.getElementById('quiz-results');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');
const btnSendUserData = document.querySelector('#btn-accept-user-data')

let localResults = {};
let quizTitle = '';

fetch(quizApiUrl)
    .then((response) => response.json())
    .then((data) => {

        quizTitle = data[0].title
        const renderSendForm = () => {
            const formBlock = document.querySelector('#quiz-form');
            formBlock.style.display = 'block';
        }

        const renderQuestion = (index) => {
            const renderIndicator = (quizStep) => {
                quizIndicator.innerHTML = `${quizStep}/${data[0].questions.length}`;
            };

            renderIndicator(index + 1);
            quizQuestions.dataset.currentStep = index;
            btnNext.disabled = true;

            quizQuestions.innerHTML = `
            <div class="quiz-question-item">
                <div class="quiz-question-item-question">${data[0].questions[index].question}</div>
                <ul class="quiz-question-item-answer">${
                data[0]
                    .questions[index]
                    .answers
                    .map((answerEl) =>
                        `
                        <li>
                            <label>
                                <input class="answer-input" type="radio" name="${index}" value="${answerEl.id}">
                                ${answerEl.answer}
                            </label>
                        </li>
                        `
                    ).join('')
            }
                </ul>
            </div>
            `;
        };

        const renderResults = () => {
            let result = 'Результаты теста:'

            const checkIsCorrect = (answer, index) => {
                let className = '';

                if (!answer.is_correct && (answer.id === localResults[index])) {
                    className = 'answer-invalid';
                } else if (answer.is_correct) {
                    className = 'answer-valid';
                }
                return className;
            }

            const getAnswers = (index) =>
                data[0]
                    .questions[index]
                    .answers
                    .map((answer) => `<li class="${checkIsCorrect(answer, index)}">${answer.answer}</li>`)
                    .join('');

            data[0].questions.forEach((question, index) => {
                result += `
                    <div class="quiz-result-item">
                        <div class="quiz-result-item-qestion">${question.question}</div>
                        <ul class="quiz-result-item-answer">${getAnswers(index)}</ul>
                    </div>
                    `
            });

            quizResult.innerHTML = result;
        };

        quiz.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-next')) {
                const nextQuestionIndex = Number(quizQuestions.dataset.currentStep) + 1
                if (nextQuestionIndex === data[0].questions.length) {
                    quizQuestions.classList.add('questions--hidden');
                    quizIndicator.classList.add('quiz--hidden');
                    btnNext.style.display = 'none';

                    quizResult.style.display = 'block';
                    btnRestart.style.display = 'block';

                    renderResults();
                    renderSendForm()
                } else {
                    renderQuestion(nextQuestionIndex);
                }
            } else if (event.target.classList.contains('btn-restart')) {
                localResults = {};
                quizResult.innerHTML = '';

                quizQuestions.classList.remove('questions--hidden');
                quizIndicator.classList.remove('quiz--hidden');
                btnNext.style.display = 'block';
                quizResult.style.display = 'none';
                btnRestart.style.display = 'none';

                renderQuestion(0);
            }
        });

        renderQuestion(0);
    });

quiz.addEventListener('change', (event) => {
    if (event.target.classList.contains('answer-input')) {
        localResults[event.target.name] = event.target.value;
        btnNext.disabled = false;
    }
});

btnSendUserData.addEventListener('click', (event) => {
    event.preventDefault();
    const userNameInput = document.querySelector('#quiz-user');
    const emailUserInput = document.querySelector('#email');
    const phoneUserInput = document.querySelector('#phone');


    if (userNameInput.value.length === 0 || emailUserInput.value.length === 0 || phoneUserInput.value.length === 0) {
        alert('Пожалуйста заполните все строки.')
    } else {
        $.ajax({
            url: 'http://127.0.0.1:8000/api/send_tg_data/',
            method: 'POST',
            data: JSON.stringify({
                "userName": userNameInput.value,
                "userEmail": emailUserInput.value,
                "userPhone": phoneUserInput.value,
                "quizTitle": quizTitle
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            success: function (data) {
                alert('Спасибо, что прошли наш опрос! Ваше мнение очень важно для нас!');
                window.location.href = 'http://127.0.0.1:8000/';
            },
            error: function (err) {
                console.log('Ошибка отправки данных пользователя! ', err);
            }
        });
    }
});
