const $ = el => document.querySelector( el );
const registerFormJWT = $('#register-form');

registerFormJWT?.addEventListener('submit', e => {
    e.preventDefault();

    const username = $('#register-username').value;
    const password = $('#register-password').value;
    const confirmPassword = $('#register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(data => {
        console.log('Data:', data);
        if (data.ok) {
            //registerSpan.innerText = 'Usuario registrado. Entrando ...';
            //registerSpan.style.color = 'green';
            setTimeout(() => {
                window.location.href = '/protected';
            }, 2000);
        } else {
            //registerSpan.innerText = 'Error al registrar usuario';
            //registerSpan.style.color = 'red';
        }
    }).
        catch( error => {
                console.error('Error en el registro:', error);
                //registerSpan.innerText = `Error: ${ error.message }`;
                //registerSpan.style.color= 'red'
    })
});