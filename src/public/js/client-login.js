
        const $ = el => document.querySelector( el );
    
        const loginForm = $('#login-form');
        const loginSpan = $('#login-form span');
    
        const registerForm = $('#register-form');
        const registerSpan = $('#register-form span');
    
        const logoutButton = $('#close-session');
    
        loginForm?.addEventListener('submit', e => {
            e.preventDefault();
    
            const username = $('#login-username').value;
            const password = $('#login-password').value;
    
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            })
                .then( res => {
                    if ( res.ok ) {
                        loginSpan.innerText = 'Sesión iniciada ... Entrando ...';
                        loginSpan.style.color = 'green';
                        setTimeout(() => {
                            window.location.href = '/protected';
                        }, 2000);
                    } else {
                        loginSpan.innerText = 'Error al iniciar sesión';
                        loginSpan.style.color = 'red';
                    }
                })
        });
    
        registerForm?.addEventListener('submit', e => {
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
                registerSpan.innerText = 'Usuario registrado. Entrando ...';
                registerSpan.style.color = 'green';
                setTimeout(() => {
                    window.location.href = '/protected';
                });
            } else {
                registerSpan.innerText = 'Error al registrar usuario';
                registerSpan.style.color = 'red';
            }
        }).
            catch( error => {
                    console.error('Error en el registro:', error);
                    registerSpan.innerText = `Error: ${ error.message }`;
                    registerSpan.style.color= 'red'
        })
    });
    
        logoutButton?.addEventListener('click', e => {
            e.preventDefault();
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).
                then( res => {
                    console.log( res );
                    window.location.href= '/';
                })
});
