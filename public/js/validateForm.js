const title = document.getElementById('title');
const form = document.getElementById('form');
// const errorMessage = document.querySelector('.err-message');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkValidity();
    if(form.checkValidity()) {
        form.submit();
    }
})
const checkValidity = () => {
    form.classList.add('is-validated');
    watchValidity();
    [...form.elements].forEach(inputElement => {
        inputControl(inputElement);
    })
}

const watchValidity = () => {
    [...form.elements].forEach(inputElement => {
        inputElement.addEventListener('keyup', (e) => {
            inputControl(inputElement);
        }) 
    })
}

const inputControl = (input) => {
    if(!input.checkValidity()) {
        const errorElement = input.parentElement.querySelector('.err-message');
        errorElement.innerText = input.validationMessage;
    } else {
        input.setCustomValidity('');
    }
}

const createErrorMessage = (message) => {
    const errorElement = document.createElement('div');
    errorElement.innerText = message;
    errorElement.classList.add('err-message')
    return errorElement;
}

