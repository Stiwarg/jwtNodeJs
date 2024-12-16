export const getElement = ( selector ) => {
    const element = document.querySelector( selector );
    if ( !element ) {
        console.error(`El elemento no fue encontrado ${ selector } no fue encontrado `);
        return null;
    }
    return element;
}

export const getElements = ( selector ) => {
    const elements = document.querySelectorAll( selector );
    if ( elements.length === 0 ) {
        console.warn(`Nos se encontraron elementos con el selector: '${ selector }' en el contexto proporcionado. `);
    }

    return elements;
}