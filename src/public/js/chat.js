import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

// Obtener el token de la cookie ( Usando document.cookie )
const getCookie = ( name ) => {
    //  Esta variable contiene todas las cookies del documento precedidas por un punto y coma, esto facilita la busqueda de una cookie en especifica.
    const value = `; ${ document.cookie }`;
    // para dividir la cadena de cookies en dos partes utilizando el nombre de la cookie que se está buscando (name) seguido de = como delimitador.
    const parts = value.split(`; ${name}=`);
    // Si la cookie existe, el método pop() toma la última parte del array (que contiene el valor de la cookie).
    //Luego, se llama a split(';') para dividir el valor de la cookie en caso de que haya otras cookies o información adicional después del valor de esta cookie (en caso de que otras cookies sigan en la cadena).
    //Finalmente, se llama a shift() para obtener el primer elemento del array, que es el valor real de la cookie.
    if ( parts.length === 2 ) return parts.pop().split(';').shift();
    // Si la cookie no existe se devuelve null
    return null;
}

const token = getCookie('access_token');
console.log("estas son las cookies: " , document.cookie );

console.log("Este es el token", token );

const socket = io({
    auth: {
        token, // Enviar el token obtenido de la cookie
        serverOffset: 0 
    }
});

// Capturar el formulario
const chatForm = document.getElementById('form'); // chat-form
const messageInput = document.getElementById('input'); // message
const messagesList = document.getElementById('messages'); // messages

chatForm.addEventListener('submit', ( e ) => {
    // Evitar el comportamiento por defecto de recargar la página
    console.log("holaaa");
    e.preventDefault();

    const message = messageInput.value;

    console.log( message );

    if ( !message || message.trim() === '') {
        alert('Por favor, escribe un mensaje antes de enviar.');
        return;
    }
    // Enviar el mensaje al servidor
    console.log('llega hasta aca');
    socket.emit('chat message', { message });
    console.log('paso el chat message');

    // Limpiar el campo de mensaje
    messageInput.value = '';
});

// Escuchar los mensajes del servidor 
/*socket.on('chat message', ( msg ) => {
    const item = document.createElement('li');
    item.textContent = `${ msg.username}: ${ msg.message }`;
    messagesList.appendChild( item );
});*/
console.log("bandera 24");
socket.on('chat message', ( msg, serverOffset, username ) => {
    console.log("msg: ", msg);
    console.log("bandera 25");

    console.log("tu nombre:",username );
    const item = `
        <li>
            <p>${ msg.message }</p>
            <small>${ msg.username }</small>
        </li>
    `;

    console.log("El item: ", item);

    // Insertar el mensaje en el contenedor de mensajes
    messagesList.insertAdjacentHTML('beforeend', item );

    // Guardar el serverOffset en una nueva propiedad personalizada
    socket.serverData = { serverOffset };

    // Asegurarse de que el scroll esté siempre en el último mensaje
    messagesList.scrollTop = messagesList.scrollHeight;

});