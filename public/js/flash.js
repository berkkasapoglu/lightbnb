const closeIconEl = document.querySelector('.flash__close-icon');
if(closeIconEl) {
    closeIconEl.addEventListener('click', async (e) => {
        const flashEl = e.target.closest('.flash');
        flashEl.classList.remove('show');
        setTimeout(() => {
                if(!flashEl.classList.contains('show')) flashEl.remove();
        }, 200);
    })
}
