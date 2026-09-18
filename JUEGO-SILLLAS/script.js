const personajes = [

  {
    id: 1,
    nombre: 'P1',
    piel: 'hsla(25, 40%, 44%, 0.77)'
  },

  {
    id: 2,
    nombre: 'P2',
    piel: 'hsla(15, 100%, 92%, 1.00)'
  },

  {
    id: 3,
    nombre: 'P3',
    piel: 'hsl(30, 75%, 70%)'
  },

  {
    id: 4,
    nombre: 'P4',
    piel: 'hsl(10, 55%, 50%)'
  },

  {
    id: 5,
    nombre: 'P5',
    piel: 'hsl(25, 65%, 60%)'
  },

  {
    id: 6,
    nombre: 'P6',
    piel: 'hsla(49, 70%, 72%, 1.00)'
  },

  {
    id: 7,
    nombre: 'P7',
    piel: 'hsla(30, 57%, 11%, 1.00)'
  }

]


const colores = [

  'hsl(5, 80%, 55%)',
  'hsl(205, 80%, 55%)',
  'hsl(125, 65%, 50%)',
  'hsl(285, 70%, 60%)',
  'hsl(35, 90%, 55%)',
  'hsl(175, 70%, 50%)',
  'hsl(320, 75%, 60%)'

]


const coloresSillas = [

  'hsl(5, 75%, 50%)',
  'hsl(205, 75%, 50%)',
  'hsl(125, 60%, 45%)',
  'hsl(285, 65%, 55%)',
  'hsl(35, 85%, 50%)',
  'hsl(175, 65%, 45%)'

]


let jugadoresActivos = []

let sillasActivas = []

let jugadorElegido = null

let rondaActual = 1

let jugando = false

let idPartida = 0

let animacion = null

let temporizadores = []


/* =====================================
   DOM
===================================== */

const pantallaJuego =
  document.querySelector('#pantalla-juego')

const pantallaFinal =
  document.querySelector('#pantalla-final')

const selectorJuego =
  document.querySelector('#selector-juego')

const seleccionJugadores =
  document.querySelector('#seleccion-jugadores')

const personajesDOM =
  document.querySelector('#personajes')

const sillasDOM =
  document.querySelector('#sillas')

const comenzar =
  document.querySelector('#comenzar')

const comenzarRonda =
  document.querySelector('#comenzar-ronda')

const reiniciar =
  document.querySelector('#reiniciar')

const mensaje =
  document.querySelector('#mensaje')

const resultado =
  document.querySelector('#resultado')

const numeroSillas =
  document.querySelector('#numero-sillas')

const numeroJugadores =
  document.querySelector('#numero-jugadores')

const tuJugador =
  document.querySelector('#tu-jugador')

const ronda =
  document.querySelector('#ronda')

const estado =
  document.querySelector('#estado')


/* =====================================
   ALEATORIEDAD
===================================== */

function aleatorio(maximo) {

  const valores =
    new Uint32Array(1)

  crypto.getRandomValues(valores)

  return valores[0] % maximo

}


function aleatorioDecimal(minimo, maximo) {

  const valores =
    new Uint32Array(1)

  crypto.getRandomValues(valores)

  const numero =
    valores[0] / 4294967295

  return minimo +
    numero * (maximo - minimo)

}


/* =====================================
   PARTIDA
===================================== */

function partidaValida(id) {

  return id === idPartida

}


/* =====================================
   CANCELAR TODO
===================================== */

function cancelarTodo() {

  if (animacion !== null) {

    cancelAnimationFrame(animacion)

    animacion = null

  }


  temporizadores.forEach(
    temporizador => {

      clearTimeout(
        temporizador
      )

    }
  )


  temporizadores = []

}


/* =====================================
   ESPERA
===================================== */

function esperar(tiempo, id) {

  return new Promise(resolve => {

    const temporizador =
      setTimeout(() => {

        temporizadores =
          temporizadores.filter(
            item =>
              item !== temporizador
          )

        resolve(
          partidaValida(id)
        )

      }, tiempo)


    temporizadores.push(
      temporizador
    )

  })

}


/* =====================================
   CREAR SILLAS
===================================== */

