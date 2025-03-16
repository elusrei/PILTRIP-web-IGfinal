// Juego de esquivar satélites
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const canvas = document.getElementById("game-canvas")
    const ctx = canvas.getContext("2d")
    const gameContainer = document.getElementById("game-container")
    const btnIniciar = document.getElementById("btn-iniciar")
    const btnReiniciar = document.getElementById("btn-reiniciar")
    const btnFullscreen = document.getElementById("btn-fullscreen")
    const btnFullscreenGameover = document.getElementById("btn-fullscreen-gameover")
    const pantallaInicio = document.getElementById("pantalla-inicio")
    const pantallaGameover = document.getElementById("pantalla-gameover")
    const marcador = document.getElementById("marcador")
    const puntuacionActual = document.getElementById("puntuacion-actual")
    const puntuacionFinal = document.getElementById("puntuacion-final")
    const nivelActual = document.getElementById("nivel-actual")
    const recordElement = document.getElementById("record")
    const propulsionContainer = document.getElementById("propulsion-container")
    const propulsion1 = document.getElementById("propulsion-1")
    const propulsion2 = document.getElementById("propulsion-2")
    const propulsion3 = document.getElementById("propulsion-3")
    const controlInfo = document.getElementById("control-info")
  
    // Variables del juego
    let juegoActivo = false
    let puntuacion = 0
    let nivel = 1
    let record = localStorage.getItem("piltrip_record") || 0
    recordElement.textContent = record
    let ultimoTiempo = 0
    let propulsionesDisponibles = 3
  
    // Imágenes
    const naveImg = new Image()
    naveImg.src = "src/nave.png" // Esta imagen la cargará el usuario
  
    const asteroideImg = new Image()
    asteroideImg.src = "src/asteroide.png" // Esta imagen la cargará el usuario
  
    // Objeto nave
    const nave = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 100,
      ancho: 50,
      alto: 50,
      velocidadBase: 5,
      velocidad: 5,
      velocidadX: 0,
      velocidadY: 0,
      movIzquierda: false,
      movDerecha: false,
      movArriba: false,
      movAbajo: false,
      propulsion: false,
      frenando: false,
    }
  
    // Array de asteroides
    let asteroides = []
  
    // Controles de teclado
    document.addEventListener("keydown", (e) => {
      if (!juegoActivo) return
  
      switch (e.key) {
        case "ArrowLeft":
          nave.movIzquierda = true
          break
        case "ArrowRight":
          nave.movDerecha = true
          break
        case "ArrowUp":
          nave.movArriba = true
          break
        case "ArrowDown":
          nave.movAbajo = true
          break
        case "Shift":
          // Activar ralentización de asteroides si hay propulsiones disponibles
          if (propulsionesDisponibles > 0 && !nave.propulsion) {
            nave.propulsion = true
            propulsionesDisponibles--
            actualizarIndicadoresPropulsion()
            tiempoUltimaPropulsion = Date.now()
          }
          break
        case " ": // Espacio
          nave.frenando = true
          nave.velocidadX = 0
          nave.velocidadY = 0
          break
      }
    })
  
    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          nave.movIzquierda = false
          break
        case "ArrowRight":
          nave.movDerecha = false
          break
        case "ArrowUp":
          nave.movArriba = false
          break
        case "ArrowDown":
          nave.movAbajo = false
          break
        case "Shift":
          nave.propulsion = false
          nave.velocidad = nave.velocidadBase
          break
        case " ": // Espacio
          nave.frenando = false
          break
      }
    })
  
    // Función para actualizar los indicadores de propulsión
    function actualizarIndicadoresPropulsion() {
      propulsion1.className = propulsionesDisponibles >= 1 ? "propulsion-indicator" : "propulsion-indicator empty"
      propulsion2.className = propulsionesDisponibles >= 2 ? "propulsion-indicator" : "propulsion-indicator empty"
      propulsion3.className = propulsionesDisponibles >= 3 ? "propulsion-indicator" : "propulsion-indicator empty"
    }
  
    // Función para crear un nuevo asteroide
    function crearAsteroide() {
      const ancho = Math.random() * 30 + 20 // Ancho entre 20 y 50
      const isMobile = window.innerWidth <= 768
  
      let x,
        y,
        velocidadX = 0,
        velocidadY = 0
  
      if (isMobile) {
        // On mobile, asteroids only come from top
        x = Math.random() * (canvas.width - ancho)
        y = -ancho
        velocidadY = Math.random() * 2 + 1 + nivel * 0.5
      } else {
        // On desktop, keep original behavior with random directions
        const tipo = Math.floor(Math.random() * 4) // 0: arriba, 1: derecha, 2: izquierda, 3: abajo
  
        switch (tipo) {
          case 0: // Desde arriba
            x = Math.random() * (canvas.width - ancho)
            y = -ancho
            velocidadY = Math.random() * 2 + 1 + nivel * 0.5
            break
          case 1: // Desde la derecha
            x = canvas.width + ancho
            y = Math.random() * (canvas.height - ancho)
            velocidadX = -(Math.random() * 2 + 1 + nivel * 0.5)
            break
          case 2: // Desde la izquierda
            x = -ancho
            y = Math.random() * (canvas.height - ancho)
            velocidadX = Math.random() * 2 + 1 + nivel * 0.5
            break
          case 3: // Desde abajo (menos frecuente)
            if (Math.random() < 0.3) {
              // Solo 30% de probabilidad
              x = Math.random() * (canvas.width - ancho)
              y = canvas.height + ancho
              velocidadY = -(Math.random() * 2 + 1 + nivel * 0.5)
            } else {
              // Si no se crea desde abajo, crear desde arriba
              x = Math.random() * (canvas.width - ancho)
              y = -ancho
              velocidadY = Math.random() * 2 + 1 + nivel * 0.5
            }
            break
        }
      }
  
      const asteroide = {
        x: x,
        y: y,
        ancho: ancho,
        alto: ancho,
        velocidadX: velocidadX,
        velocidadY: velocidadY,
      }
  
      asteroides.push(asteroide)
    }
  
    // Función para actualizar la posición de la nave
    function actualizarNave(deltaTime) {
      // Mantener velocidad base de la nave
      nave.velocidad = nave.velocidadBase
  
      // Check if on mobile device
      const isMobile = window.innerWidth <= 768
  
      // Calcular velocidad en X e Y
      if (nave.frenando) {
        // Si está frenando, reducir velocidad rápidamente
        nave.velocidadX *= 0.8
        nave.velocidadY *= 0.8
      } else {
        // Aplicar movimiento según teclas presionadas
        if (nave.movIzquierda) {
          nave.velocidadX = -nave.velocidad
        } else if (nave.movDerecha) {
          nave.velocidadX = nave.velocidad
        } else {
          // Desaceleración natural en X
          nave.velocidadX *= 0.92
        }
  
        // On mobile, disable vertical movement
        if (!isMobile) {
          if (nave.movArriba) {
            nave.velocidadY = -nave.velocidad
          } else if (nave.movAbajo) {
            nave.velocidadY = nave.velocidad
          } else {
            // Desaceleración natural en Y
            nave.velocidadY *= 0.92
          }
        } else {
          // On mobile, gradually reset Y position to 80% of canvas height
          const targetY = canvas.height * 0.8 - nave.alto / 2
          nave.y += (targetY - nave.y) * 0.05
          nave.velocidadY = 0
        }
      }
  
      // Actualizar posición
      nave.x += nave.velocidadX
      nave.y += nave.velocidadY
  
      // Limitar a los bordes del canvas
      if (nave.x < 0) nave.x = 0
      if (nave.x > canvas.width - nave.ancho) nave.x = canvas.width - nave.ancho
      if (nave.y < 0) nave.y = 0
      if (nave.y > canvas.height - nave.alto) nave.y = canvas.height - nave.alto
  
      // Se eliminó el código de recarga de propulsiones
    }
  
    // Función para actualizar los asteroides
    function actualizarAsteroides() {
      for (let i = 0; i < asteroides.length; i++) {
        asteroides[i].x += asteroides[i].velocidadX
        asteroides[i].y += asteroides[i].velocidadY
  
        // Eliminar asteroides que salen de la pantalla
        if (
          asteroides[i].x < -asteroides[i].ancho * 2 ||
          asteroides[i].x > canvas.width + asteroides[i].ancho * 2 ||
          asteroides[i].y < -asteroides[i].alto * 2 ||
          asteroides[i].y > canvas.height + asteroides[i].alto * 2
        ) {
          asteroides.splice(i, 1)
          i--
          puntuacion += 10 // Puntos por esquivar
          puntuacionActual.textContent = puntuacion
        }
      }
  
      // Crear nuevos asteroides según el nivel
      if (Math.random() < 0.02 + nivel * 0.01) {
        crearAsteroide()
      }
    }
  
    // Función para aplicar el efecto de ralentización a los asteroides
    function aplicarRalentizacion() {
      if (nave.propulsion) {
        // Reducir la velocidad de todos los asteroides a la mitad
        for (let i = 0; i < asteroides.length; i++) {
          asteroides[i].velocidadX *= 0.5
          asteroides[i].velocidadY *= 0.5
        }
      }
    }
  
    // Función para detectar colisiones
    function detectarColisiones() {
      for (let i = 0; i < asteroides.length; i++) {
        const a = asteroides[i]
  
        // Colisión simple con rectángulos
        if (nave.x < a.x + a.ancho && nave.x + nave.ancho > a.x && nave.y < a.y + a.alto && nave.y + nave.alto > a.y) {
          gameOver()
          return
        }
      }
    }
  
    // Función para dibujar todo
    function dibujar() {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Dibujar nave
      try {
        ctx.drawImage(naveImg, nave.x, nave.y, nave.ancho, nave.alto)
  
        // Dibujar efecto de ralentización si está activa
        if (nave.propulsion) {
          ctx.fillStyle = "rgba(0, 255, 255, 0.3)" // Color cian transparente
          ctx.beginPath()
          ctx.arc(nave.x + nave.ancho / 2, nave.y + nave.alto / 2, nave.ancho * 2, 0, Math.PI * 2)
          ctx.fill()
        }
  
        // Dibujar efecto de frenado si está activo
        if (nave.frenando) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
          ctx.beginPath()
          ctx.arc(nave.x + nave.ancho / 2, nave.y + nave.alto / 2, nave.ancho, 0, Math.PI * 2)
          ctx.fill()
        }
      } catch (e) {
        // Si la imagen no está disponible, dibujar un rectángulo
        ctx.fillStyle = "#4a6bdb"
        ctx.fillRect(nave.x, nave.y, nave.ancho, nave.alto)
      }
  
      // Dibujar asteroides
      // Dibujar asteroides
      for (let i = 0; i < asteroides.length; i++) {
        try {
          ctx.drawImage(asteroideImg, asteroides[i].x, asteroides[i].y, asteroides[i].ancho, asteroides[i].alto)
        } catch (e) {
          // Si la imagen no está disponible, dibujar un círculo
          ctx.fillStyle = "#ff4500"
          ctx.beginPath()
          ctx.arc(
            asteroides[i].x + asteroides[i].ancho / 2,
            asteroides[i].y + asteroides[i].alto / 2,
            asteroides[i].ancho / 2,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }
      }
    }
    // Función principal del juego
    function gameLoop(tiempoActual) {
      if (!juegoActivo) return
  
      // Calcular delta time para movimientos suaves
      const deltaTime = tiempoActual - ultimoTiempo
      ultimoTiempo = tiempoActual
  
      actualizarNave(deltaTime)
      actualizarAsteroides()
      aplicarRalentizacion()
      detectarColisiones()
      dibujar()
  
      // Aumentar nivel cada 1000 puntos
      const nuevoNivel = Math.floor(puntuacion / 1000) + 1
      if (nuevoNivel > nivel) {
        nivel = nuevoNivel
        nivelActual.textContent = nivel
      }
  
      requestAnimationFrame(gameLoop)
    }
  
    // Función para iniciar el juego
    function iniciarJuego() {
      juegoActivo = true
      puntuacion = 0
      nivel = 1
      asteroides = []
      propulsionesDisponibles = 3
  
      const isMobile = window.innerWidth <= 768
  
      nave.x = canvas.width / 2 - 25
      // On mobile, position the ship at 80% of canvas height
      nave.y = isMobile ? canvas.height * 0.8 - nave.alto / 2 : canvas.height - 100
      nave.velocidadX = 0
      nave.velocidadY = 0
  
      puntuacionActual.textContent = puntuacion
      nivelActual.textContent = nivel
  
      actualizarIndicadoresPropulsion()
  
      pantallaInicio.style.display = "none"
      pantallaGameover.style.display = "none"
      marcador.style.display = "block"
      propulsionContainer.style.display = "flex"
      controlInfo.style.display = isMobile ? "none" : "block"
  
      ultimoTiempo = performance.now()
      requestAnimationFrame(gameLoop)
    }
  
    // Función para game over
    function gameOver() {
      juegoActivo = false
  
      puntuacionFinal.textContent = puntuacion
  
      // Actualizar récord si es necesario
      if (puntuacion > record) {
        record = puntuacion
        localStorage.setItem("piltrip_record", record)
        recordElement.textContent = record
      }
  
      pantallaGameover.style.display = "flex"
      propulsionContainer.style.display = "none"
      controlInfo.style.display = "none"
    }
  
    // Función para activar pantalla completa
    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch((err) => {
          console.error(`Error al intentar pantalla completa: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  
    // Event listeners para los botones
    btnIniciar.addEventListener("click", iniciarJuego)
    btnReiniciar.addEventListener("click", iniciarJuego)
    btnFullscreen.addEventListener("click", toggleFullScreen)
    btnFullscreenGameover.addEventListener("click", toggleFullScreen)
  
    // Ajustar tamaño del canvas cuando cambia el tamaño de la ventana
    function ajustarCanvas() {
      const contenedor = canvas.parentElement
      const ratio = canvas.width / canvas.height
  
      const nuevoAncho = contenedor.clientWidth
      const nuevoAlto = nuevoAncho / ratio
  
      canvas.style.width = nuevoAncho + "px"
      canvas.style.height = nuevoAlto + "px"
    }
  
    window.addEventListener("resize", ajustarCanvas)
    ajustarCanvas() // Ajustar al cargar
  
    // Add touch controls for mobile
    // Add this after the keyboard event listeners
    function agregarControlesTactiles() {
      // Create mobile control elements
      const mobileControls = document.createElement("div")
      mobileControls.id = "mobile-controls"
      mobileControls.style.cssText = `
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          pointer-events: none;
        `
  
      // Left control
      const leftControl = document.createElement("button")
      leftControl.classList.add("mobile-btn")
      leftControl.innerHTML = '<i class="fas fa-arrow-left"></i>'
      leftControl.style.cssText = `
          width: 60px;
          height: 60px;
          background: rgba(58, 77, 140, 0.7);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        `
  
      // Right control
      const rightControl = document.createElement("button")
      rightControl.classList.add("mobile-btn")
      rightControl.innerHTML = '<i class="fas fa-arrow-right"></i>'
      rightControl.style.cssText = `
          width: 60px;
          height: 60px;
          background: rgba(58, 77, 140, 0.7);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        `
  
      // Action buttons container
      const actionControls = document.createElement("div")
      actionControls.style.cssText = `
          display: flex;
          gap: 10px;
          pointer-events: auto;
        `
  
      // Propulsion button
      const propulsionBtn = document.createElement("button")
      propulsionBtn.classList.add("mobile-btn")
      propulsionBtn.innerHTML = '<i class="fas fa-rocket"></i>'
      propulsionBtn.style.cssText = `
          width: 60px;
          height: 60px;
          background: rgba(76, 175, 80, 0.7);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        `
  
      // Brake button
      const brakeBtn = document.createElement("button")
      brakeBtn.classList.add("mobile-btn")
      brakeBtn.innerHTML = '<i class="fas fa-stop-circle"></i>'
      brakeBtn.style.cssText = `
          width: 60px;
          height: 60px;
          background: rgba(255, 69, 0, 0.7);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        `
  
      // Add buttons to containers
      actionControls.appendChild(propulsionBtn)
      actionControls.appendChild(brakeBtn)
      mobileControls.appendChild(leftControl)
      mobileControls.appendChild(actionControls)
      mobileControls.appendChild(rightControl)
  
      // Add to game container
      gameContainer.appendChild(mobileControls)
  
      // Hide on desktop
      function updateControlsVisibility() {
        mobileControls.style.display = window.innerWidth <= 768 ? "flex" : "none"
      }
  
      window.addEventListener("resize", updateControlsVisibility)
      updateControlsVisibility()
  
      // Touch event handlers
      leftControl.addEventListener("touchstart", () => {
        nave.movIzquierda = true
      })
  
      leftControl.addEventListener("touchend", () => {
        nave.movIzquierda = false
      })
  
      rightControl.addEventListener("touchstart", () => {
        nave.movDerecha = true
      })
  
      rightControl.addEventListener("touchend", () => {
        nave.movDerecha = false
      })
  
      propulsionBtn.addEventListener("touchstart", () => {
        if (propulsionesDisponibles > 0 && !nave.propulsion) {
          nave.propulsion = true
          propulsionesDisponibles--
          actualizarIndicadoresPropulsion()
        }
      })
  
      propulsionBtn.addEventListener("touchend", () => {
        nave.propulsion = false
        nave.velocidad = nave.velocidadBase
      })
  
      brakeBtn.addEventListener("touchstart", () => {
        nave.frenando = true
        nave.velocidadX = 0
        nave.velocidadY = 0
      })
  
      brakeBtn.addEventListener("touchend", () => {
        nave.frenando = false
      })
    }
  
    // Call the function to add mobile controls at the end of the DOMContentLoaded event
    // Add this right before the closing of the DOMContentLoaded event handler
    agregarControlesTactiles()
  })
  
  