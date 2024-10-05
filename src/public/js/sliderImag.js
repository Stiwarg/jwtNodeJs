/**
 * Inicializa el carrusel cuando el documento ha cargado completamente.
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {

    // Contiene todas las diapositivas que fueron generada
    const slides = document.querySelectorAll('.carousel-slide');
    // Contiene todos los botones que sirven como indicadores para saber que diapositiva esta activa
    const indicators = document.querySelectorAll('.carousel-indicator');
    // Lleva el seguimiento de cúal diapositiva está actualmente visible 
    let currentSlide = 0;
    
    /**
     *  Muestra la diapositiva correspondiente al índice dado.( diapositiva actual ).
     *  -Este estilo opacity-0 es para ocultar y este otro opacity-100 para mostrar.
     *  -Este estilo bg-white, bg-opacity-50 es para que el indicador se tenga un fondo blanco semitransparente, indicando que no es el activo.
     *  -Y este otro bg-blue-500 indica que el indicador esta activo (Representa la diapositiva actual). 
     * @param { number } index  - El indice de la diapositiva que se debe mostrar
     */
    const showSlide = ( index ) => {
        slides.forEach( ( slide, i ) => {
            if ( i === index ) {
                // Mostrar la diapositiva actual
                slide.classList.remove('opacity-0');
                slide.classList.add('opacity-100');
            } else {
                // Ocultar las diapositivas no activas
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0');
            }
        });

        // Actualizar los indicadores para reflejar la diapositiva actual
        indicators.forEach( ( indicator, i ) => {
            if ( i === index ) {
                indicator.classList.remove('bg-white', 'bg-opacity-50');
                indicator.classList.add('bg-blue-500');
            } else {
                indicator.classList.remove('bg-blue-500');
                indicator.classList.add('bg-white', 'bg-opacity-50')
            }
        });
    }

    /**
     * Avanza a la siguiente diapositiva del carrusel.
     * Se incrementa el índice de la diapositiva actual ( currentSlide ) y muestra la siguiente diapositiva, ademas asegura que el carrusel vuelve al principio si es necesario, esta vuelve a la primera diapositiva usando el modulo %
     */
    const nextSlide = () => {
        currentSlide = ( currentSlide + 1 ) % slides.length;
        // Mostrar la nueva diapositiva 
        showSlide( currentSlide );
    }

    /**
     * Retrocede a la diapositiva anterior del carrusel.
     * Decrementa el índice de la diapositiva actual para mostrar la diapositiva anterior. Si está en la primera diapositiva, vuelve a la última.
     */
    const prevSlide = () => {
        currentSlide = ( currentSlide - 1 + slides.length ) % slides.length;
        // Mostrar la diapositiva anterior
        showSlide( currentSlide );
    }

    /**
     * Event listeners para los botones de navegación
     * Boton de la izquierda = prevSlide. Boton de la derecha = nextSlide.
     * Estos permiten al usuario moverse manualmente entre las diapositivas
     */
    document.getElementById('nextSlide').addEventListener('click', nextSlide );
    document.getElementById('prevSlide').addEventListener('click', prevSlide );


    /**
     * Configura la reproducción automática del carrusel cada 5 segundos.
     * @function setInterval
     */
    setInterval( nextSlide, 5000 );


    /**
     * Asigna eventos a cada indicador para navegar a la diapositiva correspondiente al hacer clic.
     */
    indicators.forEach(( indicator, index ) => {
        indicator.addEventListener('click', () => {
            // Actualiza el índice a la diapositiva correspondiente
            currentSlide = index;
            // Mostrar la diapositiva seleccionada 
            showSlide( index );
        });
    });
});