function crearSillas() {

  sillasActivas = []

  for (let i = 0; i < 6; i++) {

    sillasActivas.push({

      id:
        i + 1,

      color:
        coloresSillas[i]

    })

  }

}


/* =====================================
   NUEVA PARTIDA
===================================== */

function nuevaPartida() {

  /*
    Invalidamos absolutamente todo
    lo que pertenezca a la partida
    anterior.
  */

  idPartida++

  cancelarTodo()


  /*
    Creamos jugadores completamente
    nuevos.
  */

  jugadoresActivos =
    personajes.map(
      jugador => ({
        ...jugador
      })
    )


  crearSillas()


  /*
    IMPORTANTE:

    Aquí eliminamos la selección
    anterior.
  */

  jugadorElegido = null

  rondaActual = 1

  jugando = false


  /*
    Limpiamos completamente
    los elementos visuales.
  */

  personajesDOM.replaceChildren()

  sillasDOM.replaceChildren()

  resultado.replaceChildren()


  /*
    Creamos otra vez los botones
    de selección.
  */

  crearSeleccion()


  /*
    Restablecemos la interfaz.
  */

  comenzar.disabled =
    true

  comenzarRonda.disabled =
    true


  mensaje.className =
    'mensaje'

  mensaje.textContent =
    'Elige tu personaje'


  estado.textContent =
    'ELIGE JUGADOR'


  ronda.textContent =
    'ELECCIÓN'


  actualizarMarcadores()


  /*
    SIEMPRE volvemos a la
    pantalla de juego.
  */

  pantallaFinal.style.display =
    'none'

  pantallaJuego.style.display =
    'grid'


  selectorJuego.classList.remove(
    'oculto'
  )

}


/* =====================================
   CREAR SELECCIÓN
===================================== */

function crearSeleccion() {

  seleccionJugadores.replaceChildren()


  personajes.forEach(
    (jugador, indice) => {

      const boton =
        document.createElement('button')


      boton.type =
        'button'


      boton.className =
        'jugador-eleccion'


      boton.innerHTML = `

        <div
          class="mini-personaje"
          style="
            --color:${colores[indice]};
            --piel:${jugador.piel};
          "
        >

          <div class="mini-cabeza"></div>

          <div class="mini-cuerpo"></div>

        </div>

        <strong>
          ${jugador.nombre}
        </strong>

      `


      boton.addEventListener(
        'click',
        () => {

          /*
            Quitamos la selección
            anterior.
          */

          document
            .querySelectorAll(
              '.jugador-eleccion'
            )
            .forEach(
              elemento => {

                elemento.classList.remove(
                  'seleccionado'
                )

              }
            )


          boton.classList.add(
            'seleccionado'
          )


          /*
            Guardamos solamente
            el ID del jugador.
          */

          jugadorElegido =
            jugador.id


          comenzar.disabled =
            false


          mensaje.textContent =
            `${jugador.nombre} es tu personaje.`


          estado.textContent =
            'PERSONAJE ELEGIDO'


          actualizarMarcadores()

        }
      )


      seleccionJugadores.appendChild(
        boton
      )

    }
  )

}


/* =====================================
   POSICIÓN CIRCULAR
===================================== */

function posicionCircular(
  indice,
  total,
  radio,
  angulo
) {

  const anguloInicial =
    (indice / total) *
    Math.PI *
    2


  const posicion =
    anguloInicial +
    angulo


  return {

    x:
      50 +
      Math.cos(posicion) *
      radio,

    y:
      50 +
      Math.sin(posicion) *
      radio

  }

}


/* =====================================
   DIBUJAR JUGADORES
===================================== */

function dibujarJugadores() {

  personajesDOM.replaceChildren()


  jugadoresActivos.forEach(
    (jugador, indice) => {

      const elemento =
        document.createElement('div')


      elemento.className =
        'personaje'


      if (
        jugador.id ===
        jugadorElegido
      ) {

        elemento.classList.add(
          'usuario'
        )

      }


      const posicion =
        posicionCircular(
          indice,
          jugadoresActivos.length,
          36,
          0
        )


      elemento.style.left =
        `${posicion.x}%`


      elemento.style.top =
        `${posicion.y}%`


      elemento.innerHTML = `

        <div class="nombre-jugador">
          ${jugador.nombre}
        </div>

        <div
          class="cabeza"
          style="--piel:${jugador.piel}"
        ></div>

        <div
          class="cuerpo"
          style="--color:${colores[jugador.id - 1]}"
        ></div>

        <div class="pierna pierna-1"></div>

        <div class="pierna pierna-2"></div>

      `


      personajesDOM.appendChild(
        elemento
      )

    }
  )

}


