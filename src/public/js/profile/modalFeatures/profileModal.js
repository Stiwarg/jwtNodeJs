import { handleProfilePictureChange } from '../../../utilities/handleProfilePicture.js';
import { getElement } from '../../../utilities/queryDocument.js';
import { createSectionProfile } from '../modal/createProfileModal.js';
export const initializeProfileModal = async () => {
    const main = getElement('.containerMain');
    // Crear y agregar el modal
    const modal = await createSectionProfile();
    main.appendChild(modal);
    

    const toggleProfileButton = getElement('#toggleUserNameBtn');
    const profilePicInput = getElement('#profile-pic');
    const profileAvatar = getElement('#profile-avatar');
    const profileForm = getElement('#profile-form');
    const iconCloseButton = getElement('.svgClose');
    const modalContent = getElement('.contentModal');

    const closeModalAnimation = () => {
        anime({
            targets: modalContent,
            opacity: [1, 0],
            translateY: [0, 70], // Desvanecer el modal
            duration: 150, // Deslazarlo hacia abajo
            easing: 'easeInQuad',
            complete: () => {
                // Al completar la animación, ocultamos el modal
                modal.classList.add('hidden');
            }
        })
    }

    // Abrir/Cerrar el modal
    if (toggleProfileButton) {
        toggleProfileButton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.toggle('hidden'); // Mostrar/ocultar el modal

            // Animacion al abrir el modal
            anime({
                targets: modalContent,
                opacity: [0,1],
                translateY: [ 70, 0 ],
                duration: 150,
                delay: 100,
                easing: 'easeOutQuad'
            });
        
        });
    }

    if ( iconCloseButton ) {
        iconCloseButton.addEventListener('click', ( e ) => {
            e.preventDefault();
            closeModalAnimation();
        });  
    }

    // Cerrar el modal al hacer clic fuera del contenido 
    modal.addEventListener('click', ( e ) => {
        if ( e.target === modal ) {
            closeModalAnimation();
        }
    });

    document.addEventListener('keydown', ( e ) => {
        if ( e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalAnimation();
        }
    });

    // Manejar cambio de imagen
    /*profilePicInput.addEventListener('change', ( e ) => {
        console.log('Mensaje de profilePicInput:', e);
    });*/

    /*profileForm.addEventListener('submit', ( e ) => {
        e.preventDefault();
        modal.classList.add('hidden');
        alert('Cambios guardados');
    })*/
}