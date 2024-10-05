document.addEventListener('DOMContentLoaded', () => {
    // Elementos para el primer campo de contraseña  (Crear Contraseña)
    const passwordInput = document.getElementById('register-password');
    const togglePasswordButton = document.getElementById('togglePasswordRegister');
    const eyeIconOpenOne = document.getElementById('eyeIconOpenOne');
    const eyenIconCloseOne = document.getElementById('eyeIconCloseOne');

    // Elementos para el segundo campo de contraseña (Confirmar Contraseña)
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');
    const eyeIconOpenTwo = document.getElementById('eyeIconOpenTwo');
    const eyeIconCloseTwo = document.getElementById('eyeIconCloseTwo');

    // Alternar la visibilidad de la contraseña
    togglePasswordButton.addEventListener('click', () => {
        // Verificamos si la contraseña es visible
        const isPasswordVisible = passwordInput.getAttribute('type') === 'text';

        // Cambiamos el tipo de 'password' a 'text' y viceversa
        if ( isPasswordVisible ) {
            // Cambiar a contraseña
            passwordInput.setAttribute('type', 'password');
            // Mostrar icono de ojo abierto
            eyeIconOpenOne.classList.remove('hidden');
            // Ocultar icono de ojo cerrado
            eyenIconCloseOne.classList.add('hidden');
        } else {
            // Cambiar a texto
            passwordInput.setAttribute('type', 'text');
            // Ocultar icono de ojo abierto
            eyeIconOpenOne.classList.add('hidden');
            // Mostrar icono de ojo cerrado
            eyenIconCloseOne.classList.remove('hidden');
        }
    });

    // Alternar visibilidad de la contraseña para el campo (Confirmar Contraseña)
    toggleConfirmPasswordButton.addEventListener('click', () => {
        // Verificamos si la contraseña es visible
        const isPasswordVisible = confirmPasswordInput.getAttribute('type') === 'text';

        // Cambiamos el tipo de 'password' a 'text' y viceversa
        if ( isPasswordVisible ) {
            // Cambiar a contraseña
            confirmPasswordInput.setAttribute('type', 'password');
            // Mostrar icono de ojo abierto            
            eyeIconOpenTwo.classList.remove('hidden');
            // Ocultar icono de ojo cerrado        
            eyeIconCloseTwo.classList.add('hidden');
        } else {
            // Cambiar a texto
            confirmPasswordInput.setAttribute('type', 'text');
            // Ocultar icono de ojo abierto
            eyeIconOpenTwo.classList.add('hidden');
            // Mostrar icono de ojo cerrado
            eyeIconCloseTwo.classList.remove('hidden')
        }
    })
});