/* =====================================
   DIBUJAR SILLAS
===================================== */

function dibujarSillas() {

  sillasDOM.replaceChildren()


  sillasActivas.forEach(
    (silla, indice) => {

      const elemento =
        document.createElement('div')


      elemento.className =
        'silla'


      elemento.dataset.id =
        silla.id


      const posicion =
        posicionCircular(
          indice,
          sillasActivas.length,
          23,
          0
        )


      elemento.style.left =
        `${posicion.x}%`


      elemento.style.top =
        `${posicion.y}%`


      elemento.innerHTML = `

        <div
          class="silla-respaldo"
          style="--silla:${silla.color}"
        ></div>

        <div
          class="silla-asiento"
          style="--silla:${silla.color}"
        ></div>

        <div class="silla-pata pata-1"></div>

        <div class="silla-pata pata-2"></div>

      `


      sillasDOM.appendChild(
        elemento
      )

    }
  )

}


/* =====================================
   MARCADORES
===================================== */

function actualizarMarcadores() {

  numeroSillas.textContent =
    sillasActivas.length


  numeroJugadores.textContent =
    jugadoresActivos.length


  tuJugador.textContent =
    jugadorElegido
      ? `P${jugadorElegido}`
      : '-'


  ronda.textContent =
    jugadorElegido
      ? `RONDA ${rondaActual}`
      : 'ELECCIÓN'

}


/* =====================================
   MOVER PERSONAJES
===================================== */

function moverPersonajes(
  angulo,
  radio
) {

  const elementos =
    personajesDOM.querySelectorAll(
      '.personaje'
    )


  jugadoresActivos.forEach(
    (jugador, indice) => {

      const posicion =
        posicionCircular(
          indice,
          jugadoresActivos.length,
          radio,
          angulo
        )


      if (elementos[indice]) {

        elementos[indice].style.left =
          `${posicion.x}%`

        elementos[indice].style.top =
          `${posicion.y}%`

      }

    }
  )

}


/* =====================================
   MOVER SILLAS
===================================== */

function moverSillas(
  angulo,
  radio
) {

  const elementos =
    sillasDOM.querySelectorAll(
      '.silla'
    )


  sillasActivas.forEach(
    (silla, indice) => {

      const posicion =
        posicionCircular(
          indice,
          sillasActivas.length,
          radio,
          angulo
        )


      if (elementos[indice]) {

        elementos[indice].style.left =
          `${posicion.x}%`

        elementos[indice].style.top =
          `${posicion.y}%`

      }

    }
  )

}


/* =====================================
   ANIMACIÓN DE GIRO
===================================== */

