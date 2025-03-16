// Script para generar miniaturas de los videos
document.addEventListener('DOMContentLoaded', function() {
    // Función para generar miniaturas de video
    function generateThumbnail(videoSrc, thumbnailId) {
        const video = document.createElement('video');
        video.src = videoSrc;
        video.muted = true;
        video.preload = 'metadata';
        
        video.addEventListener('loadeddata', function() {
            // Configurar el tiempo del video para capturar un frame interesante
            video.currentTime = 1.5;
            
            video.addEventListener('seeked', function() {
                // Crear un canvas para capturar el frame
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Dibujar el frame en el canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convertir el canvas a una URL de datos
                const dataUrl = canvas.toDataURL('image/jpeg');
                
                // Establecer la URL de datos como la fuente de la imagen de miniatura
                const thumbnail = document.getElementById(thumbnailId);
                if (thumbnail) {
                    thumbnail.src = dataUrl;
                }
            });
        });
    }
    
    // Generar miniaturas para cada video
    generateThumbnail('src/escenarios/307609963110117379.mp4', 'thumbnail1');
    generateThumbnail('src/escenarios/307834946239335608.mp4', 'thumbnail2');
    generateThumbnail('src/escenarios/308018895892828162.mp4', 'thumbnail3');
    generateThumbnail('src/escenarios/308194615864445187.mp4', 'thumbnail4');
    generateThumbnail('src/escenarios/clipify-ai-20241117112041.mp4', 'thumbnail5');
    generateThumbnail('src/escenarios/cm3lotobr03235ytt6cd7bnr.mp4', 'thumbnail6');
    generateThumbnail('src/escenarios/fondo menu de inicio0001-0250.mp4', 'thumbnail7');
    generateThumbnail('src/escenarios/VidnozImageToVideo (3).mp4', 'thumbnail8');
    
    // Pausar el video destacado cuando se abre un modal
    const videoModals = document.querySelectorAll('.video-modal');
    const featuredVideo = document.getElementById('featured-video');
    
    videoModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            if (featuredVideo) {
                featuredVideo.pause();
            }
        });
    });
    
    // Pausar los videos de los modales cuando se cierran
    videoModals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const video = this.querySelector('video');
            if (video) {
                video.pause();
            }
        });
    });
    
    // Reproducir automáticamente los videos al abrir el modal
    videoModals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const video = this.querySelector('video');
            if (video) {
                video.play();
            }
        });
    });
});