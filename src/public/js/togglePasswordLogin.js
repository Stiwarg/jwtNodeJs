document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('login-password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const eyeIconOpen = document.getElementById('eyeIconOpen');
    const eyenIconClose = document.getElementById('eyeIconClose');

    // Alternar la visibilidad de la contraseña
    togglePasswordButton.addEventListener('click', () => {
        // Verificamos si la contraseña es visible
        const isPasswordVisible = passwordInput.getAttribute('type') === 'text';

        // Cambiamos el tipo de 'password' a 'text' y viceversa
        if ( isPasswordVisible ) {
            // Cambiar a contraseña
            passwordInput.setAttribute('type', 'password');
            // Mostrar icono de ojo abierto
            eyeIconOpen.classList.remove('hidden');
            // Ocultar icono de ojo cerrado
            eyenIconClose.classList.add('hidden');
        } else {
            // Cambiar a texto
            passwordInput.setAttribute('type', 'text');
            // Ocultar icono de ojo abierto
            eyeIconOpen.classList.add('hidden');
            // Mostrar icono de ojo cerrado
            eyenIconClose.classList.remove('hidden');
        }
    });
});

