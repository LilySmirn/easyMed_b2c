function initLoginForm() {
    const loginForm = document.querySelector('.login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', handleLoginSubmit);
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const remember = form.remember.checked;

    if (!email || !password) {
        showLoginError('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const data = await sendLoginRequest(email, password);

        if (data.token) {
            storeToken(data.token, remember);
            redirectToCabinet();
        } else {
            showLoginError(data.message || 'Ошибка авторизации');
        }
    } catch (error) {
        console.error('Ошибка при логине:', error);
        showLoginError('Не удалось связаться с сервером');
    }
}

async function sendLoginRequest(email, password) {
    const response = await fetch('#', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return await response.json();
}

function showLoginError(message) {
    alert(message);
}

function initRegistrationForm() {
    const regForm = document.querySelector('.reg-form');
    if (!regForm) return;

    regForm.addEventListener('submit', handleRegistrationSubmit);
}

async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const passwordConfirm = form.passwordConfirm.value;

    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        showRegistrationError('Пожалуйста, заполните все поля');
        return;
    }

    if (password !== passwordConfirm) {
        showRegistrationError('Пароли не совпадают');
        return;
    }

    try {
        const data = await sendRegistrationRequest({
            firstName,
            lastName,
            email,
            password
        });

        if (data.token) {
            storeToken(data.token);
            redirectToCabinet();
        } else {
            showRegistrationError(data.message || 'Ошибка при регистрации');
        }
    } catch (err) {
        console.error('Ошибка регистрации:', err);
        showRegistrationError('Не удалось связаться с сервером');
    }
}

async function sendRegistrationRequest(payload) {
    const response = await fetch('#', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return await response.json();
}

window.storeToken = function(token, remember = true) {
    if (remember) {
        localStorage.setItem('token', token);
    } else {
        sessionStorage.setItem('token', token);
    }
};

window.redirectToCabinet = function() {
    window.location.href = '../pages/profile.html';
};

function showRegistrationError(message) {
    alert(message);
}

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        const svg = button.querySelector('svg');
        const input = button.closest('.password-field')?.querySelector('input');

        if (!svg || !input) return;

        const eyeBase = `
            <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
            <circle cx="12" cy="12" r="2.5"/>
        `;
        const strikeLine = `
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2" />
        `;

        svg.innerHTML = eyeBase;

        button.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
            svg.innerHTML = eyeBase + (isPassword ? strikeLine : '');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initRegistrationForm();
    initPasswordToggle();
});
