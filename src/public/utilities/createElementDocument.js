export const createElement = ( tag, className, textContent, attributes = {}) => {
    const element = document.createElement( tag );

    // Agregar clases 
    if ( className ) element.className = className;
    
    // Agregar contenido textual 
    if ( textContent ) element.textContent = textContent;

    // Agregar atributos adicionales 
    Object.keys( attributes ).forEach( attr => {
        element.setAttribute( attr, attributes[ attr ]);
    });

    return element;
}

