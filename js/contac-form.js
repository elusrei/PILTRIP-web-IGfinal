document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    
    // Referencias a los modales
    const loadingModalElement = document.getElementById('loadingModal');
    const successModalElement = document.getElementById('successModal');
    const errorModalElement = document.getElementById('errorModal');
    const validationModalElement = document.getElementById('validationModal');

    const loadingModal = new bootstrap.Modal(loadingModalElement);
    const successModal = new bootstrap.Modal(successModalElement);
    const errorModal = new bootstrap.Modal(errorModalElement);
    const validationModal = new bootstrap.Modal(validationModalElement);
    
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
        
        // Validar el formulario
        if (!validateForm()) {
            validationModal.show();
            return;
        }
        
        // Cambiar el texto del botón y deshabilitarlo
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
        submitButton.disabled = true;
        
        // Mostrar modal de carga
        loadingModal.show();
        
        // Preparar los datos del formulario
        const formData = new FormData(form);
        
        // Enviar el formulario usando fetch a FormSubmit
        fetch('https://formsubmit.co/elianhablamediante@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            // Ocultar modal de carga
            loadingModal.hide();
            
            if (response.ok) {
                // Mostrar modal de éxito
                successModal.show();
                
                // Resetear el formulario
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
            // Ocultar modal de carga
            loadingModal.hide();
            
            // Mostrar mensaje de error en el modal
            document.getElementById('errorMessage').textContent = error.message;
            errorModal.show();
        })
        .finally(() => {
            // Restaurar el botón
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
    });
});