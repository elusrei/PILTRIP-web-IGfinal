document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');
    const submitButton = document.getElementById('submitButton');
    
    // Función para mostrar mensajes de estado
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `alert alert-${type} d-block`;
        
        // Si es un mensaje de éxito, ocultarlo después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.className = 'alert d-none';
            }, 5000);
        }
    }
    
    // Función para validar el formulario
    function validateForm() {
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
    
        return isValid;
    }
    
    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Ocultar cualquier mensaje anterior
        statusDiv.className = 'alert d-none';
        
        // Validar el formulario
        if (!validateForm()) {
            showStatus('Por favor, completa correctamente todos los campos del formulario.', 'danger');
            return;
        }
        
        // Cambiar el texto del botón y deshabilitarlo
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
        submitButton.disabled = true;
        
        // Mostrar mensaje de envío
        showStatus('Enviando tu mensaje...', 'info');
        
        // Preparar los datos del formulario
        const formData = new FormData(form);
        
        // Enviar el formulario usando fetch
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Éxito
                showStatus('¡Mensaje enviado con éxito! Te responderemos lo antes posible.', 'success');
                form.reset();
                
                // Limpiar las clases de validación
                document.querySelectorAll('.form-control').forEach(input => {
                    input.classList.remove('is-valid');
                });
            } else {
                // Error en la respuesta
                throw new Error('Error en el servidor. Por favor, intenta nuevamente más tarde.');
            }
        })
        .catch(error => {
            // Error en la petición
            showStatus('No se pudo enviar el mensaje: ' + error.message, 'danger');
        })
        .finally(() => {
            // Restaurar el botón
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
    });
});