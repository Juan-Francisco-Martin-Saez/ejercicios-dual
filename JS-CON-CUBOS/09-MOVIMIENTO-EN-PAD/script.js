const botonArribaIzquierda = document.querySelector(".boton-mover.arriba-izquierda")
const botonArriba = document.querySelector(".boton-mover.arriba")
const botonArribaDerecha = document.querySelector(".boton-mover.arriba-derecha")
const botonIzquierda = document.querySelector(".boton-mover.izquierda")
const botonDerecha = document.querySelector(".boton-mover.derecha")
const botonAbajoIzquierda = document.querySelector(".boton-mover.abajo-izquierda")
const botonAbajo = document.querySelector(".boton-mover.abajo")
const botonAbajoDerecha = document.querySelector(".boton-mover.abajo-derecha")
const botonReset = document.querySelector(".boton-mover.reset")
const cubo = document.querySelector(".cubo")

let fila = 3
let columna = 3

if (botonReset)

  botonReset.addEventListener("click", resetear)

function resetear() {

  fila = 3
  columna = 3

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/*Al hacer clic en el botón ↺,
fila pasa a ser 3 y columna pasa a ser 3;
se RESETEA */


if (botonArriba)

  botonArriba.addEventListener("click", arriba)

function arriba() {

  if (fila === 1) {

    fila = 5

  } else {

    fila = fila - 1

  }

  cubo.style.gridRow = fila

}

/*Al hacer clic, si fila es igual a 1, fila regresa a 5;
si no, fila disminuye en 1; después, el cubo se coloca 
en la fila indicada por fila.*/


if (botonAbajo)

  botonAbajo.addEventListener("click", abajo)

function abajo() {

  if (fila === 5) {

    fila = 1

  } else {

    fila = fila + 1

  }

  cubo.style.gridRow = fila

}

/*Al hacer clic, si fila es igual a 5, fila pasa a ser 1;
si no, fila aumenta en 1; después, el cubo se coloca
en la fila indicada por fila.*/


if (botonIzquierda)

  botonIzquierda.addEventListener("click", izquierda)

function izquierda() {

  if (columna === 1) {

    columna = 5

  } else {

    columna = columna - 1

  }

  cubo.style.gridColumn = columna

}

/*Al hacer clic, si columna es igual a 1, columna pasa a ser 5;
si no, columna disminuye en 1; después, el cubo se coloca
en la columna indicada por columna.*/


if (botonDerecha)

  botonDerecha.addEventListener("click", derecha)

function derecha() {

  if (columna === 5) {

    columna = 1

  } else {

    columna = columna + 1

  }

  cubo.style.gridColumn = columna

}

/*Al hacer clic, si columna es igual a 5, columna pasa a ser 1;
si no, columna aumenta en 1; después, el cubo se coloca 
en la columna indicada por columna.*/


if (botonArribaIzquierda)

  botonArribaIzquierda.addEventListener("click", arribaIzquierda)

function arribaIzquierda() {

  if (fila === 1) {

    fila = 5

  } else {

    fila = fila - 1
  }

  if (columna === 1) {

    columna = 5

  } else {

    columna = columna - 1
  }

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/* Al hacer clic, primero se comprueba la fila.
Si fila es igual a 1, vuelve a 5;
si no, disminuye en 1.

Después se comprueba la columna.
Si columna es igual a 1, vuelve a 5;
si no, disminuye en 1.

De esta forma, fila y columna se controlan por separado
para evitar que el cubo salga de los límites del tablero.
Finalmente, el cubo se coloca en la nueva fila y columna. */


if (botonArribaDerecha)

  botonArribaDerecha.addEventListener("click", arribaDerecha)

function arribaDerecha() {

  if (fila === 1) {

    fila = 5

  } else {

    fila = fila - 1
  }

  if (columna === 5) {

    columna = 1

  } else {

    columna = columna + 1
  }

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/* Al hacer clic, primero se comprueba la fila.
Si fila es igual a 1, vuelve a 5;
si no, disminuye en 1.

Después se comprueba la columna.
Si columna es igual a 5, vuelve a 1;
si no, aumenta en 1.

De esta forma, fila y columna se controlan por separado
para evitar que el cubo salga de los límites del tablero.
Finalmente, el cubo se coloca en la nueva fila y columna. */


if (botonAbajoIzquierda)

  botonAbajoIzquierda.addEventListener("click", abajoIzquierda)

function abajoIzquierda() {

  if (fila === 5) {

    fila = 1

  } else {

    fila = fila + 1
  }

  if (columna === 1) {

    columna = 5

  } else {

    columna = columna - 1
  }

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/* Al hacer clic, primero se comprueba la fila.
Si fila es igual a 5, vuelve a 1;
si no, aumenta en 1.

Después se comprueba la columna.
Si columna es igual a 1, vuelve a 5;
si no, disminuye en 1.

De esta forma, fila y columna se controlan por separado
para evitar que el cubo salga de los límites del tablero.
Finalmente, el cubo se coloca en la nueva fila y columna. */


if (botonAbajoDerecha)

  botonAbajoDerecha.addEventListener("click", abajoDerecha)

function abajoDerecha() {

  if (fila === 5) {

    fila = 1

  } else {

    fila = fila + 1
  }

  if (columna === 5) {

    columna = 1

  } else {

    columna = columna + 1
  }

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/* Al hacer clic, primero se comprueba la fila.
Si fila es igual a 5, vuelve a 1;
si no, aumenta en 1.

Después se comprueba la columna.
Si columna es igual a 5, vuelve a 1;
si no, aumenta en 1.

De esta forma, fila y columna se controlan por separado
para evitar que el cubo salga de los límites del tablero.
Finalmente, el cubo se coloca en la nueva fila y columna. */