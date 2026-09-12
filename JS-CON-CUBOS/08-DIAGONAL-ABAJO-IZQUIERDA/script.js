const tablero = document.querySelector(".tablero")
const botonMover = document.querySelector(".boton-mover")
const cubo = document.querySelector(".cubo")

let fila = 1
let columna = 1

if (botonMover)

  botonMover.addEventListener("click", diagonalAbajoIzquierda)

function diagonalAbajoIzquierda() {

  if (fila === 5 && columna === 5) {

    fila = 1
    columna = 1

  } else {

    fila = fila + 1
    columna = columna + 1

  }

  cubo.style.gridColumn = columna
  cubo.style.gridRow = fila

}

/*Al hacer clic, si fila es igual a 1 y columna es igual a 1,  
fila pasa a ser 5 y columna pasa a ser 5;
si no, fila aumenta en 1 y columna aumenta en 1; 
después, el cubo se coloca en la fila y columna indicadas por fila y columna.*/