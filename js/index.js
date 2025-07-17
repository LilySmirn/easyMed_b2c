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


// попап
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

// глаз на строках с паролем
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        const svg = button.querySelector('svg');
        const input = button.closest('.input-group')?.querySelector('input');

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

initPasswordToggle();

const popup = document.getElementById('forgot-password-popup');
const closeBtn = popup?.querySelector('.call-popup__close');
const sendBtn = document.getElementById('send-recovery');
const emailInput = document.getElementById('recovery-email');
const responseMsg = document.getElementById('response-message');

const forgotPasswordLink = document.querySelector('.forgot-password');

if (popup && closeBtn && sendBtn && emailInput && responseMsg && forgotPasswordLink) {
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.add('hidden');
        }
    });

    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        popup.classList.remove('hidden');
        responseMsg.textContent = '';
        emailInput.value = '';
    });

    closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    sendBtn.addEventListener('click', () => {
        console.log('Кнопка отправки нажата');
        const email = emailInput.value.trim();
        if (!email) {
            responseMsg.textContent = 'Введите email';
            return;
        }

        fetch('/send-new-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(res => {
                console.log('Ответ от сервера:', res);
                return res.json();
            })
            .then(data => {
                console.log('Данные:', data);
                responseMsg.textContent = data.message || 'Новый пароль отправлен!';
            })
            .catch(err => {
                console.error('Ошибка при fetch:', err);
                responseMsg.textContent = 'Ошибка при отправке.';
            });
    });
}



