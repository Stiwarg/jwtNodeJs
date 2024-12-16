let temporaryProfilePicture = null; // Variable para guardar temporalmente el src de la imagen
const $element = e => document.querySelector( e );
document.addEventListener('DOMContentLoaded', () => {
    const profilePictureInput = $element('#profile-picture');
    const proflePicturePreview = $element('#profilePicturePreview');
    const uploadProfilePictureButton = $element('#uploadProfilePicture');
    const uploadButtonText = $element('#uploadButtonText');

    const handleProfilePictureChange = ( e ) => {
        const file = e.target.files[0];
        console.log( file );
        if ( file ) {
            const reader = new FileReader();
            reader.onload = ( event ) => {
                proflePicturePreview.src = event.target.result;
                proflePicturePreview.alt = 'Profile picture preview';
                proflePicturePreview.classList.add('rounded-full','overflow-hidden','bg-blue-500','w-32','h-32')
                uploadButtonText.textContent = 'Cambiar foto de perfil';
            }
            reader.readAsDataURL( file );
        }
    }

    uploadProfilePictureButton.addEventListener('click', () => profilePictureInput.click() );
    profilePictureInput.addEventListener('change', handleProfilePictureChange );
});