
let btnMenu = document.getElementById('btn-menu') 
let menu = document.getElementById('menu-mobile')
let overlay = document.getElementById('div overlay-menu')

btnMenu.addEventListener('click',()=>{
    menu.classList.add('abrir-menu')

    
})

menu.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')

    
})
overlay.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')

    
})


document.addEventListener('DOMContentLoaded', () => {
    const portfolioWrapper = document.querySelector('.portfolio-wrapper');
    const items = document.querySelectorAll('.portfolio-item');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const carousel = document.querySelector('.portfolio-container');

    const cardWidth = items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(items[0]).marginRight);
    const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);

    let currentIndex = 0;

    function updateCarousel() {
        portfolioWrapper.style.transition = 'transform 0.3s ease-in-out';
        portfolioWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    arrowLeft.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = items.length - visibleCards; // volta pro final
        }
        updateCarousel();
    });

    arrowRight.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex > items.length - visibleCards) {
            currentIndex = 0; // volta pro começo
        }
        updateCarousel();
    });
});


