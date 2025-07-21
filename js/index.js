const btnSelect = document.querySelectorAll(".btn-select");

btnSelect.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = '../pages/login.html';
    })
})

function initHeaderScripts() {
    const header = document.querySelector("header");
    const faqItems = document.querySelectorAll('.faq-item');
    const links = document.querySelectorAll('.main-menu a');
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    // Обработка плавного скролла для меню
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    function closeMobileMenu() {
        burgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay?.classList.remove('active');
        overlay?.classList.add('hidden');
    }

    function openMobileMenu() {
        burgerBtn.classList.add('active');
        mobileMenu.classList.add('active');
        overlay?.classList.remove('hidden');
        setTimeout(() => overlay?.classList.add('active'), 10);
    }

    if (burgerBtn && mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a[href^="#"]');

        burgerBtn.addEventListener('click', () => {
            const isActive = burgerBtn.classList.contains('active');
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }

                setTimeout(() => {
                    closeMobileMenu();
                }, 600);
            });
        });

        document.addEventListener('click', (event) => {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnBurger = burgerBtn.contains(event.target);
            const isClickOnOverlay = overlay?.contains(event.target);

            if (!isClickInsideMenu && !isClickOnBurger && !isClickOnOverlay) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });

        overlay?.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 10);
        });
    }

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

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
        const input = button.parentElement.querySelector('input[type="password"], input[type="text"]');

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

function initPopupForm() {
    const contactBtn = document.querySelector('.contact-button');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popup = document.querySelector('.call-popup');
    const closeBtn = document.querySelector('.call-popup__close');
    const form = document.getElementById('popupForm');

    if (!contactBtn || !popupOverlay || !popup || !closeBtn || !form) return;

    // открыть
    contactBtn.addEventListener('click', () => {
        popupOverlay.classList.remove('hidden');
        document.body.classList.add('noscroll');
    });

    // закрыть по крестику
    closeBtn.addEventListener('click', () => {
        popupOverlay.classList.add('hidden');
        document.body.classList.remove('noscroll');
    });

    // закрыть вне формы
    popupOverlay.addEventListener('click', (e) => {
        if (!popup.contains(e.target)) {
            popupOverlay.classList.add('hidden');
            document.body.classList.remove('noscroll');
        }
    });

    // отправка в тг
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const token = '7860976863:AAE2Y43llKvWPkhnV7_MtGHGHUIMBxb4270';
        const chatId = '-1002653556555';

        const formData = new FormData(form);
        const email = formData.get('email');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const crm = formData.get('crm');

        const message = `
Новая заявка:
Имя: ${name}
Email: ${email}
Телефон: ${phone}
Клиника: ${crm || '—'}
`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
            });

            if (response.ok) {
                alert('Заявка успешно отправлена!');
                form.reset();
                popupOverlay.classList.add('hidden');
                document.body.classList.remove('noscroll');
            } else {
                alert('Ошибка при отправке. Попробуйте позже.');
            }
        } catch (error) {
            alert('Ошибка соединения. Проверьте интернет.');
        }
    });
}

initPopupForm();


document.addEventListener('DOMContentLoaded', () => {
    initHeaderScripts();
    initLoginForm();
    initRegistrationForm();
    initPasswordToggle();
});
