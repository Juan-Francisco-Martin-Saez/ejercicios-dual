const botonMover = document.querySelector(".boton-mover")
const cubo = document.querySelector(".cubo")

let fila = 5

if (botonMover)

  botonMover.addEventListener("click", moverArriba)

function moverArriba() {

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