export default (() => {

  const mas = document.querySelector('.mas')
  const menos = document.querySelector('.menos')
  const marcador = document.querySelector('.marcador')

  let contador = 1

  mas.addEventListener('click', () => {
    contador = contador + 1
    marcador.textContent = contador
  })

  menos.addEventListener('click', () => {

    if (contador > 1) {
      contador = contador - 1
    }
    marcador.textContent = contador
  })

})()




/* PARA PROFESIONALES

    mas.addEventListener('click', () => {
    contador++
    marcador.textContent = contador
  })

  menos.addEventListener('click', () => {
    contador = contador > 1 ? contador - 1 : 1
    marcador.textContent = contador
  }) */
