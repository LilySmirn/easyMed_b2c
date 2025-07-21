function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    console.log("Введённый email:", email);
    console.log("Сохранённый email:", storedUserData?.email);
    console.log("Введённый пароль:", password);
    console.log("Сохранённый пароль:", storedUserData?.password);

    if (!storedUserData) {
        showLoginError();
        return;
    }

    if (email === storedUserData.email && password === storedUserData.password) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "profile.html";
    } else {
        showLoginError();
    }
}

function showLoginError() {
    alert("Неверный email или пароль");
}

const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

const regForm = document.querySelector('.reg-form');
if (regForm) {
    regForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const firstName = document.querySelector('input[name="firstName"]').value.trim();
        const lastName = document.querySelector('input[name="lastName"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const password = document.querySelector('input[name="password"]').value.trim();
        const passwordConfirm = document.querySelector('input[name="passwordConfirm"]').value.trim();

        if (password !== passwordConfirm) {
            alert("Пароли не совпадают");
            return;
        }

        localStorage.setItem('userData', JSON.stringify({
            firstName,
            lastName,
            email,
            password
        }));
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = 'profile.html';
    });
}
