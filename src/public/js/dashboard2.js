import { friendRequests, updateNotificationBadge } from './sidebar/contentFriendRequest.js';
import { createElement } from '../utilities/createElementDocument.js';
import { toggleDarkMode, onDarkModeChange, isDarkMode } from '../utilities/themeState.js';
import { createSectionProfile } from './profile/modal/createProfileModal.js';
import { initializeProfileModal } from './profile/modalFeatures/profileModal.js';
import { initializeNotificationModal } from './notification/notificationFeatures/notificationModal.js';

// DOM Elements
const app = document.getElementById('app');
const sidebar = document.createElement('div');
const mainContent = document.createElement('div');

// State = ( Estados ) Definición de las variables booleanas que controlan el estado de la interfaz
let sidebarExpanded = true; // Controla si la barra lateral esta expandida o colapsada.
let activeContactsExpanded = false; // Controla si la lista de contactos activos esta visible o no.
let settingsMenuOpen = false; // Indica si el menu de configuraciónes está abierto.
let showUserName = false; // Muestra u oculta el nombre de usuario en la interfaz.
let activeCategory = null; // Variable para rastrear la categoia activa
let isInSubContent = false; // Indica si estamos en una seccion específica
// Data = Se crea la información necesaria para poblar la UI
const currentUser = { // Objeto que contiene el nombre y el avatar del usuario actual.
    name: '<%= username %>',
    avatar: '/placeholder.svg?height=40&width=40&text=JD'
};

const iconsMoonSun = {
    
    moon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
        
    sun: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
        
};

