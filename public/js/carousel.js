const splide = new Splide( '.splide', {
    perPage: 2,
    rewind : true,
    mediaQuery: 'min',
    gap: '1rem',
    breakpoints: {
        1375: {
            perPage: 4
        }
    }
    } );
splide.mount();





