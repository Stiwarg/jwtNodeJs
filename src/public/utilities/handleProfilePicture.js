export const handleProfilePictureChange = ( e, previewElement ) => {
    const file = e.target.files[0];
    if ( file ) {
        const reader = new FileReader();
        reader.onload = ( event ) => {
            previewElement.src = event.target.result;
            previewElement.alt = 'Profile picture preview';
        }
        reader.readAsDataURL( file );
    }
}