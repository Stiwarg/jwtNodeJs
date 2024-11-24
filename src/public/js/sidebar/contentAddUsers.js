import { createElement } from '../../utilities/createElementDocument.js';
import { isDarkMode } from '../../utilities/themeState.js';
// Variables de estado
let addUserSearchQuery = '';
let selectedUsers = [];

const allUsers = [
    { id: 1, name: 'Emma Watson', avatar: '/placeholder.svg?height=40&width=40&text=EW' },
    { id: 2, name: 'Liam Neeson', avatar: '/placeholder.svg?height=40&width=40&text=LN' },
    { id: 3, name: 'Scarlett Johansson', avatar: '/placeholder.svg?height=40&width=40&text=SJ' },
    { id: 4, name: 'Chris Hemsworth', avatar: '/placeholder.svg?height=40&width=40&text=CH' },
    { id: 5, name: 'Natalie Portman', avatar: '/placeholder.svg?height=40&width=40&text=NP' },
    { id: 6, name: 'Robert Downey Jr.', avatar: '/placeholder.svg?height=40&width=40&text=RD' },
    { id: 7, name: 'Jennifer Lawrence', avatar: '/placeholder.svg?height=40&width=40&text=JL' },
];

// Actualiza el boton de amistad sin volver a renderizar todo
const updateFriendButton = ( userId ) => {
    const userCard = document.querySelector(`[data-user-id="${ userId }"]`);
    
    if ( !userCard ) return; 
    const isSelected = selectedUsers.includes( userId );

    // Selecciona el botón y actualiza su estilo y contenido 
    const button = userCard.querySelector('button');

    if ( !button ) return;

    button.className = isSelected ? 'text-base font-medium bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition duration-300 flex items-center' : 'text-base font-medium bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition duration-300 flex items-center';

    button.innerHTML = isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Remove' : '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6 M10 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10 M19 16v6 M22 19h-6"></path></svg>Add Friend';
}

// Funciones para manejar solicitudes de amistad
// Eliminar solicitud de amistad
const removeFriendRequest = ( userId ) => {
    selectedUsers = selectedUsers.filter( id => id !== userId );
    updateFriendButton( userId );
}

// Enviar solicitud de amistad
const sendFriendRequest = ( userId ) => {
    console.log(`Sending friend request to user with ID: ${ userId }`);
    selectedUsers = [...selectedUsers, userId ];
    updateFriendButton( userId );
}

// Función para manejar el cambio de entrada en la barra de busqueda
const handleSearchChange = ( event ) => {
    addUserSearchQuery = event.target.value;
    //console.log('Nuevo valor de búsqueda:', addUserSearchQuery );
    //renderUsers();
}

