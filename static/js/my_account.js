let accountPage = document.getElementById('account-page')
let userWelcome = document.getElementById('user-welcome')

$.ajax({
    url: "http://127.0.0.1:8000/user/get_user_data/",
    type: "GET",
    success: function (data) {
        userWelcome.innerHTML = `
        Добро пожаловать, ${data['username']}!
        <br>
        <p style="font-family: 'Apple Braille',ui-serif; margin-top: 3%; font-size: 0.5em;">
        Здесь представлены все ваши квизы, для ознакомления, редактирования или создания новых. 
        <br>
        Спасибо, что пользуетесь нашим сервисом!</p>
        `
        $.ajax({
            url: `http://127.0.0.1:8000/api/quiz/filter/${data['user_id']}/`,
            type: "GET",
            success: function (allQuiz) {
                let resultMain = ''
                allQuiz.forEach(function (quiz) {
                    resultMain += `
                        <div class="my-quiz-container" id="my-quiz-container">    
                            <h2 style="text-align: center">${quiz.title}</h2>
                            <p>${quiz.description}</p>
                            <p class="text-description">Количество вопросов: ${quiz.questions.length}</p>
                            <p class="author" id="author">Автор: ${data['username']}</p>
                            <button class="start-quiz" id="${quiz.id}" 
                                onclick="window.location.href = \`http://127.0.0.1:8000/${quiz.link}\`">Начать</button>
                        </div>                    
                    `
                })
                accountPage.innerHTML = resultMain
            }
        })
    }
})

