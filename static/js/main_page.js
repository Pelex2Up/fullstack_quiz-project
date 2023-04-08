const allQuizSlot = document.getElementById('container')

const renderMainPage = () => {
    let url = 'http://127.0.0.1:8000/api/quiz/list/';
    let resultMain = '';
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            data.forEach((quizElement) => {
                resultMain += `
                    <div class="card" id="card">
                        <div class="face face1" id="face-1">
                            <div class="content">
                                <h5>
                                    ${quizElement.title}
                                </h5>
                                <p>
                                    <b>Описание:</b>
                                    ${quizElement.description}
                                </p>
                                <a class="btn btn-warning" href="${quizElement.link}" role="button">Пройти опрос</a> 
                            </div>
                        </div>
                        <div class="face face2">
                            <h4>${quizElement.title}</h4>
                        </div>
                    </div>
                `;
                allQuizSlot.innerHTML = resultMain;
            })
        })
}

renderMainPage()
