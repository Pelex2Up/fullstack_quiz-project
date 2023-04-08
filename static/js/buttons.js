let modal = document.getElementById("modal-auth");
const form = document.getElementById('auth-form');
let span = document.getElementsByClassName("close")[0];
const registrationBtn = document.getElementById("signup-login-button")

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

try {
    let loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener('click', () => {
        modal.style.display = 'block'; // открываем модальное окно
    });
} catch (e) {
    const accountBtn = document.getElementById('my-account')
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        const csrftoken = getCookie('csrftoken');
        $.ajax({
            url: '/user/logout/',
            type: 'POST',
            headers: {'X-CSRFToken': csrftoken}, // добавляем заголовок X-CSRFToken
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    window.location.href = 'http://127.0.0.1:8000/'
                } else {
                    alert('Вы не авторизованы!')
                }
            },
            error: function (xhr, status, error) {
            }
        });
    })

    accountBtn.addEventListener('click', () => {
        if (window.location.href === 'http://127.0.0.1:8000/user/my_account/') {
            window.location.reload()
        } else {
            window.location.href = 'http://127.0.0.1:8000/user/my_account/'; // перенаправляем на страницу личного кабинета
        }
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    let csrftoken = getCookie('csrftoken'); // csrf_token как куки
    $.ajax({
        url: '/user/login/',
        type: 'POST',
        data: {'username': username, 'password': password},
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                window.location.reload()
            } else {
                alert('Неверный логин или пароль!')
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr);
        }
    });
});

registrationBtn.onclick = function () {
    window.location.href = '/registration/'
}