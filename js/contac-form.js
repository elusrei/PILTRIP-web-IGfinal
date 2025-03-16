function validateForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    let isValid = true;

    // Validar nombre
    if (!nombre.value.trim()) {
        nombre.classList.add('is-invalid');
        isValid = false;
    } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    // Validar asunto
    if (!asunto.value.trim()) {
        asunto.classList.add('is-invalid');
        isValid = false;
    } else {
        asunto.classList.remove('is-invalid');
        asunto.classList.add('is-valid');
    }

    // Validar mensaje
    if (!mensaje.value.trim()) {
        mensaje.classList.add('is-invalid');
        isValid = false;
    } else {
        mensaje.classList.remove('is-invalid');
        mensaje.classList.add('is-valid');
    }

    if (isValid) {
        // Simulación de envío de email
        const formData = {
            nombre: nombre.value,
            email: email.value,
            asunto: asunto.value,
            mensaje: mensaje.value
        };

        // Aquí iría la lógica de envío real del email
        console.log('Enviando email:', formData);
        
        // Mostrar mensaje de éxito
        alert('¡Mensaje enviado con éxito!');
        form.reset();
        
        // Limpiar las clases de validación
        [nombre, email, asunto, mensaje].forEach(input => {
            input.classList.remove('is-valid');
        });
    }

    return false;
}