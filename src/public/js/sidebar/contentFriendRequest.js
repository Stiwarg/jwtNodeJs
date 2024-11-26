import { createElement } from '../../utilities/createElementDocument.js';
import { isDarkMode } from '../../utilities/themeState.js';
import { getElement } from '../../utilities/queryDocument.js';

export let friendRequests = [
    {
        id: 8, name: 'Tom Hanks', avatar: '/placeholder.svg?height=40&width=40&text=TH'
    },
    {
        id: 9, name: 'Meryl Streep', avatar: '/placeholder.svg?height=40&width=40&text=MS'
    },
    {
        id: 10, name: 'Leonardo DiCaprio', avatar: '/placeholder.svg?height=40&width=40&text=LD'
    },
];

export const updateNotificationBadge = () => {

    const notifationBadge = getElement('.notificationBadge');
    if ( notifationBadge ) {
        notifationBadge.textContent = friendRequests.length;
        notifationBadge.hidden = friendRequests.length === 0;
    }

}

const acceptFriendRequest = ( userId, event ) => {
    event.preventDefault();
    console.log(`Accepting friend request from user with ID: ${ userId }`);
    friendRequests = friendRequests.filter( request => request.id !== userId );
    renderFriendRequest();
    updateNotificationBadge();
}

const rejectFriendRequest = ( userId, event ) => {
    event.preventDefault();
    console.log(`Rejecting friend request from user with ID: ${ userId }`);
    friendRequests = friendRequests.filter( request => request.id !== userId )
    renderFriendRequest();
    updateNotificationBadge();
}

const renderFriendRequest = () => {
    const container = getElement('.containerSub');
    if ( !container ) return;

    container.innerHTML = '';

    const title = createElement('h2', `text-2xl font-semibold ${ isDarkMode() ? 'text-white' : 'text-gray-800'} mb-6 transition-colors duration-300`,'Friend Requests');
    container.appendChild( title );

    if ( friendRequests.length === 0 ) {
        const noRequestMessage = createElement('p',`text-center ${ isDarkMode() ? 'text-gray-400' : 'text-gray-600'}`);
        noRequestMessage.textContent = 'No pending friend request';
        container.appendChild( noRequestMessage ); 
    } else {
        const friendContainer = createElement('div', `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`);
        friendRequests.forEach( request => {
            const requestCard = createElement('div',`${ isDarkMode() ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center text-center`);
            requestCard.setAttribute('data-friendReques-id', request.id );
            const avatar = createElement('img', 'w-20 h-20 rounded-full mb-4');
            avatar.src = request.avatar;
            avatar.alt = request.name;
            requestCard.appendChild( avatar );

            const name = createElement('h3', `font-semibold ${ isDarkMode() ? 'text-white' : 'text-gray-800'} mb-2`, request.name );
            requestCard.appendChild( name );

            const subDiv = createElement('div', 'flex space-x-2');

            // Boton 1
            const btnAccept = createElement('button', 'text-base font-medium px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 flex items-center');
            btnAccept.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Accept';
            btnAccept.onclick = ( event ) => acceptFriendRequest( request.id, event );

            // Boton dos Rechazar
            const btnReject = createElement('button', 'text-base font-medium px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 flex items-center');
            btnReject.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>Reject';
            btnReject.onclick = ( event ) => rejectFriendRequest( request.id, event );

            subDiv.appendChild( btnAccept );
            subDiv.appendChild( btnReject );
            requestCard.appendChild( subDiv );
            friendContainer.appendChild( requestCard );
        });
        container.appendChild( friendContainer )
    }

    updateNotificationBadge();
    return container;
}

export default renderFriendRequest;