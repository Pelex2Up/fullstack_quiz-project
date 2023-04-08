let page = document.getElementById('quiz-creation-page')

const createNextBtn = document.querySelector('.quiz-create-next-btn');
const finishBtn = document.querySelector('.quiz-create-submit-btn')

const addQuestionButton = document.querySelector('.quiz-add-question-btn');
const questionsContainer = document.querySelector('#quiz-questions-container');

let currentQuizId = 0;
let questionIdCounter = 0;

addQuestionButton.addEventListener('click', () => {
    questionIdCounter++;

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.className = 'quiz-question-input';
    questionInput.id = `quiz-question-${questionIdCounter}-input`;
    questionInput.required = true;

    const questionLabel = document.createElement('label');
    questionLabel.htmlFor = `quiz-question-${questionIdCounter}-input`;
    questionLabel.textContent = 'Вопрос';

    const answersContainer = document.createElement('div');
    answersContainer.className = 'quiz-answers-container';
    answersContainer.dataset.questionId = questionIdCounter;

    const answersLabel = document.createElement('label');
    answersLabel.htmlFor = `quiz-answer-${questionIdCounter}-0-input`;
    answersLabel.textContent = 'Ответы';

    const isCorrectMark = document.createElement('input')
    isCorrectMark.type = 'checkbox'
    isCorrectMark.className = 'quiz-answer-correct'
    isCorrectMark.id = `quiz-answer-${questionIdCounter}-${answersContainer.children.length - 1}-correct`

    const correctWrapper = document.createElement('label')
    correctWrapper.append(isCorrectMark)
    correctWrapper.append(' Правильный ответ')

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.className = 'quiz-answer-input';
    answerInput.id = `quiz-answer-${questionIdCounter}-0-input`;
    answerInput.required = true;

    const answerWrapper = document.createElement('div');
    answerWrapper.className = 'quiz-answer';
    answerWrapper.append(correctWrapper);
    answerWrapper.append(answerInput);

    const addAnswerButton = document.createElement('button');
    addAnswerButton.type = 'button';
    addAnswerButton.className = 'quiz-add-answer-btn';
    addAnswerButton.textContent = 'Добавить ответ';
    addAnswerButton.dataset.questionId = questionIdCounter;

    answersContainer.append(answersLabel, answerWrapper, addAnswerButton);

    const questionWrapper = document.createElement('div')
    questionWrapper.append(questionLabel, questionInput, answersContainer);

    questionsContainer.insertBefore(questionWrapper, addQuestionButton);
});

questionsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('quiz-add-answer-btn')) {
        const questionId = event.target.dataset.questionId;
        const answersContainer = document.querySelector(`[data-question-id="${questionId}"]`);

        const isCorrectMark = document.createElement('input')
        isCorrectMark.type = 'checkbox'
        isCorrectMark.className = 'quiz-answer-correct'
        isCorrectMark.id = `quiz-answer-${questionId}-${answersContainer.children.length - 1}-correct`

        const correctWrapper = document.createElement('label')
        correctWrapper.append(isCorrectMark)
        correctWrapper.append(' Правильный ответ')


        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'quiz-answer-input';
        answerInput.id = `quiz-answer-${questionId}-${answersContainer.children.length - 1}-input`;
        answerInput.required = true;

        const answerWrapper = document.createElement('div');
        answerWrapper.className = 'quiz-answer';
        answerWrapper.append(correctWrapper);
        answerWrapper.append(answerInput);


        answersContainer.insertBefore(answerWrapper, event.target);
    }
});

createNextBtn.addEventListener('click', (event) => {
    event.preventDefault()
    const titleInput = document.querySelector('#quiz-title-input');
    const descriptionInput = document.querySelector('#quiz-description-input');

    if (titleInput.value.length === 0 || descriptionInput.value.length === 0) {
        alert('Заполните пожалуйста название и описание квиза.')
    } else {
        $.ajax({
            url: "http://127.0.0.1:8000/user/get_user_data/",
            type: "GET",
            success: function (data) {
                const quizData = {
                    title: titleInput.value,
                    description: descriptionInput.value,
                    user: data['user_id'],
                    questions: []
                };

                fetch('/api/quiz/list/', {
                    method: 'POST',
                    body: JSON.stringify(quizData),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        currentQuizId += data['id']
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    });
            }
        });
        const prevSpace = document.querySelector('.quiz-create-start');
        prevSpace.style.display = 'none';

        const nextSpace = document.querySelector('.quiz-create-questions');
        nextSpace.style.display = 'block';
    }
});

finishBtn.addEventListener('click', (event) => {
    event.preventDefault()

    const questionsInputs = document.querySelectorAll('.quiz-question-input');
    const questions = [];

    questionsInputs.forEach(questionInput => {
        const id = questionInput.id.split('-')[2];
        const answersInputs = document.querySelectorAll(`[data-question-id="${id}"] .quiz-answer-input`);
        const answers = [];

        answersInputs.forEach(answerInput => {
            const isCorrect = answerInput.closest('.quiz-answer')
                .querySelector('.quiz-answer-correct').checked;
            const text = answerInput.value;

            const answerData = {
                answer: text,
                is_correct: isCorrect,
            };

            answers.push(answerData);
        });

        const questionData = {
            quiz_id: currentQuizId,
            question: questionInput.value,
            answers: answers,
        };

        questions.push(questionData);
    });

    questions.forEach(question => {
        $.ajax({
            url: '/api/quiz/questions/',
            method: 'POST',
            data: JSON.stringify({
                'quiz_id': question.quiz_id,
                'question': question.question,
                'answers': []
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            success: function (qData) {
                question.answers.forEach(answer => {
                    $.ajax({
                        url: '/api/quiz/answers/',
                        method: 'POST',
                        data: JSON.stringify({
                            'question_id': qData.id,
                            'is_correct': answer.is_correct,
                            'question': qData.question,
                            'answer': answer.answer
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken'),
                        },
                        success: function (aData) {
                            console.log(aData)
                        },
                        error: function (err) {
                            console.error('Ошибка при создании ответа: ', err)
                        }
                    })
                })
            },
            error: function (err) {
                console.error('Ошибка при создании вопроса:', err);
            }
        });
    });

    const nextSpace = document.querySelector('.quiz-create-questions');
    nextSpace.style.display = 'none';

    const title = document.querySelector('.creation-title');
    title.style.display = 'none';

    const finishSpace = document.querySelector('.quiz-create-finish');
    finishSpace.style.display = 'block';
});