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
        initHeaderAuthLogic(); // <-- Подключаем после отрисовки
    });
}

// 💡 Основная логика входа/выхода
function initHeaderAuthLogic() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    const checkButtons = () => {
        const loginButtons = document.querySelectorAll('.btn-login, .footer-btn-login');

        loginButtons.forEach(btn => {
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);

            if (isLoggedIn && userData) {
                clone.textContent = "Выйти";
                clone.href = "#";
                clone.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userData");
                    window.location.href = "/index.html";
                });
            } else {
                clone.textContent = "Войти";
                clone.href = window.location.pathname.includes("/pages/")
                    ? "../pages/login.html"
                    : "./pages/login.html";
            }
        });
    };

    // Небольшая задержка на всякий случай
    setTimeout(checkButtons, 100);
}

// 🛡 Проверка авторизации на защищённых страницах
function checkAuth(required = false) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = localStorage.getItem("userData");

    if (required && (!isLoggedIn || !userData)) {
        window.location.href = "/pages/login.html";
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    includeHTML();
});
