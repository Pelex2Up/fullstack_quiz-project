const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/registration/', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    xhr.setRequestHeader('X-CSRFToken', csrfToken);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    }

    const data = JSON.stringify({'username': username, 'email': email, 'password': password});
    console.log(data)
    xhr.send(data);
    alert(`Пользователь ${username} зарегистрирован.`)
    window.location.href = 'http://127.0.0.1:8000/'
});
