const modalOverlay = document.getElementById('modalOverlay');
const modalWindow = document.getElementById('modalWindow');
const modalTitle = document.getElementById('modalTitle');
const modalInput = document.getElementById('modalInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const modalSubmit = document.getElementById('modalSubmit');
const modalCancel = document.getElementById('modalCancel');
const modalClose = document.getElementById('modalClose');
const successMessage = document.getElementById('successMessage');

let currentType = '';
let targetTextElement = null;

const titles = {
    name: 'Введите имя и фамилию',
    email: 'Введите новый email',
    password: 'Введите новый пароль'
};

// Загрузка сохранённых данных
window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('profile_name');
    const savedEmail = localStorage.getItem('profile_email');
    const savedPassword = localStorage.getItem('profile_password');

    if (savedName) {
        document.querySelector('.profile-table-title').textContent = savedName;
        document.querySelector('.info-box-name .info-box-text').textContent = savedName;
    }
    if (savedEmail) {
        document.querySelector('.info-box-mail .info-box-text').textContent = savedEmail;
    }
    if (savedPassword) {
        document.querySelector('.info-box-password .info-box-text').textContent = '******';
    }
});

// Открытие модального окна
document.querySelectorAll('.info-box-change-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.textContent.includes('имя')) {
            currentType = 'name';
            targetTextElement = document.querySelector('.info-box-name .info-box-text');
            const fullName = targetTextElement.textContent.trim().split(' ');
            firstNameInput.value = fullName[0] || '';
            lastNameInput.value = fullName[1] || '';
            showFields({ firstName: true, lastName: true });
        } else if (btn.textContent.includes('почту')) {
            currentType = 'email';
            targetTextElement = document.querySelector('.info-box-mail .info-box-text');
            modalInput.value = targetTextElement.textContent.trim();
            showFields({ input: true });
        } else if (btn.textContent.includes('пароль')) {
            currentType = 'password';
            targetTextElement = document.querySelector('.info-box-password .info-box-text');
            modalInput.value = '';
            confirmPasswordInput.value = '';
            showFields({ input: true, confirm: true }, 'password');
        }

        modalTitle.textContent = titles[currentType];
        modalOverlay.style.display = 'flex';
        modalInput.focus();
    });
});

function showFields({ input = false, confirm = false, firstName = false, lastName = false }, inputType = 'text') {
    modalInput.style.display = input ? 'block' : 'none';
    confirmPasswordInput.style.display = confirm ? 'block' : 'none';
    firstNameInput.style.display = firstName ? 'block' : 'none';
    lastNameInput.style.display = lastName ? 'block' : 'none';

    modalInput.type = inputType;
    confirmPasswordInput.type = inputType;
}

modalCancel.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

modalSubmit.addEventListener('click', () => {
    if (currentType === 'name') {
        const first = firstNameInput.value.trim();
        const last = lastNameInput.value.trim();
        if (!first || !last) {
            alert('Введите имя и фамилию');
            return;
        }
        const fullName = `${first} ${last}`;
        targetTextElement.textContent = fullName;
        document.querySelector('.profile-table-title').textContent = fullName;
        closeModal();
        showSuccess();
        saveProfileData('name', fullName);

    } else if (currentType === 'email') {
        const email = modalInput.value.trim();
        if (!validateEmail(email)) {
            alert('Введите корректный email');
            return;
        }
        targetTextElement.textContent = email;
        closeModal();
        showSuccess();
        saveProfileData('email', email);

    } else if (currentType === 'password') {
        const pass = modalInput.value.trim();
        const confirm = confirmPasswordInput.value.trim();

        if (pass !== confirm) {
            alert('Пароли не совпадают');
            return;
        }

        targetTextElement.textContent = '******';
        closeModal();
        showSuccess();
        saveProfileData('password', pass);
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function closeModal() {
    modalOverlay.style.display = 'none';
    modalInput.value = '';
    confirmPasswordInput.value = '';
    firstNameInput.value = '';
    lastNameInput.value = '';
    showFields({});
}

function showSuccess() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
}

function saveProfileData(type, value) {
    console.log(`Сохраняем: ${type} = ${value}`);
    localStorage.setItem(`profile_${type}`, value);
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

initPasswordToggle();
