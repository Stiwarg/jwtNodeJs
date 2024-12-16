import { createElement } from '../../../utilities/createElementDocument.js';
import { isDarkMode } from '../../../utilities/themeState.js';

const categoriesNotification = [
    { text: 'Todas', dataFilter: 'all' },
    { text: 'No leídas', dataFilter: 'unread' },
    { text: 'Mensajes', dataFilter: 'message' },
    { text: 'Amigos', dataFilter: 'friend' },
];

export const createSectionNotification = async () => {
    // Contenedor principal
    const modal = createElement('div', `hidden fixed top-[120px] right-14 p-0  bg-opacity-50 z-50 `,'',{
        id: 'notification-popover'
    });

    const subModal = createElement('div', `modalSub rounded-lg shadow-lg w-[340px] ${ isDarkMode() ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }`);
    modal.appendChild( subModal );

    // Contenedor del contenido
    const modalContent = createElement('div', `contentModalNotification flex justify-between items-center p-4 border-b ${ isDarkMode() ? 'border-gray-700' : 'border-gray-200' }`);
    subModal.appendChild( modalContent );

    // Titulo de la seccion 
    const titleNotification = createElement('h3','font-semibold text-lg','Notificaciones');
    modalContent.appendChild( titleNotification );

   const btnMarkAllRead = createElement('button', `p-2 bg-gray-100 ${ isDarkMode() ? 'bg-gray-700 hover:bg-gray-600 ' : 'hover:bg-gray-200' } rounded-full transition` ,'',{
        id: 'mark-all-read',
        'aria-label': 'Marcar todas como leidas',
        title: 'Marcar todas como leidas'
   });  
   btnMarkAllRead.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
   modalContent.appendChild( btnMarkAllRead );
   
    // Contenedor de la mini secciones
   const tabs = createElement('div', `grid w-full grid-cols-4 p-1 ${ isDarkMode() ? 'border-gray-700' : 'border-gray-200' }` );
   subModal.appendChild( tabs );

   categoriesNotification.forEach( categoryNotification => {
        const isAll = categoryNotification.dataFilter === 'all';
        const btn = createElement(
            'button',
            `tab py-2 text-center text-sm font-medium ${ isDarkMode() ? 'hover:bg-gray-700' : 'hover:bg-gray-100' } ${  isAll ? 'active' : ''}`, categoryNotification.text,
            { 
                'data-filter' : categoryNotification.dataFilter
            }
        );

        tabs.appendChild( btn );
   });

   // Scroll del contendor de principal
    const scrollNotifications = createElement('div','notificationScroll h-[400px] overflow-y-auto');
    subModal.appendChild( scrollNotifications );

    const notificationList = createElement('div','realtive overflow-visible' ,'',{
        id: 'notification-list'
    });
    scrollNotifications.appendChild( notificationList );

    const noNotification = createElement('div','hidden p-4 text-center text-gray-500 dark:text-gray-400','No hay notificaciones', {
        id: 'no-notifications'
    });
    scrollNotifications.appendChild( noNotification );

   return modal;

}