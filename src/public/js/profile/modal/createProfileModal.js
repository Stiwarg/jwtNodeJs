import { createElement } from '../../../utilities/createElementDocument.js';
import { isDarkMode } from '../../../utilities/themeState.js';

export const createSectionProfile = async () => {
    // Contenedor principal del modal
    const modal = createElement('div','hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50','',{
        id: 'profile-modal'
    });

    // Contenedor del contenido
    const modalContent = createElement('div',`contentModal w-full max-w-[450px] ${ isDarkMode() ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 rounded-lg`);
    modal.appendChild( modalContent );

    // Título en la izquiera y x en el lado derecho 
    const titleWrapper = createElement('div','flex justify-between items-center mb-6')
    const titleProfile = createElement('h2','text-xl font-semibold','Editar perfil');
    titleWrapper.appendChild( titleProfile );
    // SVG de la X
    const closeIcon = createElement('div', `svgClose cursor-pointer ${ isDarkMode() ? 'text-gray-400': 'text-gray-400' }`);
    closeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    titleWrapper.appendChild( closeIcon );

    modalContent.appendChild( titleWrapper );

    // Formulario 
    const formEdit = createElement('form','space-y-4', '',{
        id: 'profile-form'
    });
    modalContent.appendChild( formEdit );

    // Aqui empiza el div donde esta la foto de pefil y cambiar foto
    // Avatar y boton para cambiar imagen
    const avatartContainer = createElement('div','flex flex-col items-center space-y-4');
    const avatarWrapper = createElement('div','w-32 h-32 rounded-full overflow-hidden');
    const avatarImg = createElement('avatarImg','w-full h-full object-cover','',{
        id:'profile-avatar',
        src: 'alt',
        alt: 'Nombre del usuario',
    });
    avatarWrapper.appendChild( avatarImg );
    avatartContainer.appendChild( avatarWrapper );

    const profilePicLabel = createElement('label','cursor-pointer','',{
        for:'profile-pic'
    });
    const profilePicDiv = createElement('div', `flex items-center space-x-2 px-5 py-3 rounded-md ${ isDarkMode() ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200' }`);

    const iconCamera = createElement('div','cursor-pointer');
    iconCamera.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>';
    profilePicDiv.appendChild( iconCamera );

    const profilePicSpan = createElement('span','', 'Cambiar foto');
    profilePicDiv.appendChild( profilePicSpan);
    
    profilePicLabel.appendChild( profilePicDiv );

    const profilePicInput = createElement('input','hidden','',{
        type:'file',
        accept:'image/*',
        id:'profile-pic'
    });
    profilePicLabel.appendChild( profilePicInput );
    avatartContainer.appendChild( profilePicLabel );
    formEdit.appendChild( avatartContainer );

    // input de nombre
    const containerName = createElement('div','space-y-2');
    const nameLabel = createElement('label','text-sm font-medium','Nombre',{
        for:'name'
    });
    const nameInput = createElement('input',`w-full p-3 rounded-md border ${ isDarkMode() ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`, {
        id: 'name',
        name: 'name',
    });

    containerName.appendChild( nameLabel );
    containerName.appendChild( nameInput );
    formEdit.appendChild( containerName );

    //  Textarea para nota
    const containerNota = createElement('div','space-y-2');
    const noteLabel = createElement('label','text-sm font-medium','Nota', {
        for:'note'
    });
    const noteTexTarea = createElement('textarea',`w-full p-3 rounded-md border ${ isDarkMode() ? 'bg-gray-700 text-white' : 'bg-white text-gray-800' }`, '', {
        id: 'note',
        name: 'note'
    });

    containerNota.appendChild( noteLabel );
    containerNota.appendChild( noteTexTarea );
    formEdit.appendChild( containerNota );
    
    // Boton de guardar
    const saveChange = createElement('button','w-full text-white py-3 rounded-md bg-black','Guardar cambios');
    formEdit.appendChild( saveChange );


    return modal;
}