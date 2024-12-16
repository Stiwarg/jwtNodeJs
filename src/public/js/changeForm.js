const toggleFormLink = document.getElementById('toggle-form'); // Boton que realiza el cambio del formulario
const loginForm = document.getElementById('login-form'); //Formulario de login
const registerForm = document.getElementById('register-form'); // Formulario de registro
const formTitle = document.getElementById('form-title'); // Titulo del formulario 
const profilePicture = document.getElementById('profilePicturePreview'); // Imagen inicial

//const initialSrc = profilePicture.src;

toggleFormLink.addEventListener('click', ( e ) => {

    e.preventDefault();
    if ( loginForm.classList.contains('hidden') ) {
        // Mostrar el formulario de login
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        formTitle.textContent = 'Iniciar sesión';
        toggleFormLink.textContent = 'regístrate si no tienes una cuenta';
        profilePicture.src = '/public/img/icono.png';
    } else {
        // Mostrar el formulario de registro
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        formTitle.textContent = 'Registrarse';
        toggleFormLink.textContent = '¿Ya tienes una cuenta? Inicia sesión';
        
    }
});