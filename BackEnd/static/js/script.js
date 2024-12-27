document.addEventListener('DOMContentLoaded', function () {
    var navbarCollapse = document.querySelector('#navbarSupportedContent');
    var navbarToggler = document.querySelector('.navbar-toggler');

    navbarToggler.addEventListener('click', function () {
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('glassmorphism');
        } else if (window.innerWidth < 992) {
            navbarCollapse.classList.add('glassmorphism');
        }
    });

    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
        navbarCollapse.classList.remove('glassmorphism');
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            navbarCollapse.classList.remove('glassmorphism');
            navbarCollapse.classList.remove('show');
        } else if (!navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.add('glassmorphism');
        }
    });

});

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        element.querySelector('i').classList.remove('fa-minus');
        element.querySelector('i').classList.add('fa-plus');
    } else {
        answer.style.display = 'block';
        element.querySelector('i').classList.remove('fa-plus');
        element.querySelector('i').classList.add('fa-minus');
    }
}