// Chats recientes con detalles como el nombre del contacto, avatar último mensaje.
const recentChats = [
    { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=50&width=50&text=AJ', lastMessage: 'See you tomorrow!' },
    { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=50&width=50&text=BS', lastMessage: 'Thanks for the help!' },
    { id: 3, name: 'Carol Williams', avatar: '/placeholder.svg?height=50&width=50&text=CW', lastMessage: 'How about lunch?' },
];

// Chats no leidos con detalles como el nombre del contacto, avatar, conteo de mensajes no leidos.
const unreadChats = [
    { id: 4, name: 'David Brown', avatar: 'placeholder.svg?height=50&width=50&text=DB', lastMessage: 'Can we schedule a meeting?', unreadCount: 3 },
    { id: 5, name: 'Eva Green', avatar: '/placeholder.svg?height=50&width=50&text=EG', lastMessage: 'I ve sent you the files', unreadCount: 1 },    
];

const nameQuickActions = [
    'New Chat',
    'Create Group',
    'Scheduled Call',
    'Shared Files'
];

// Categorias disponibles en la barra lateral ( Chats, grupos, llamadas, video )
const categories = [
    { icon: 'message-square', name: 'Chats', contentPath: '../js/sidebar/contentAddUsers.js'},
    { icon: 'users', name: 'Groups', contentPath: '../js/sidebar/contentAddUsers.js' },
    { icon: 'phone', name: 'Calls ', contentPath: '../js/sidebar/contentAddUsers.js' },
    { icon: 'video', name: 'Video', contentPath: '../js/sidebar/contentAddUsers.js' },
    { icon: 'user-round-plus', name: 'add user', contentPath: '../js/sidebar/contentAddUsers.js' },
    { icon: 'user-minus', name: 'Friend Requests', contentPath: '../js/sidebar/contentFriendRequest.js' },
];

// Lista de contactos activos,con su nombre, avatar y estado 
const activeContacts = [
    { id: 1, name: 'Emma Watson', avatar: '/placeholder.svg?height=40&width=40&text=EW', status: 'active' },
    { id: 2, name: 'Liam Neeson', avatar: '/placeholder.svg?height=40&width=40&text=LN', status: 'active' },
    { id: 3, name: 'Scarlett Johansson', avatar: '/placeholder.svg?height=40&width=40&text=SJ', status: 'active' },
    { id: 4, name: 'Chris Hemsworth', avatar: '/placeholder.svg?height=40&width=40&text=CH', status: 'active' },
    { id: 5, name: 'Natalie Portman', avatar: '/placeholder.svg?height=40&width=40&text=NP', status: 'active' },
];


const toggleDarkModeHandler = () => {
    toggleDarkMode();
    updateTheme();
    updateSettingsMenu();
}

// Barra lateral
const toggleSidebar = () => {
    sidebarExpanded = !sidebarExpanded;
    updateSidebar();
}

// Lista de contactos activos
const toggleActiveContacts = () => {
    activeContactsExpanded = !activeContactsExpanded;
    updateActiveContacts();
}

// Menú de configuraciones 
const toggleSettingsMenu = () => {
    settingsMenuOpen = !settingsMenuOpen; // Alternar estado del menú
    updateSettingsMenu(); // Actualizar el menú de configuración 
    console.log( settingsMenuOpen );
}
// nombre de usurio 
const toggleUserName = () => {
    showUserName = !showUserName;
    updateUserName();
}

const handleLogout = () => {
    console.log('Logging out');
}

// Iconos
const getIconPath = ( icon ) => {
    const paths = {
        'message-square': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
        'users': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
        'phone' : 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
        'video' : 'M23 7l-7 5 7 5V7z M16 3H1v18h15V3z',
        'user-round-plus': 'M2 21a8 8 0 0 1 13.292-6 M10 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10 M19 16v6 M22 19h-6',
        'user-minus': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8 M22 11H16'
    };
    
    return paths[icon] || '';
}

// Encapsulamiento del menu del contenido de ajustes
const getSettingsMenuContent = () => {
    return `
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button id="toggleDarkModeBtn" class="${ isDarkMode() ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} group flex items-center w-full px-4 py-2 text-sm"
            data-dark-class="text-gray-300 hover:bg-gray-600 group flex items-center w-full px-4 py-2 text-sm" 
            data-light-class="text-gray-700 hover:bg-gray-100 group flex items-center w-full px-4 py-2 text-sm">
                ${ isDarkMode() ? iconsMoonSun.sun : iconsMoonSun.moon }
                ${ isDarkMode() ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button id="logoutBtn" class="${ isDarkMode() ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} group flex items-center w-full px-4 py-2 text-sm"
            data-dark-class="text-gray-300 hover:bg-gray-600 group flex items-center w-full px-4 py-2 text-sm" 
            data-light-class="text-gray-700 hover:bg-gray-100 group flex items-center w-full px-4 py-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg> 
                Logout
            </button>
        </div>
    `;
}

// Función para actualizar el contenido principal según la categoria seleccionada
const loadCategoryContent = async ( category ) => {

    const subContainer = mainContent.querySelector('.containerSub');
    subContainer.innerHTML = '';
    activeCategory = category;
    isInSubContent = true;    

    try {
        const module = await import( category.contentPath );
        module.default();
    } catch (error) {
        console.error('Error al cargar el contenido de la categoria:', error );
        subContainer.innerHTML = `<p class="text-red-500">Error al cargar el contenido.</p>`;
    }
    
    // Aplicar estilos de tema después de cargar el contenido
    applyThemeStyles( subContainer );
    applyThemeToAll();
    updateSettingsMenu();

}

// Creacion de la barra lateral con la informacion 
const createSidebar = () => {
    sidebar.className = `${ sidebarExpanded ? 'w-1/4' : 'w-16'} ${ isDarkMode() ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300 ease-in-out`;
    sidebar.innerHTML = '';

    const header = createElement('div', 'p-4 flex items-center justify-between');
    // Boton del menu 
    const toggleButton = createElement('button', `p-2 rounded-full ${ isDarkMode() ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`);
    toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

    // aqui falta algo
    toggleButton.onclick = toggleSidebar;
    header.appendChild( toggleButton );
    
    // Barra lateral
    if ( sidebarExpanded ) {
        const title = createElement('div', `text-3xl font-bold cursor-pointer ${ isDarkMode() ? 'text-white' : 'text-gray-800'}`);
        title.textContent = 'Chats';
        title.onclick = () => updateMainContent();
        header.appendChild( title );
    }

    sidebar.appendChild( header );

    if ( sidebarExpanded ) {
        const categoriesContainer = createElement('div', 'px-4 pb-4 space-y-4');
        categories.forEach( category => {
            const categoryElement = createElement('div',`flex items-center p-3 rounded-xl ${ isDarkMode() ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-pointer`);
            categoryElement.innerHTML = `
                <div class="mr-4 ${ isDarkMode() ? 'text-blue-400' : 'text-blue-500'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${getIconPath(category.icon)}"></path></svg>
                </div>
                <span class="font-medium ${ isDarkMode() ? 'text-gray-200' : 'text-gray-700'}">${ category.name }</span>
            `;

            if ( category.name === 'Friend Requests' && friendRequests.length > 0 ) {
                const notifationBadge = createElement('span', 'notificationBadge ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full', friendRequests.length );
                categoryElement.appendChild( notifationBadge );
            }

            categoryElement.onclick = () => loadCategoryContent( category );
            categoriesContainer.appendChild( categoryElement );
        });

        // Boton de contactos activos
        const activeContactsButton = createElement('button', `btn-active-contacts flex items-center justify-between w-full p-3 rounded-xl ${ isDarkMode() ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`);
        activeContactsButton.innerHTML = `
            <span class="font-semibold">Active Contacts</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${activeContactsExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline></svg>
        `;

        activeContactsButton.onclick = toggleActiveContacts;
        categoriesContainer.appendChild( activeContactsButton );

        const activeContactsList = createElement('div', `mt-2 space-y-3 ${ activeContactsExpanded ? '' : 'hidden' }`);
        activeContactsList.id = 'activeContactsList';
        activeContacts.forEach( contact => {
           const contactElement = createElement('div', `flex items-center p-2 rounded-lg ${ isDarkMode() ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-pointer`);
           contactElement.innerHTML = `
           <div class="relative">
                <img src="${ contact.avatar }" alt="${ contact.name }" class="w-10 h-10 rounded-full">
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
           </div>
           <span class="ml-3 font-medium ${ isDarkMode() ? 'text-gray-200' : 'text-gray-700'}">${ contact.name }</span>
           `;
           
           activeContactsList.appendChild( contactElement );
        });

        categoriesContainer.appendChild( activeContactsList );
        sidebar.appendChild( categoriesContainer );
    }

    updateNotificationBadge();
}

// Creacion del contenido principal
const createMainContent = () => {

    mainContent.className = `contentMain flex-1 p-4 md:p-8 ${ isDarkMode() ? 'bg-gray-800' : 'bg-white' }`;
    mainContent.innerHTML = '';

    // Crear encabezado
    const header = createHeader();
    mainContent.appendChild( header );

    isInSubContent = false;
    activeCategory = null;
    // Crear el menú de configuración 
    const settingsMenu = createSettingsMenu();
    mainContent.appendChild( settingsMenu );
    updateSettingsMenu();
    

    // Crear sección de chat
    const subContainer = createElement('div', `containerSub  ${ isDarkMode() ? 'bg-gray-800' : 'bg-white' }`);

    subContainer.setAttribute('data-dark-class','containerSub bg-gray-800');
    subContainer.setAttribute('data-light-class','containerSub bg-white');

    subContainer.appendChild( createChatSection('Unread Chats', unreadChats ));
    subContainer.appendChild( createChatSection('Recent Chats', recentChats ));

    // Crear botones de acciones 
    const quickActions = createQuickActions();
    subContainer.appendChild( quickActions );

    // Aplicar los estilos de tema a todos los elementos que necesites 
    applyThemeToAll();
    mainContent.appendChild( subContainer );

}

const createHeader = () => {

    const header = createElement('div', 'flex justify-between items-center mb-8');
    
    const searchContainer = createSearchInput();
    header.appendChild( searchContainer );

    const actionsButtons = createActionsButtons();
    header.appendChild( actionsButtons );
    
    return header;
}

const createSearchInput = () => {
    const searchContainer = createElement('div', 'containerSearch relative flex-1 max-w-md');
    const searchInput = createElement('input', `searchInput w-full pl-10 pr-4 py-2 border ${ isDarkMode() ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`, null,{
        type: 'text',
        placeholder: 'Search chats...',
        'data-dark-class': 'searchInput w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'data-light-class' : 'searchInput w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    });
    searchContainer.appendChild( searchInput );

    searchContainer.innerHTML += `
        <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" data-dark-class="text-gray-400" data-light-class="" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    `;

    return searchContainer;
}

const createActionsButtons = () => {
    const actionsButtons = createElement('div', 'actionsButtons flex items-center space-x-4 ml-4');
    actionsButtons.innerHTML = `
        <button id="toggleUserNameBtn" class="p-2 ${ isDarkMode() ? 'bg-gray-700' : 'bg-gray-100'} rounded-full" 
        data-dark-class="p-2 bg-gray-700 rounded-full"
        data-light-class="p-2 bg-gray-100 rounded-full">
            <img src="${ currentUser.avatar }" alt="${ currentUser.name }" class="w-8 h-8 rounded-full">
        </button>

        <span id="userName" class="font-medium ${ isDarkMode() ? 'text-white' : 'text-gray-800'} ${ showUserName ? '' : 'hidden'}" data-dark-class="font-medium text-white ${ showUserName ? '' : 'hidden' }"
        data-light-class="font-medium text-gray-800 ${ showUserName ? '' : 'hidden' }">${ currentUser.username }</span>

        <button id="toggleNotificationBtn" class="p-2 ${ isDarkMode() ? 'bg-gray-700' : 'bg-gray-100'} rounded-full transition-colors duration-300 relative" 
        data-dark-class="p-2 bg-gray-700 rounded-full transtion-colors duration-300 relative" 
        data-light-class="p-2 bg-gray-100 rounded-full transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>

        <button id="toggleSettingsBtn" class="p-2 ${ isDarkMode() ? 'bg-gray-700' : 'bg-gray-100'} rounded-full" 
        data-dark-class="p-2 bg-gray-700 rounded-full" 
        data-light-class="p-2 bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2  2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
    `;

    // Añadir el eventListener de forma explícita 
    return actionsButtons;
}

const createSettingsMenu = () => {
    const settingsMenu = createElement('div', `settingsMenu absolute right-0 mr-36 -mt-6 w-48 rounded-md shadow-lg ${ isDarkMode() ? 'bg-gray-700' : 'bg-white' } ring-1 ring-black ring-opacity-5 ${ settingsMenuOpen ? '' : 'hidden'} z-[1000]`,
    {   'data-dark-class': `settingsMenu absolute right-0 mr-36 -mt-6 w-48 rounded-md shadow-lg bg-gray-700 ring-1 
                            ring-black ring-opacity-5 ${ settingsMenuOpen ? '' : 'hidden' } z-[1000]`, 
        'data-light-class': `settingsMenu absolute right-0 mr-36 -mt-6 w-48 rounded-md shadow-lg bg-white ring-1 
                            ring-black ring-opacity-5 ${ settingsMenuOpen ? '' : 'hidden' } z-[1000]`
    });
    settingsMenu.id = 'settingsMenu';
    settingsMenu.innerHTML = getSettingsMenuContent();
    applyThemeStyles( settingsMenu );
    return settingsMenu;
}

const createChatSection = ( title, chats ) => {
    const section = createElement('div', 'mb-12');
    section.innerHTML = `<h2 class="text-2xl font-semibold ${ isDarkMode() ? 'text-white' : 'text-gray-800'} mb-6" 
    data-dark-class="text-white" 
    data-light-class="text-gray-800">${ title }</h2>`;
    const chatGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-6');
    chats.forEach(( chat, index ) => {
        const chatElement = createElement('div', `${ isDarkMode() ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer relative opacity-0`, {
        'data-dark-class': 'bg-gray-700', 
        'data-light-class': 'bg-white'
        });
        chatElement.innerHTML = `
            <div class="flex items-center">
                <img src="${ chat.avatar }" alt="${ chat.name }" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h3 class="font-semibold ${ isDarkMode() ? 'text-white' : 'text-gray-800'}"
                    data-dark-class="text-white"
                    data-light-class="text-gray-800">${ chat.name }</h3>
                    <p class="${ isDarkMode() ? 'text-gray-300' : 'text-gray-600'} text-sm"
                    data-dark-class="bg-gray-300" 
                    data-light-class="bg-gray-600">${ chat.lastMessage }</p>
                </div>
            </div>
            ${ chat.unreadCount ? `<div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">${ chat.unreadCount}</div>` : ''}
        `;
        chatGrid.appendChild( chatElement );

        // Add animation
        // targets : objetos, opacity : opacidad, easing : suavizado 
        anime({
            targets: chatElement,
            opacity: [0,1],
            translateY: [20, 0],
            delay: index * 100,
            easing: 'easeOutQuad' 
        });
    });
    section.appendChild( chatGrid );
    return section;
}

const createQuickActions = () => {
    const quickActions = createElement('div', 'mt-12');
    quickActions.innerHTML = `<h2 class="text-2xl font-semibold ${ isDarkMode() ? 'text-white' : 'text-gray-800'} mb-6"
    data-dark-class="text-white" 
    data-light-class="text-gray-800">Quick Actions</h2>`;
    const actionGrid = createElement('div', 'grid grid-cols-2 md:grid-cols-4 gap-4');
    nameQuickActions.forEach(( action, index ) => {
        const actionElement = createElement('div', `${ isDarkMode() ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} p-6 rounded-xl text-white text-center cursor-pointer opacity-0`, 
        {
            'data-dark-class': 'bg-gradient-to-r from-blue-600 to-purple-600', 
            'data-light-class': 'bg-gradient-to-r from-blue-500 to-purple-500'
        });
        actionElement.innerHTML = `<h3 class="font-semibold">${ action }</h3>`;
        actionGrid.appendChild( actionElement );

        anime({
            targets: actionElement,
            opacity: [ 0, 1],
            scale: [ 0.9, 1],
            delay: index * 100,
            easing: 'easeOutQuad'
        });
    });

    quickActions.appendChild( actionGrid );

    return quickActions;
}

// Actualizar Contactos activos
const updateActiveContacts = () => {
    const activeContactsList = document.getElementById('activeContactsList');
    if ( activeContactsList ) {
        activeContactsList.classList.toggle('hidden', !activeContactsExpanded );
    }

    const activeContactsButton = sidebar.querySelector('.btn-active-contacts');
    if ( activeContactsButton ) {
        activeContactsButton.innerHTML = `
            <span class="font-semibold">Active Contacts</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${ activeContactsExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline></svg>
        `;
    }
}

// Actualizar el menú de configuración 
const updateSettingsMenu = () => {
    const settingsMenu = document.getElementById('settingsMenu');
    if ( settingsMenu ) {
        settingsMenu.innerHTML = getSettingsMenuContent();
        applyThemeStyles( settingsMenu );
        // Actualizamos las clases según el tema actual
        settingsMenu.classList.toggle('bg-gray-700', isDarkMode());
        settingsMenu.classList.toggle('bg-white', !isDarkMode());
                
        // Aseguramos que el menú de configuración esté visible
        settingsMenu.classList.toggle('hidden', !settingsMenuOpen);
                
        settingsMenu.classList.toggle('hidden', !settingsMenuOpen );
        
        // Add event listeners for buttons inside the settings menu
        document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkModeHandler);
        document.getElementById('toggleUserNameBtn').addEventListener('click', toggleUserName);
        document.getElementById('toggleSettingsBtn').addEventListener('click', toggleSettingsMenu );
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    }
}

// Actualizar Tema
const updateTheme = ( ) => {
    // Cambiar la clase del body para activar el modo oscuro globalmente 
    document.body.classList.toggle('dark', isDarkMode() );

    // Actualizar la clase del contenedor principal de la aplicación
    app.className = `min-h-screen ${ isDarkMode() ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 to-blue-100' } p-4 md:p-8`;
    applyThemeStyles( app );// Aplicar tema al contenedor principal

    //app.className = `min-h-screen ${ isDarkMode() ? 'bg-gray-900' : 'bg-grandient-to-br from-purple-100 to-blue-100'} p-4 md:p-8`;
    const container = app.querySelector('.containerMain');
    if ( container ) {
        container.className = `containerMain max-w-6xl mx-auto ${ isDarkMode() ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl overflow-hidden`;
        applyThemeStyles( container );
    }

    mainContent.classList.toggle('bg-gray-800', isDarkMode() );
    mainContent.classList.toggle('bg-white', !isDarkMode() );


    const subContainer = mainContent.querySelector('.containerSub');
    if ( subContainer ) applyThemeStyles( subContainer );     
    

    applyThemeToAll();
    updateSidebar();    
    
    if ( isInSubContent && activeCategory ) {
        loadCategoryContent( activeCategory );
    } else {
        updateMainContent();
    }


}


// Actualizar la barra lateral 
const updateSidebar = () => {
    createSidebar();
}

// actualizar Contenido principal
const updateMainContent = () => {
    createMainContent();
}
// Función para aplicar estilos del tema al contenido dinamico
const applyThemeStyles = ( element ) => {
    //element.classList.toggle('bg-gray-800', isDarkMode() );
    //element.classList.toggle('bg-white', !isDarkMode() );
    if ( !element ) return;

    const darkClass = element.getAttribute('data-dark-class');
    const lightClass = element.getAttribute('data-light-class');

    if ( darkClass && lightClass ) {
        element.className = isDarkMode() ? darkClass : lightClass;
    }
}

// Función que aplica los estilos del tema a todos los elementos que contiene data-dark-class y data-light-class
const applyThemeToAll = () => {
    document.querySelectorAll('[data-dark-class][data-light-class]').forEach( applyThemeStyles );
}

//  Actualizar nombre
const updateUserName = () => {
    const userNameElement = document.getElementById('userName');
    if ( userNameElement ) {
        userNameElement.classList.toggle('hidden', !showUserName );
    }
}

const initializeApp = async () => {
    app.innerHTML = '';
    const container = createElement('div', `containerMain max-w-6xl mx-auto ${ isDarkMode() ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl overflow-hidden`);
    const content = createElement('div', 'flex');

    createSidebar();
    createMainContent();

    content.appendChild( sidebar );
    content.appendChild( mainContent );
    container.appendChild( content );
    app.appendChild( container );
    await initializeProfileModal();
    await initializeNotificationModal();
    //applyThemeToAll();
    // Add event listeners 
    document.getElementById('toggleUserNameBtn').addEventListener('click', async () => {
        toggleUserName();
    });
    document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('toggleSettingsBtn').addEventListener('click', toggleSettingsMenu );
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

onDarkModeChange(() => {
    updateTheme();
    updateSettingsMenu();
})

initializeApp();
