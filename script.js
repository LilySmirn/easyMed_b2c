const header = document.querySelector("header");
const links = document.querySelectorAll('.main-menu a');
const faqItems = document.querySelectorAll('.faq-item');

const sections = Array.from(links).map(link => {
    const id = link.getAttribute('href').substring(1);
    return document.getElementById(id);
});

//залипание хедера
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
});

// // выделение пунктов меню жирным
// window.addEventListener('scroll', () => {
//     let currentSectionIndex = 0;
//
//     sections.forEach((section, index) => {
//         if (!section) return;
//         const rect = section.getBoundingClientRect();
//
//         if (rect.top <= window.innerHeight / 2) {
//             currentSectionIndex = index;
//         }
//     });
//
//     links.forEach(link => link.classList.remove('active'));
//     if (links[currentSectionIndex]) {
//         links[currentSectionIndex].classList.add('active');
//     }
// });

//свернуть-развернуть faq
faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});