function animarMovimiento(
  duracion,
  id
) {

  return new Promise(resolve => {

    if (!partidaValida(id)) {

      resolve(false)

      return

    }


    const inicio =
      performance.now()


    let anguloJugadores =
      aleatorioDecimal(
        0,
        Math.PI * 2
      )


    let anguloSillas =
      aleatorioDecimal(
        0,
        Math.PI * 2
      )


    let velocidadJugadores =
      aleatorioDecimal(
        0.009,
        0.016
      )


    let velocidadSillas =
      aleatorioDecimal(
        0.007,
        0.014
      )


    let objetivoJugadores =
      velocidadJugadores


    let objetivoSillas =
      velocidadSillas


    let siguienteCambio =
      inicio +
      aleatorioDecimal(
        150,
        500
      )


    function frame(ahora) {

      if (!partidaValida(id)) {
        return
      }


      const transcurrido =
        ahora - inicio


      const progreso =
        Math.min(
          transcurrido / duracion,
          1
        )


      if (
        ahora >=
        siguienteCambio
      ) {

        objetivoJugadores =
          aleatorioDecimal(
            0.006,
            0.020
          )


        objetivoSillas =
          aleatorioDecimal(
            0.005,
            0.017
          )


        siguienteCambio =
          ahora +
          aleatorioDecimal(
            120,
            550
          )

      }


      velocidadJugadores +=
        (
          objetivoJugadores -
          velocidadJugadores
        ) * 0.06


      velocidadSillas +=
        (
          objetivoSillas -
          velocidadSillas
        ) * 0.06


      anguloJugadores +=
        velocidadJugadores


      anguloSillas -=
        velocidadSillas


      const radioJugadores =
        36 +
        Math.sin(
          ahora * 0.003
        ) * 1.2


      const radioSillas =
        23 +
        Math.cos(
          ahora * 0.003
        ) * 1


      moverPersonajes(
        anguloJugadores,
        radioJugadores
      )


      moverSillas(
        anguloSillas,
        radioSillas
      )


      if (progreso < 1) {

        animacion =
          requestAnimationFrame(
            frame
          )

      } else {

        animacion = null

        resolve(true)

      }

    }


    animacion =
      requestAnimationFrame(
        frame
      )

  })

}


/* =====================================
   BUSCAR JUGADOR
===================================== */

function buscarJugadorDOM(id) {

  const elementos =
    personajesDOM.querySelectorAll(
      '.personaje'
    )


  return Array.from(
    elementos
  ).find(
    elemento =>
      elemento
        .querySelector(
          '.nombre-jugador'
        )
        ?.textContent.trim() ===
      `P${id}`
  )

}


/* =====================================
   TACHAR JUGADOR
===================================== */

async function tacharJugador(
  jugador,
  id
) {

  if (!partidaValida(id)) {
    return false
  }


  const elemento =
    buscarJugadorDOM(
      jugador.id
    )


  if (!elemento) {
    return false
  }


  elemento.classList.add(
    'tachado'
  )


  await esperar(
    850,
    id
  )


  return partidaValida(id)

}


/* =====================================
   TACHAR SILLA
===================================== */

async function tacharSilla(id) {

  if (!partidaValida(id)) {
    return false
  }


  const elementos =
    sillasDOM.querySelectorAll(
      '.silla'
    )


  const elemento =
    elementos[
    elementos.length - 1
    ]


  if (!elemento) {
    return false
  }


  elemento.classList.add(
    'tachado'
  )


  await esperar(
    850,
    id
  )


  return partidaValida(id)

}


/* =====================================
   ELEGIR ELIMINADO
===================================== */

function elegirEliminado() {

  const indice =
    aleatorio(
      jugadoresActivos.length
    )


  return jugadoresActivos[indice]

}


/* =====================================
   RONDA
===================================== */

async function ejecutarRonda() {

  if (jugando) {
    return
  }


  if (!jugadorElegido) {
    return
  }


  const id =
    idPartida


  jugando = true

  comenzarRonda.disabled =
    true


  estado.textContent =
    '¡A GIRAR!'


  mensaje.textContent =
    '¡CORRE POR TU SILLA!'


  mensaje.className =
    'mensaje'


  const eliminado =
    elegirEliminado()


  const duracion =
    aleatorioDecimal(
      2800,
      5200
    )


  const inicioValido =
    await esperar(
      aleatorioDecimal(
        200,
        600
      ),
      id
    )


  if (!inicioValido) {

    jugando = false

    return

  }


  const giroValido =
    await animarMovimiento(
      duracion,
      id
    )


  if (!giroValido) {

    jugando = false

    return

  }


  const pausaValida =
    await esperar(
      aleatorioDecimal(
        250,
        700
      ),
      id
    )


  if (!pausaValida) {

    jugando = false

    return

  }


  const tachadoJugador =
    await tacharJugador(
      eliminado,
      id
    )


  if (!tachadoJugador) {

    jugando = false

    return

  }


  const tachadoSilla =
    await tacharSilla(id)


  if (!tachadoSilla) {

    jugando = false

    return

  }


  jugadoresActivos =
    jugadoresActivos.filter(
      jugador =>
        jugador.id !==
        eliminado.id
    )


  sillasActivas.pop()


  dibujarJugadores()

  dibujarSillas()

  actualizarMarcadores()


  if (
    eliminado.id ===
    jugadorElegido
  ) {

    perder(
      eliminado,
      id
    )

    return

  }


  if (
    jugadoresActivos.length === 2 &&
    sillasActivas.length === 1
  ) {

    await ejecutarFinal(id)

    return

  }


  rondaActual++

  actualizarMarcadores()


  estado.textContent =
    '¡RONDA SUPERADA!'


  mensaje.textContent =
    `${eliminado.nombre} ha sido eliminado.`


  jugando = false

  comenzarRonda.disabled =
    false

}


