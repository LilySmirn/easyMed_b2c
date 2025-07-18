function includeHTML(callback) {
    const pathToHeader = window.location.pathname.includes('/pages/') ? '../components/header.html' : './components/header.html';
    const pathToFooter = window.location.pathname.includes('/pages/') ? '../components/footer.html' : './components/footer.html';

    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');

    const promises = [];

    if (headerEl) {
        const headerPromise = fetch(pathToHeader)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки header');
                return response.text();
            })
            .then(data => {
                headerEl.innerHTML = data;
            })
            .catch(error => {
                headerEl.innerHTML = "<p>Не удалось загрузить шапку</p>";
                console.error(error);
            });
        promises.push(headerPromise);
    }

    if (footerEl) {
        const footerPromise = fetch(pathToFooter)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки footer');
                return response.text();
            })
            .then(data => {
                footerEl.innerHTML = data;
            })
            .catch(error => {
                footerEl.innerHTML = "<p>Не удалось загрузить подвал</p>";
                console.error(error);
            });
        promises.push(footerPromise);
    }

    Promise.all(promises).then(() => {
        if (typeof callback === 'function') {
            callback();
        }
    });
}

function initHeaderScripts() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const interval = setInterval(() => {
        const loginButtons = document.querySelectorAll('.btn-login, .footer-btn-login');

        if (loginButtons.length === 0) return;

        clearInterval(interval);

        loginButtons.forEach((btn, index) => {
            const clonedBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(clonedBtn, btn);

            if (isLoggedIn) {
                clonedBtn.textContent = "Выйти";
                clonedBtn.href = "#";
                clonedBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userData");
                    window.location.href = "/index.html";
                });
            } else {
                clonedBtn.textContent = "Войти";
                clonedBtn.href = window.location.pathname.includes("/pages/")
                    ? "../pages/login.html"
                    : "./pages/login.html";
            }
        });
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        initHeaderScripts();
    });
});
