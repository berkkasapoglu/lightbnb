const linkEls = document.querySelectorAll('.pagination__link');
const scrollEl = document.querySelector('#listing-section');
const currentPageEl = document.querySelector('.pagination__current');
const linkDisabledEl = document.querySelector('.pagination--disabled');

linkEls.forEach(linkEl => {
    linkEl.addEventListener('click', async(e) => {
        e.preventDefault();
        localStorage.setItem('scroll', scrollEl.offsetTop);
        window.location.href = linkEl.href;
    })
})

window.addEventListener('DOMContentLoaded', (e) => {
    if(localStorage.getItem('scroll')) {
        window.scrollTo({
            top: scrollEl.offsetTop,
            left: 0,
            behavior: 'smooth'
        })
    }
    localStorage.removeItem('scroll');
})