/* =====================================
   FINAL
===================================== */

async function ejecutarFinal(id) {

  if (!partidaValida(id)) {
    return
  }


  estado.textContent =
    'ÚLTIMA SILLA'


  mensaje.textContent =
    '¡DOS JUGADORES, UNA SILLA!'


  const ganador =
    jugadoresActivos[
    aleatorio(
      jugadoresActivos.length
    )
    ]


  const espera =
    await esperar(
      500,
      id
    )


  if (!espera) {
    return
  }


  const giro =
    await animarFinal(
      aleatorioDecimal(
        3200,
        5000
      ),
      id
    )


  if (!giro) {
    return
  }


  const pausa =
    await esperar(
      aleatorioDecimal(
        300,
        700
      ),
      id
    )


  if (!pausa) {
    return
  }


  if (
    ganador.id ===
    jugadorElegido
  ) {

    ganar(id)

  } else {

    perderFinal(
      ganador,
      id
    )

  }

}


/* =====================================
   ANIMACIÓN FINAL
===================================== */

function animarFinal(
  duracion,
  id
) {

  return new Promise(resolve => {

    const inicio =
      performance.now()


    let anguloJugadores =
      aleatorioDecimal(
        0,
        Math.PI * 2
      )


    let anguloSilla =
      aleatorioDecimal(
        0,
        Math.PI * 2
      )


    let velocidadJugadores =
      aleatorioDecimal(
        0.011,
        0.020
      )


    let velocidadSilla =
      aleatorioDecimal(
        0.008,
        0.017
      )


    let objetivoJugadores =
      velocidadJugadores


    let objetivoSilla =
      velocidadSilla


    let siguienteCambio =
      inicio +
      aleatorioDecimal(
        100,
        400
      )


    function frame(ahora) {

      if (!partidaValida(id)) {
        return
      }


      const transcurrido =
        ahora - inicio


      const progreso =
        Math.min(
          transcurrido / duracion,
          1
        )


      if (
        ahora >=
        siguienteCambio
      ) {

        objetivoJugadores =
          aleatorioDecimal(
            0.007,
            0.023
          )


        objetivoSilla =
          aleatorioDecimal(
            0.006,
            0.019
          )


        siguienteCambio =
          ahora +
          aleatorioDecimal(
            100,
            450
          )

      }


      velocidadJugadores +=
        (
          objetivoJugadores -
          velocidadJugadores
        ) * 0.07


      velocidadSilla +=
        (
          objetivoSilla -
          velocidadSilla
        ) * 0.07


      anguloJugadores +=
        velocidadJugadores


      anguloSilla -=
        velocidadSilla


      moverPersonajes(
        anguloJugadores,
        31
      )


      moverSillas(
        anguloSilla,
        22
      )


      if (progreso < 1) {

        animacion =
          requestAnimationFrame(
            frame
          )

      } else {

        animacion = null

        resolverAsientosFinal()

        resolve(true)

      }

    }


    animacion =
      requestAnimationFrame(
        frame
      )

  })

}


/* =====================================
   FINAL VISUAL
===================================== */

function resolverAsientosFinal() {

  const elementos =
    personajesDOM.querySelectorAll(
      '.personaje'
    )


  elementos.forEach(
    (elemento, indice) => {

      const posicion =
        indice === 0
          ? {
            x: 46,
            y: 54
          }
          : {
            x: 54,
            y: 54
          }


      elemento.style.left =
        `${posicion.x}%`


      elemento.style.top =
        `${posicion.y}%`

    }
  )

}


