export const getElement = ( selector ) => {
    const element = document.querySelector( selector );
    if ( !element ) {
        console.error(`El elemento no fue encontrado ${ element }`);
        return null;
    }
    return element;
}