const $2 = el2 => document.querySelector( el2 );
const loginFormJWT = $2('.loginFormJWT');

loginFormJWT?.addEventListener('submit', e => {
    e.preventDefault();

    const username = $2('#login-username').value;
    const password = $2('#login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
    })
        .then( res => {
            if ( res.ok ) {
                //loginSpan.innerText = 'Sesión iniciada ... Entrando ...';
                //loginSpan.style.color = 'green';
                setTimeout(() => {
                    window.location.href = '/protected';
                }, 2000);
            } else {
                //loginSpan.innerText = 'Error al iniciar sesión';
                //loginSpan.style.color = 'red';
            }
        }) .catch( error => {
                console.log('Error en el registro:', error );
        })
});