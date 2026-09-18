/* =====================================
   JUGADORES
===================================== */

const personajes = [

  {
    id: 1,
    nombre: 'P1',
    piel: 'hsl(28, 55%, 68%)'
  },

  {
    id: 2,
    nombre: 'P2',
    piel: 'hsl(20, 42%, 58%)'
  },

  {
    id: 3,
    nombre: 'P3',
    piel: 'hsl(34, 65%, 76%)'
  },

  {
    id: 4,
    nombre: 'P4',
    piel: 'hsl(16, 45%, 48%)'
  },

  {
    id: 5,
    nombre: 'P5',
    piel: 'hsl(30, 50%, 62%)'
  },

  {
    id: 6,
    nombre: 'P6',
    piel: 'hsl(25, 35%, 72%)'
  },

  {
    id: 7,
    nombre: 'P7',
    piel: 'hsl(18, 38%, 55%)'
  }

]


/* =====================================
   COLORES
===================================== */

const colores = [

  'hsl(350, 75%, 55%)',
  'hsl(205, 75%, 55%)',
  'hsl(45, 85%, 55%)',
  'hsl(145, 55%, 48%)',
  'hsl(275, 65%, 62%)',
  'hsl(20, 80%, 55%)',
  'hsl(185, 65%, 48%)'

]


const coloresSillas = [

  'hsl(350, 55%, 42%)',
  'hsl(205, 55%, 42%)',
  'hsl(45, 65%, 42%)',
  'hsl(145, 45%, 38%)',
  'hsl(275, 48%, 45%)',
  'hsl(20, 62%, 43%)'

]


/* =====================================
   ESTADO
===================================== */

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

const pantallaFinal =
  document.querySelector('#pantalla-final')


/* =====================================
   ALEATORIO
===================================== */

function aleatorio(maximo) {

  if (maximo <= 0) return 0

  const array =
    new Uint32Array(1)

  crypto.getRandomValues(array)

  return array[0] % maximo

}


function aleatorioDecimal(minimo, maximo) {

  const array =
    new Uint32Array(1)

  crypto.getRandomValues(array)

  const numero =
    array[0] / 4294967296

  return minimo +
    numero * (maximo - minimo)

}


/* =====================================
   CONTROL
===================================== */

function partidaValida(id) {

  return id === idPartida

}


function cancelarTodo() {

  temporizadores.forEach(
    temporizador =>
      clearTimeout(temporizador)
  )

  temporizadores = []


  if (animacion) {

    cancelAnimationFrame(animacion)

    animacion = null

  }

}


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

  sillasActivas =
    coloresSillas.map(
      (color, indice) => ({

        id:
          indice + 1,

        color,

        posicion:
          indice

      })
    )

}


/* =====================================
   NUEVA PARTIDA
===================================== */

function nuevaPartida() {

  cancelarTodo()

  idPartida++

  jugadorElegido = null

  rondaActual = 1

  jugando = false

  jugadoresActivos =
    [...personajes]

  crearSillas()


  pantallaFinal.classList.remove(
    'visible'
  )


  selectorJuego.classList.remove(
    'oculto'
  )


  comenzar.disabled =
    true


  comenzarRonda.disabled =
    true


  mensaje.textContent =
    'Elige tu personaje'


  estado.textContent =
    'ELIGE JUGADOR'


  ronda.textContent =
    'ELECCIÓN'


  tuJugador.textContent =
    '-'


  crearSeleccion()

  dibujarSillas()

  dibujarJugadores()

  actualizarMarcadores()

}


/* =====================================
   SELECCIÓN
===================================== */

function crearSeleccion() {

  seleccionJugadores.innerHTML = ''


  personajes.forEach(jugador => {

    const opcion =
      document.createElement('div')


    opcion.className =
      'jugador-eleccion'


    opcion.dataset.id =
      jugador.id


    opcion.innerHTML = `

      <div
        class="mini-personaje"
        style="
          --piel:${jugador.piel};
          --color:${colores[jugador.id - 1]};
        "
      >

        <div class="mini-cabeza"></div>

        <div class="mini-cuerpo"></div>

      </div>

      <strong>
        ${jugador.nombre}
      </strong>

    `


    opcion.addEventListener(
      'click',
      () => {

        document
          .querySelectorAll(
            '.jugador-eleccion'
          )
          .forEach(item =>
            item.classList.remove(
              'seleccionado'
            )
          )


        opcion.classList.add(
          'seleccionado'
        )


        jugadorElegido =
          jugador.id


        comenzar.disabled =
          false

      }
    )


    seleccionJugadores.appendChild(
      opcion
    )

  })

}


