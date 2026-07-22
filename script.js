const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');

if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            siteMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
