
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

    let currentIndex = 0;
    let cardWidth = items[0].offsetWidth + 20;
    let visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
    let maxIndex = items.length - visibleCards;

    function updateCarousel() {
        portfolioWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    arrowLeft.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // volta para o final
        }
        updateCarousel();
    });

    arrowRight.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // volta para o começo
        }
        updateCarousel();
    });

    window.addEventListener('resize', () => {
        cardWidth = items[0].offsetWidth + 20;
        visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
        maxIndex = items.length - visibleCards;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateCarousel();
    });
});
