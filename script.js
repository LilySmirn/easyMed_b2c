document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector("header");
    const faqItems = document.querySelectorAll('.faq-item');
    const links = document.querySelectorAll('.main-menu a');
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a[href^="#"]');
    const overlay = document.querySelector('.overlay');

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

                // Закрытие меню после прокрутки
                setTimeout(() => {
                    closeMobileMenu();
                }, 600);
            });
        });

        // закрытие меню при клике вне
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnBurger = burgerBtn.contains(event.target);
            const isClickOnOverlay = overlay?.contains(event.target);

            if (!isClickInsideMenu && !isClickOnBurger && !isClickOnOverlay) {
                closeMobileMenu();
            }
        });

        // закрытие по escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // затемнение фона в бургере
        overlay?.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // залипание хедера
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
    });

    // развернуть faq
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});
