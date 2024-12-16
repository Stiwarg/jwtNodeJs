import { createElement } from '../../../utilities/createElementDocument.js';
import { getElement, getElements } from '../../../utilities/queryDocument.js';
import { isDarkMode } from '../../../utilities/themeState.js';
import { createSectionNotification } from '../modal/createNotificationModal.js';

export const initializeNotificationModal = async () => {
    const main = getElement('.containerMain');
    const modalNotification = await createSectionNotification();
    const subModal = modalNotification.querySelector('.modalSub');

    main.appendChild( modalNotification );

    let activeFilter = 'all';

    const notifications = [
        { id: 1, type: 'message', title: 'Nuevo mensaje', message: 'Alice: ¿Podemos reunirnos mañana?', time: '2 min', read: false },
        { id: 2, type: 'friend', title: 'Solicitud de amistad', message: 'Bob quiere ser tu amigo', time: '1 hora', read: false },
        { id: 3, type: 'reminder', title: 'Recordatorio', message: 'Reunión de equipo de 30 minutos', time: '25 min', read: true },
        { id: 4, type: 'update', title: 'Actualización de grupo', message: 'Carol cambio el nombre del grupo a "Proyecto X"', time: '3 horas', read: true },
        { id: 5, type: 'message', title: 'Nuevo mensaje', message: 'Tony: Hola!!!!', time: '6 horas', read: false },
    ];

    const getNotificationIcon2 = {
        message: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',

        friend: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>',

        reminder: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',

        update: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>'
    };

    const notificationActions = {
        message: ( notification ) => {
            console.log('Abrir chat con:', notification.message.split(':')[0]);
        },

        friend: ( notification ) => {
            console.log('Abrir solicitud de amistad de:', notification.message.split(' ')[0]);
        },
        reminder: ( notification ) => {
            console.log('Abrir detalles del recordatorio:', notification.message );
        },
        update: ( notification ) => {
            console.log('Mostrar detalles de la actualización:', notification.message  );
        },
        default: ( notification ) => {
            console.log('Acción no definida para:', notification.type );
        }
    }

    const getNotificationColor2 = ( type ) => {
        const colors = {
            message: 'blue',
            friend: 'green',
            reminder: 'yellow',
            update: 'purple',
            default: 'gray',
        };

        const color = colors[ type ] || colors.default;        
        return {
            containerBg: `bg-${ color }-900 dark:bg-${ color }-100`, // Fondo del circulo
            iconColor: `text-${ color }-300 dark:text-${ color }-500`, // Color del icono
        };
    }
      
    // Solo es necesario pasar el objeto de notificacion para que realice los cambios 
    const handleNotificationAction2 = ( notification ) => {
        const action = notificationActions[ notification.type ] || notificationActions.default;
        action( notification )
    }

    const toggleNotificationBtn = getElement('#toggleNotificationBtn');

    const notificationPopover = getElement('#notification-popover');
    const notificationsContainer = getElement('#notification-list');
    const noNotificationsInList = getElement('#no-notifications');
    const markAllReadButton = getElement('#mark-all-read');
    const tabs = getElements('.tab');

    // Renderizar las notificaciones en el DOM
    const renderNotifications = () => {
        notificationsContainer.innerHTML = '';
        const filteredNotifications = notifications.filter( ( notificacion ) => 
            activeFilter === 'all'
                ? true
                : activeFilter === 'unread'
                ? !notificacion.read 
                : notificacion.type === activeFilter
        );

        if ( filteredNotifications.length === 0 ) {
            noNotificationsInList.classList.toggle('hidden');
            return;
        }

        filteredNotifications.forEach( ( notificacion ) => {
            const notificacionDiv = createElement('div', 
                `relative flex items-start space-x-3 p-4 rounded-md border-b 
                ${ notificacion.read ? 'opacity-60' : '' } 
                ${ isDarkMode() ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'} transition-colors duration-200`,'',{
                    id: `notification-modal-${ notificacion.id }`
                });
            const { containerBg, iconColor } = getNotificationColor2( notificacion.type );
            notificacionDiv.innerHTML = `
                <div class="containerIcon w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${ containerBg }">
                    <svg class="h-6 w-6 ${ iconColor }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">                    
                        ${ getNotificationIcon2[ notificacion.type ] || '' }
                    </svg>
                </div>
                <div  class="flex-grow relative">
                    <div class="flex justify-between items-center">
                        <h4 class="font-semibold text-base">${ notificacion.title }</h4>
                        <span class="text-xs text-gray-400">${ notificacion.time }</span>
                    </div>
                    <p>${ notificacion.message }</p>
                    <div class="containerMainDropdown-menu flex justify-end space-x-2 mt-2">
                        <button id="dropdown-menu-btn-${ notificacion.id }" class= "dropdown-menu-btn h-8 w-8 p-0 rounded-full flex items-center justify-center ${ isDarkMode() ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800' }">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                    </div>
                </div>
            `;

            const dropdownMenu = createElement('div',`.dropdown-menu hidden absolute right-0 mr-8 top-60 w-48 rounded-md shadow-lg border z-[9999] ${ isDarkMode() ? 'bg-gray-800 border-gray-800' : 'border-gray-200 bg-white ' }`, '', {
                id: `dropdown-menu-${ notificacion.id }`
            });

            dropdownMenu.innerHTML = `
                <ul class="p-1">
                    <li>
                        <button id="handleNotificationAction-btn-${ notificacion.id }" class="handleNotificationAction-btn block w-full text-left px-4 py-2 text-sm  ${ isDarkMode() ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}" data-type="${ notificacion.type }" data-id="${ notificacion.id }">
                            Ver detalles
                        </button>
                    </li>
                    <li>
                        <button id="mark-read-btn-${ notificacion.id }" class="mark-read-btn block w-full text-left px-4 py-2 text-sm  ${ isDarkMode() ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}" data-type="${ notificacion.type }" data-id="${ notificacion.id }">
                            ${ notificacion.read ? 'Marcar como no leída' : 'Marcar como leída' }
                        </button>
                    </li>
                    <li>
                        <button id="deleteNotification-btn-${ notificacion.id }" class="deleteNotification-btn block w-full text-left px-4 py-2 text-sm  ${ isDarkMode() ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}" data-type="${ notificacion.type }" data-id="${ notificacion.id }">
                            Eliminar notificación
                        </button>
                    </li>
                </ul>
            `;

            //main.appendChild( dropdownMenu );

            //notificacionDiv.appendChild( dropdownMenu );

            anime({
                targets: notificacionDiv, // Elemento objetivo de la animación 
                opacity: [ 0, 1], // Cambia la opacidad de 0 a 1 ( aparece gradualmente )
                translateY: [ -50, 0 ], // se mueve desde -50px hacia su posicion inicial ( apareciendo de arriba hacia abajo )
                duration: 250, // Duración de la animación en milisegundos 
                easing: 'easeOutQuad' // Tipo de aceleración para un efecto suave
            });
            notificationsContainer.appendChild( notificacionDiv );
            notificationsContainer.appendChild( dropdownMenu );
            
            const dropdownButton =  getElement(`#dropdown-menu-btn-${ notificacion.id } `);
            const handleNotificationActionBtn = getElement(`#handleNotificationAction-btn-${ notificacion.id }`);
        

            const deleteNotificationBtn = getElement(`#deleteNotification-btn-${ notificacion.id }`);

            dropdownButton.addEventListener('click', ( event ) => {
                toggleDropdownMenu( event, notificacion.id );
                //const menu = getElement(`#dropdown-menu-${ notificacion.id }`);
                //adjustDropdownPosition( menu, dropdownButton );
            });

            handleNotificationActionBtn.addEventListener('click', ( ) => {
                //const type = event.currentTarget.dataset.type;
                //const id = event.currentTarget.dataset.id;
                handleNotificationAction2( notificacion );
            });

            deleteNotificationBtn.addEventListener('click',( event ) => {
                deleteNotification( notificacion.id, event );
            });
            
        });
        
    }

    // Función parra abrir/ cerrar el dropdown
    const toggleDropdownMenu = ( event, notificationId ) => {
        const allMenus = getElements('.dropdown-menu');
        allMenus.forEach( ( menu ) => menu.classList.add('hidden') );

        const menu = getElement(`#dropdown-menu-${ notificationId }`); 
        const button = getElement(`#dropdown-menu-btn-${ notificationId }`); // Botón que activó el menú
        const scrollContainer = getElement('.notificationScroll');

        console.log('este objeto es :', menu );
        const isOpen = !menu.classList.contains('hidden');
        if ( !isOpen ) {

            menu.classList.remove('hidden');
            // Rectángulos de posición
            const containerRect = scrollContainer.getBoundingClientRect(); // Contenedor con scroll ( scrollNotifications )
            const buttonRect = button.getBoundingClientRect(); // Posición del botón
            const menuRect = menu.getBoundingClientRect(); // Tamaño del menú desplegable

            // Scroll actual del contenedor 
            const scrollOffset = scrollContainer.scrollTop;

            //  Calcula el espacio arriba y abajo relativo el contenedor
            const spaceBelow = containerRect.bottom - buttonRect.bottom; // Espacio debajo del botón
            const spaceAbove = buttonRect.top - containerRect.top; // Espacio encima del botón

            // Calcula la posición del menú dentro del contendor con scroll
            if ( spaceBelow < menuRect.height && spaceAbove >= menuRect.height ) {
                // No cabe hacia abajo, posicionarlo arriba
                menu.style.top = `${ button.offsetTop - menuRect.height + scrollOffset}px`;
                console.log('Esta es la posicion de que si no cabe hacia abajo: ', menu.style.top );
            } else {
                // Posición por defecto, debajo del botón
                menu.style.top = `${ button.offsetTop + button.offsetHeight + scrollOffset }px`;
                console.log('Esta es la posicion por defecto del menu:', menu.style.top);
            }

            //menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
        event.stopPropagation(); // Evita el cierre automático al hacer clic dentro del menu
    }
    
    // Eliminación de una notificacion de la lista
    const deleteNotification = ( id ) => {
        // Encuentra el índice de la notificación
        const index = notifications.findIndex( ( notification ) => notification.id  === id );
        if ( index !== -1 ) { 
            // Elimina la notificación del arreglo
            notifications.splice( index, 1 )
            const notificationElement = notificationsContainer.querySelector(`#notification-modal-${ id }`);

            if ( notificationElement ) {
                // aplica una animación de salida antes de eliminar
                anime({
                    targets: notificationElement, // Objetivo de la animación
                    opacity: [1, 0], // Cambia la opacidad de 1 a 0 ( desaparece )
                    height: [ notificationElement.offsetHeight, 0], // Cambia la altura del elemento a 0 (colapsa)
                    duration: 300, // Duración de la animación en milisegundos 
                    easing: 'easeInQuad', // Tipo de curva de animación ( Empieza lento y se acelera hacia al final )
                    complete: () => { // Función que se ejecuta al finalizar la animación
                        //Elimina el nodo del DOM
                        notificationElement.remove();
                        if ( notifications.length === 0 ) {
                            noNotificationsInList.classList.remove('hidden');
                        }
                    },
                });
            }
        };


        //renderNotifications(); 
    }

    // Cambiar el filtro de notificaciones cuando se hace clic en una pestaña 
    // opciones Todas, No leidas, Mensajes, Solicitudes
    tabs.forEach( ( tab ) => 
        tab.addEventListener('click', () => {
            activeFilter = tab.dataset.filter;
            tabs.forEach( ( t ) => t.classList.remove('active') );
            tab.classList.add('active');
            renderNotifications();
        })
    );

    // Marcar todas las notificaciones como leidas  cuando se hace clic en el boton "Marcar todo como leido"
    markAllReadButton.addEventListener('click', () => {
        notifications.forEach( ( notificacion ) => ( notificacion.read = true ));
        renderNotifications();
    });

    // Logica para abrir el modal del boton de notificaciones 
    if ( toggleNotificationBtn ) {
        toggleNotificationBtn.addEventListener('click', ( e ) => {
            e.preventDefault();
            modalNotification.classList.toggle('hidden');

            anime({
                targets: subModal,
                opacity: [0, 1], // Comienza 
                translateY: [ 80, 0 ],
                duration: 170,
                delay: 100,
                easing: 'easeOutQuad', // Tipo de curva de animación (aumenta rapidamente al principio y luego el cambio es mas lento al final)
                complete: () => {
                    renderNotifications();
                }
            });
        });
    }

    // Cerrar el modal cuando se hace clic fuera de él
    document.addEventListener('click', ( e ) => {
        if ( !modalNotification.contains( e.target ) && e.target !== toggleNotificationBtn ) {
            closeModalAnimation();
            //modalNotification.classList.add('hidden');

        }
    });

    const closeModalAnimation = () => {
        anime({
            targets: subModal, // Objetivo de la animación
            opacity: [1, 0], // Cambia la opacidad de 1 a 0 ( desaparece )
            translateY: [0, 70], // Desvanecer el modal
            duration: 150, // Duración de la animación en milisegundos 
            easing: 'easeOutQuad', // Tipo de curva de animación ( acelera al principio )
            complete: () => { // Función que se ejecuta al finalizar la animación 
                // Al completar la animación, ocultamos el modal
                modalNotification.classList.add('hidden');
            }
        })
    }

    // Estos es de los menus que salen de notificaciones
    document.addEventListener('click', () => {
        const allMenus = getElements('.dropdown-menu');
        allMenus.forEach( ( menu ) => menu.classList.add('hidden'));
    });

    document.addEventListener('click', (event) => {
        console.log('Clic detectado en:', event.target);
    });

    const adjustDropdownPosition = ( menu, button ) => {
        const menuRect = menu.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const viewporHeight = window.innerHeight;

        // Verifica si hay suficiente espacio hacia abajo
        const spaceBelow = viewporHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if ( menuRect.height > spaceBelow && spaceAbove > spaceBelow ) {
            // Si no hay suficiente espacio hacia abajo, pero si hacia arriba
            menu.style.top = 'auto';
            menu.style.bottom = '100%'; // Coloca el menú encima del botón
            menu.style.marginBotton = '0.5rem'; // Ajusta el margen
        } else {
            // Si hay suficiente espacio hacia abajo
            menu.style.top = '100%'; // Coloca el menú debajo del botón
            menu.style.bottom = 'auto'; // Resetea el estilo 'bottom'
            menu.style.marginTop = '0.5rem'; // Ajusta el margen
        }
    }

}