const renderSearchInput = ( container ) => {
    const searchInputContainer = createElement('div', 'mb-6 relative');

    const searchInput = createElement(
        'input', 
        `w-full pl-10 pr-4 py-2 border ${ isDarkMode() ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
        '',
        {
        type: 'text',
        id: 'userSearchInput',
        placeholder: 'Search users...',
        }
    );
    searchInput.value = addUserSearchQuery;
    searchInputContainer.appendChild( searchInput );

    searchInputContainer.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 ${ isDarkMode() ? 'text-gray-400' : 'text-gray-400'}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    `;

    container.appendChild( searchInputContainer );

    // Evento para manejar la busqueda 
    if ( container ) {
        const inputSearch = container.querySelector('#userSearchInput');
        if ( inputSearch ) {
            inputSearch.oninput = ( e ) => {
                console.log('Evento input detectado:', e.target.value );
                handleSearchChange( e );
                updateUserList();
            }
        }
    }
}

const updateUserList = () => {
    const usersContainer = document.querySelector('.usersContainer');
    if( !usersContainer ) return;

    // Filtrar usuarios según el texto de búsqueda
    const filteredUsers = allUsers.filter( user => 
        user.name.toLowerCase().includes( addUserSearchQuery.toLowerCase() )
    );

    // Limpia y renderiza solo la lista de usuarios
    usersContainer.innerHTML = '';
    filteredUsers.forEach( user => {
        const userCard = createElement(
            'div',
            `${ isDarkMode() ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col items-center justify-center text-center`
        );

        userCard.setAttribute('data-user-id', user.id );

        const avatar = createElement('img','w-20 h-20 rounded-full mb-4',null, {
            src: user.avatar,
            alt: user.name,
        });

        userCard.appendChild( avatar );

        const name = createElement('h3', `${ isDarkMode() ? 'text-white' : 'text-gray-800' } font-semibold mb-2` , user.name );
        userCard.appendChild( name );

        const isSelected = selectedUsers.includes( user.id );
        const button = createElement('button', isSelected ? 'btn-addUser text-base font-medium bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition duration-300 flex items-center' : 'text-base font-medium bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition duration-300 flex items-center');
        button.innerHTML = isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Remove' : '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6 M10 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10 M19 16v6 M22 19h-6"></path></svg>Add Friend';
        
        
        button.onclick = ( event ) => {
            event.preventDefault();
            if (selectedUsers.includes(user.id)) {
                removeFriendRequest(user.id);
            } else {
                sendFriendRequest(user.id);
            }
        };

        updateFriendButton( user.id );
        userCard.appendChild( button );
        usersContainer.appendChild( userCard );

    })
}

const renderUsers = () => {
    const container = document.querySelector('.containerSub');
    if (!container) return; // Asegurarnos de que el contenedor existe

    console.log('Renderizando usuarios con filtro: ', addUserSearchQuery );
    container.innerHTML = '';

    const title = createElement('h2', `${ isDarkMode() ? 'text-white' : 'text-gray-800'} text-2xl font-semibold mb-6 transition-colors duration-300`, 'Add Users');
    container.appendChild( title );

    renderSearchInput( container );

    /*const searchInputContainer = createElement('div', 'mb-6 relative');
    const searchInput = createElement('input', `w-full pl-10 pr-4 py-2 border ${ isDarkMode() ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`);
    searchInput.type = 'text';
    searchInput.id = 'userSearchInput';
    searchInput.placeholder = 'Search users...';
    searchInput.value = addUserSearchQuery;
    console.log('Input encontrado:', searchInput);


    searchInputContainer.appendChild( searchInput );
    searchInputContainer.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 ${ isDarkMode() ? 'text-gray-400' : 'text-gray-400'}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    `;
    container.appendChild( searchInputContainer );

    if ( container ) {
        const searchInput = container.querySelector('input');
        if ( searchInput ) {
            searchInput.oninput = ( e ) => {
                console.log('Evento input detectado:', e.target.value );
                handleSearchChange( e );
            }
        }
    }
    */
    const usersContainer = createElement('div', 'usersContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
    const filteredUsers = allUsers.filter( user => user.name.toLowerCase().includes( addUserSearchQuery.toLowerCase() ));

    console.log('Usuarios filtrados:', filteredUsers );

    /*filteredUsers.forEach( user => {
        const userCard = createElement('div', `${ isDarkMode() ? 'bg-gray-700' : 'bg-white' } p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col items-center justify-center text-center `);
        userCard.setAttribute('data-user-id', user.id );
        const avatar = createElement('img', 'w-20 h-20 rounded-full mb-4');
        avatar.src = user.avatar;
        avatar.alt = user.name;
        userCard.appendChild( avatar );

        const name = createElement('h3', `${ isDarkMode() ? 'text-white' : 'text-gray-800' } font-semibold mb-2` , user.name );
        userCard.appendChild( name );

        const isSelected = selectedUsers.includes( user.id );
        const button = createElement('button', isSelected ? 'btn-addUser text-base font-medium bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition duration-300 flex items-center' : 'text-base font-medium bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition duration-300 flex items-center');
        button.innerHTML = isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Remove' : '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6 M10 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10 M19 16v6 M22 19h-6"></path></svg>Add Friend';
        button.onclick = ( event ) => {
            event.preventDefault();
            if (selectedUsers.includes(user.id)) {
                removeFriendRequest(user.id);
            } else {
                sendFriendRequest(user.id);
            }

        };

        // Actualiza el botón de cada usuario al renderizar
        updateFriendButton( user.id );
        userCard.appendChild( button );
        usersContainer.appendChild( userCard );
    });*/

    container.appendChild( usersContainer );

    updateUserList();
}

export default renderUsers;