/* =====================================
   POSICIÓN
===================================== */

function posicionCircular(
  indice,
  total,
  radio,
  angulo = 0
) {

  const posicion =
    (indice / total) *
    Math.PI *
    2 +
    angulo


  return {

    x:
      50 +
      Math.cos(posicion) *
      radio,

    y:
      50 +
      Math.sin(posicion) *
      radio,

    angulo:
      posicion

  }

}


/* =====================================
   JUGADORES
===================================== */

function dibujarJugadores(
  angulo = 0
) {

  personajesDOM.innerHTML = ''


  jugadoresActivos.forEach(
    (jugador, indice) => {

      const posicion =
        posicionCircular(
          indice,
          jugadoresActivos.length,
          38,
          angulo
        )


      const personaje =
        document.createElement('div')


      personaje.className =
        'personaje'


      personaje.dataset.id =
        jugador.id


      if (
        jugador.id === jugadorElegido
      ) {

        personaje.classList.add(
          'usuario'
        )

      }


      personaje.style.left =
        `${posicion.x}%`


      personaje.style.top =
        `${posicion.y}%`


      personaje.style.setProperty(
        '--piel',
        jugador.piel
      )


      personaje.style.setProperty(
        '--color',
        colores[
        jugador.id - 1
        ]
      )


      personaje.innerHTML = `

        <div class="nombre-jugador">
          ${jugador.nombre}
        </div>

        <div class="cabeza"></div>

        <div class="cuerpo"></div>

        <div class="brazo brazo-1">
          <div class="mano"></div>
        </div>

        <div class="brazo brazo-2">
          <div class="mano"></div>
        </div>

        <div class="pierna pierna-1">
          <div class="pie"></div>
        </div>

        <div class="pierna pierna-2">
          <div class="pie"></div>
        </div>

      `


      personajesDOM.appendChild(
        personaje
      )

    }
  )

}


/* =====================================
   SILLAS
===================================== */

