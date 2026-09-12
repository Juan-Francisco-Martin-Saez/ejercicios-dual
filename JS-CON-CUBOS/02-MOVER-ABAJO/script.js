const botonMover = document.querySelector(".boton-mover")
const cubo = document.querySelector(".cubo")

let fila = 1

if (botonMover)

  botonMover.addEventListener("click", moverAbajo)

function moverAbajo() {

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