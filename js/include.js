function includeHTML(callback) {
    const pathToHeader = window.location.pathname.includes('/pages/')
        ? '../components/header.html'
        : './components/header.html';

    const pathToFooter = window.location.pathname.includes('/pages/')
        ? '../components/footer.html'
        : './components/footer.html';

    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');

    const loadComponent = (el, path) => {
        return fetch(path)
            .then(res => {
                if (!res.ok) throw new Error(`Ошибка загрузки: ${path}`);
                return res.text();
            })
            .then(html => {
                el.innerHTML = html;
            })
            .catch(err => {
                el.innerHTML = "<p>Ошибка загрузки компонента</p>";
                console.error(err);
            });
    };

    const promises = [];
    if (headerEl) promises.push(loadComponent(headerEl, pathToHeader));
    if (footerEl) promises.push(loadComponent(footerEl, pathToFooter));

    Promise.all(promises).then(() => {
        if (typeof callback === 'function') callback();
        setupAuthButtons();
    });
}

function setupAuthButtons() {
    const authButtons = document.querySelectorAll('.btn-auth');
    const demoButtons = document.querySelectorAll('.btn-demo, .footer-btn-demo');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || "null");

    const hasTariff = userData?.tariff && userData.tariff !== '—' && userData.tariff !== '-';
    const guideLink = hasTariff ? 'link1' : 'link2'; // link1 — справочник, link2 — демо

    authButtons.forEach(btn => {
        if (token) {
            btn.textContent = 'Выйти';
            btn.href = '#';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '/pages/login.html';
            });
        } else {
            btn.textContent = 'Войти';
            btn.href = window.location.pathname.includes('/pages/')
                ? '../pages/login.html'
                : './pages/login.html';
        }
    });

    demoButtons.forEach(btn => {
        btn.textContent = hasTariff ? 'Справочник' : 'Демо';
        btn.href = guideLink;

        if (hasTariff) {
            btn.classList.add('open');
        } else {
            btn.classList.remove('open');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    includeHTML();
});
