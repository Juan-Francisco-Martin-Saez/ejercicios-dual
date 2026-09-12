const botonMover = document.querySelector(".boton-mover")
const cubo = document.querySelector(".cubo")

let fila = 1

if (botonMover)

  botonMover.addEventListener("click", moverDerecha)

function moverDerecha() {

  if (fila === 5) {

    fila = 1

  } else {

    fila = fila + 1

  }

  cubo.style.gridColumn = fila

}

/*Al hacer clic, si columna es igual a 5, columna pasa a ser 1;
si no, columna aumenta en 1; después, el cubo se coloca 
en la columna indicada por columna.*/