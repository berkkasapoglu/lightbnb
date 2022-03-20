const menuCloseEl = document.querySelector('.fa-xmark')
const accountBtnEl = document.querySelector('#account');
const navbarMenuEl = document.querySelector('.menu');

menuCloseEl.addEventListener('click', (e) => {
    e.preventDefault();
    navbarMenuEl.classList.add('hide');
})

accountBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    navbarMenuEl.classList.toggle('hide');
})