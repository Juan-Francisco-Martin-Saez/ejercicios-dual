const botonMover = document.querySelector(".boton-mover")
const cubo = document.querySelector(".cubo")

let fila = 5

if (botonMover)

  botonMover.addEventListener("click", moverIzquierda)

function moverIzquierda() {

  if (fila === 1) {

    fila = 5

  } else {

    fila = fila - 1

  }

  cubo.style.gridColumn = fila

}

/*Al hacer clic, si columna es igual a 1, columna pasa a ser 5;
si no, columna disminuye en 1; después, el cubo se coloca
en la columna indicada por columna.*/