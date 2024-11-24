export let darkMode = false; // Estado compartido de tema oscuro
const listeners = []; // Lista de funciones que se ejecutarán en el cambio de tema 

export const toggleDarkMode = () => {
    darkMode = !darkMode;
    // Notificar a todos los escuchadores
    listeners.forEach( listener => listener( darkMode ));
}

// Funcion de flecha que actua como un getter para el estado de darkMode. Su proposito es proporcionar una forma de acceder al valor actual de darkMode.
export const isDarkMode = () => darkMode;

// Permitir a otros scripst registrar funciones para ejecutarse en cambios de tema 
export const onDarkModeChange = ( listener ) => {
    listeners.push( listener );
}