function dibujarSillas() {

  sillasDOM.innerHTML = ''


  sillasActivas.forEach(
    (silla, indice) => {

      const posicion =
        posicionCircular(
          indice,
          sillasActivas.length,
          27,
          0
        )


      const elemento =
        document.createElement('div')


      elemento.className =
        'silla'


      elemento.dataset.id =
        silla.id


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

}


/* =====================================
   BUSCAR DOM
===================================== */

function buscarJugadorDOM(id) {

  return personajesDOM.querySelector(
    `.personaje[data-id="${id}"]`
  )

}


function buscarSillaDOM(id) {

  return sillasDOM.querySelector(
    `.silla[data-id="${id}"]`
  )

}


/* =====================================
   DISTANCIA ANGULAR
===================================== */

function distanciaAngular(a, b) {

  let diferencia =
    Math.abs(a - b)


  while (
    diferencia > Math.PI
  ) {

    diferencia =
      Math.abs(
        diferencia -
        Math.PI * 2
      )

  }


  return diferencia

}


/* =====================================
   GIRAR
===================================== */

function animarMovimiento(
  duracion,
  id
) {

  return new Promise(resolve => {

    const inicio =
      performance.now()


    const anguloInicial =
      aleatorioDecimal(
        0,
        Math.PI * 2
      )


    const vueltas =
      2.5 +
      aleatorioDecimal(
        0,
        1.5
      )


    const direccion =
      aleatorio(2) === 0
        ? 1
        : -1


    const animar =
      tiempo => {

        if (
          !partidaValida(id)
        ) {

          resolve(null)

          return

        }


        const progreso =
          Math.min(
            (tiempo - inicio) /
            duracion,
            1
          )


        const suavizado =
          1 -
          Math.pow(
            1 - progreso,
            3
          )


        const angulo =
          anguloInicial +
          direccion *
          vueltas *
          Math.PI *
          2 *
          suavizado


        dibujarJugadores(
          angulo
        )


        if (
          progreso < 1
        ) {

          animacion =
            requestAnimationFrame(
              animar
            )

        } else {

          animacion = null

          resolve({
            angulo
          })

        }

      }


    animacion =
      requestAnimationFrame(
        animar
      )

  })

}


/* =====================================
   ASIGNAR SILLAS
===================================== */

function asignarAsientos(
  anguloJugadores
) {

  const jugadores =
    jugadoresActivos.map(
      (jugador, indice) => {

        const posicion =
          posicionCircular(
            indice,
            jugadoresActivos.length,
            38,
            anguloJugadores
          )


        return {

          jugador,

          angulo:
            posicion.angulo

        }

      }
    )


  const sillas =
    sillasActivas.map(
      (silla, indice) => {

        const posicion =
          posicionCircular(
            indice,
            sillasActivas.length,
            27,
            0
          )


        return {

          silla,

          indice,

          angulo:
            posicion.angulo

        }

      }
    )


  const jugadoresDisponibles =
    [...jugadores]


  const sillasDisponibles =
    [...sillas]


  const asignaciones = []


  while (
    sillasDisponibles.length
  ) {

    let mejorPareja = null

    let menorDistancia =
      Infinity


    jugadoresDisponibles.forEach(
      jugador => {

        sillasDisponibles.forEach(
          silla => {

            const distancia =
              distanciaAngular(
                jugador.angulo,
                silla.angulo
              )


            if (
              distancia <
              menorDistancia
            ) {

              menorDistancia =
                distancia


              mejorPareja = {

                jugador,

                silla

              }

            }

          }
        )

      }
    )


    asignaciones.push(
      mejorPareja
    )


    jugadoresDisponibles.splice(
      jugadoresDisponibles.indexOf(
        mejorPareja.jugador
      ),
      1
    )


    sillasDisponibles.splice(
      sillasDisponibles.indexOf(
        mejorPareja.silla
      ),
      1
    )

  }


  const jugadorEliminado =
    jugadoresDisponibles[0].jugador


  const sillaAEliminar =
    asignaciones[
      aleatorio(
        asignaciones.length
      )
    ].silla.silla


  return {

    asignaciones,

    jugadorEliminado,

    sillaAEliminar

  }

}


/* =====================================
   SENTARSE
===================================== */

async function sentarJugadores(
  asignaciones,
  id
) {

  if (
    !partidaValida(id)
  ) return


  asignaciones.forEach(
    ({ jugador, silla }) => {

      const personaje =
        buscarJugadorDOM(
          jugador.jugador.id
        )


      if (!personaje) return


      const posicion =
        posicionCircular(
          silla.indice,
          sillasActivas.length,
          27,
          0
        )


      personaje.style.left =
        `${posicion.x}%`


      personaje.style.top =
        `${posicion.y}%`


      personaje.classList.add(
        'sentado'
      )

    }
  )


  await esperar(
    850,
    id
  )

}


/* =====================================
   ELIMINAR JUGADOR
===================================== */

async function eliminarJugador(
  jugador,
  id
) {

  if (
    !partidaValida(id)
  ) return


  const elemento =
    buscarJugadorDOM(
      jugador.id
    )


  if (!elemento) return


  elemento.classList.add(
    'tachado'
  )


  await esperar(
    150,
    id
  )


  elemento.classList.add(
    'eliminado'
  )


  estado.textContent =
    `${jugador.nombre} ELIMINADO`


  mensaje.textContent =
    `${jugador.nombre} se ha quedado sin silla`


  await esperar(
    650,
    id
  )

}


/* =====================================
   QUITAR SILLA
===================================== */

async function quitarSilla(
  silla,
  id
) {

  if (
    !partidaValida(id)
  ) return


  const elemento =
    buscarSillaDOM(
      silla.id
    )


  if (!elemento) return


  elemento.classList.add(
    'oculta'
  )


  await esperar(
    500,
    id
  )


  sillasActivas =
    sillasActivas.filter(
      item =>
        item.id !== silla.id
    )

}


/* =====================================
   GAME OVER
===================================== */

function mostrarGameOver() {

  resultado.innerHTML = `

    <div class="icono-final">
      ☹
    </div>

    <div
      class="titulo-final"
      style="
        color:hsl(4,78%,56%);
      "
    >
      GAME OVER
    </div>

    <div class="subtitulo-final">
      Te has quedado sin silla
    </div>

  `


  pantallaFinal.classList.add(
    'visible'
  )

}


/* =====================================
   GANADOR
===================================== */

function mostrarGanador(
  ganador
) {

  resultado.innerHTML = `

    <div class="icono-final">
      🏆
    </div>

    <div
      class="titulo-final"
      style="
        color:hsl(43,95%,58%);
      "
    >
      ¡HAS GANADO!
    </div>

    <div class="subtitulo-final">
      ${ganador.nombre} ha conseguido la última silla
    </div>

  `


  pantallaFinal.classList.add(
    'visible'
  )

}


/* =====================================
   EJECUTAR RONDA
===================================== */

async function ejecutarRonda() {

  if (jugando) return

  if (
    jugadoresActivos.length <= 1
  ) return


  jugando = true

  comenzarRonda.disabled =
    true


  const id =
    idPartida


  estado.textContent =
    `RONDA ${rondaActual}`


  mensaje.textContent =
    '¡MÚSICA!'


  const movimiento =
    await animarMovimiento(
      4200,
      id
    )


  if (
    !movimiento ||
    !partidaValida(id)
  ) {

    jugando = false

    return

  }


  estado.textContent =
    '¡A SENTARSE!'


  mensaje.textContent =
    '¡BUSCA UNA SILLA!'


  const resultadoAsientos =
    asignarAsientos(
      movimiento.angulo
    )


  await sentarJugadores(
    resultadoAsientos.asignaciones,
    id
  )


  if (
    !partidaValida(id)
  ) {

    jugando = false

    return

  }


  const ganadorFinal =
    resultadoAsientos
      .asignaciones[0]
      .jugador
      .jugador


  const esUltimaRonda =
    jugadoresActivos.length === 2 &&
    sillasActivas.length === 1


  const jugadorHaPerdido =
    resultadoAsientos
      .jugadorEliminado
      .id === jugadorElegido


  await eliminarJugador(
    resultadoAsientos.jugadorEliminado,
    id
  )


  jugadoresActivos =
    jugadoresActivos.filter(
      jugador =>
        jugador.id !==
        resultadoAsientos
          .jugadorEliminado.id
    )


  actualizarMarcadores()


  /* =================================
     EL USUARIO HA PERDIDO
  ================================= */

  if (
    jugadorHaPerdido
  ) {

    jugando = false

    mostrarGameOver()

    return

  }


  /* =================================
     ÚLTIMA RONDA
  ================================= */

  if (
    esUltimaRonda
  ) {

    mostrarGanador(
      ganadorFinal
    )


    jugando = false

    return

  }


  /* =================================
     QUITAR SILLA
  ================================= */

  await quitarSilla(
    resultadoAsientos.sillaAEliminar,
    id
  )


  actualizarMarcadores()


  rondaActual++


  ronda.textContent =
    `RONDA ${rondaActual}`


  dibujarSillas()

  dibujarJugadores()


  estado.textContent =
    `RONDA ${rondaActual}`


  mensaje.textContent =
    'Prepárate para la siguiente ronda'


  await esperar(
    600,
    id
  )


  comenzarRonda.disabled =
    false


  jugando = false

}


/* =====================================
   EVENTOS
===================================== */

comenzar.addEventListener(
  'click',
  () => {

    if (!jugadorElegido) return


    selectorJuego.classList.add(
      'oculto'
    )


    tuJugador.textContent =
      `P${jugadorElegido}`


    estado.textContent =
      'PARTIDA PREPARADA'


    mensaje.textContent =
      'Pulsa para comenzar la ronda'


    comenzarRonda.disabled =
      false


    dibujarJugadores()

  }
)


comenzarRonda.addEventListener(
  'click',
  ejecutarRonda
)


reiniciar.addEventListener(
  'click',
  nuevaPartida
)


/* =====================================
   INICIO
===================================== */

nuevaPartida()