/* =====================================
   GAME OVER
===================================== */

function perder(
  eliminado,
  id
) {

  if (!partidaValida(id)) {
    return
  }


  jugando = true


  estado.textContent =
    'GAME OVER'


  mensaje.className =
    'mensaje peligro'


  mensaje.textContent =
    `${eliminado.nombre} se ha quedado sin silla.`


  const temporizador =
    setTimeout(() => {

      if (!partidaValida(id)) {
        return
      }


      pantallaJuego.style.display =
        'none'


      pantallaFinal.style.display =
        'flex'


      resultado.innerHTML = `

        <h2>
          GAME OVER
        </h2>

        <p>
          Tu jugador P${jugadorElegido}
          ha sido eliminado.
        </p>

        <p>
          La silla no perdona.
        </p>

      `

    }, 900)


  temporizadores.push(
    temporizador
  )

}


/* =====================================
   GAME OVER FINAL
===================================== */

function perderFinal(
  ganador,
  id
) {

  if (!partidaValida(id)) {
    return
  }


  jugando = true


  estado.textContent =
    'GAME OVER'


  mensaje.className =
    'mensaje peligro'


  mensaje.textContent =
    `${ganador.nombre} consiguió la última silla.`


  const temporizador =
    setTimeout(() => {

      if (!partidaValida(id)) {
        return
      }


      pantallaJuego.style.display =
        'none'


      pantallaFinal.style.display =
        'flex'


      resultado.innerHTML = `

        <h2>
          GAME OVER
        </h2>

        <p>
          ${ganador.nombre}
          consiguió la última silla.
        </p>

        <p>
          Tu jugador P${jugadorElegido}
          se quedó sin silla.
        </p>

      `

    }, 900)


  temporizadores.push(
    temporizador
  )

}


/* =====================================
   VICTORIA
===================================== */

function ganar(id) {

  if (!partidaValida(id)) {
    return
  }


  jugando = true


  estado.textContent =
    '¡VICTORIA!'


  mensaje.className =
    'mensaje exito'


  mensaje.textContent =
    '¡HAS CONSEGUIDO LA ÚLTIMA SILLA!'


  const temporizador =
    setTimeout(() => {

      if (!partidaValida(id)) {
        return
      }


      pantallaJuego.style.display =
        'none'


      pantallaFinal.style.display =
        'flex'


      resultado.innerHTML = `

        <h2>
          ¡VICTORIA!
        </h2>

        <p>
          P${jugadorElegido}
          ha conseguido la última silla.
        </p>

        <p>
          ¡Eres el ganador!
        </p>

      `

    }, 900)


  temporizadores.push(
    temporizador
  )

}


/* =====================================
   EMPEZAR PARTIDA
===================================== */

comenzar.addEventListener(
  'click',
  () => {

    if (!jugadorElegido) {
      return
    }


    /*
      Aquí NO creamos otra partida.

      La partida ya fue creada cuando
      apareció el selector.

      Solo empezamos a jugar.
    */

    jugando = false

    rondaActual = 1


    /*
      Quitamos el selector.
    */

    selectorJuego.classList.add(
      'oculto'
    )


    /*
      Dibujamos el estado limpio
      de esta partida.
    */

    dibujarJugadores()

    dibujarSillas()

    actualizarMarcadores()


    estado.textContent =
      'PREPARADOS'


    mensaje.className =
      'mensaje'


    mensaje.textContent =
      'Pulsa EMPEZAR RONDA'


    comenzarRonda.disabled =
      false

  }
)


/* =====================================
   COMENZAR RONDA
===================================== */

comenzarRonda.addEventListener(
  'click',
  ejecutarRonda
)


/* =====================================
   NUEVA PARTIDA
===================================== */

reiniciar.addEventListener(
  'click',
  () => {

    /*
      La función se encarga de TODO:

      - cancelar partida anterior
      - borrar tachados
      - borrar posiciones
      - crear jugadores nuevos
      - crear sillas nuevas
      - borrar personaje elegido
      - mostrar selector
    */

    nuevaPartida()

  }
)


/* =====================================
   INICIO
===================================== */

nuevaPartida()