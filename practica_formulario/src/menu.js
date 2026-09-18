export default (() => {

  const formulario = document.querySelector('.formulario')
  const eventoSuccess = document.querySelector('.evento-success')
  const eventoError = document.querySelector('.evento-error')

  let temporizador


  // CAMPOS DEL FORMULARIO

  const nombre = document.querySelector('#nombre')
  const email = document.querySelector('#email')
  const telefono = document.querySelector('#telefono')
  const direccion = document.querySelector('#direccion')


  // CUSTOM EVENT

  const eventoFormulario = new CustomEvent('resultadoFormulario', {
    detail: {
      correcto: false
    }
  })


  // ENVÍO DEL FORMULARIO

  formulario.addEventListener('submit', (event) => {

    event.preventDefault()

    const emailCorrecto = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)

    const telefonoCorrecto = /^[0-9]{9}$/.test(telefono.value)

    eventoFormulario.detail.correcto =
      nombre.value.trim() !== '' &&
      emailCorrecto &&
      telefonoCorrecto &&
      direccion.value.trim() !== ''

    formulario.dispatchEvent(eventoFormulario)

  })


  // ESCUCHAMOS EL CUSTOM EVENT

  formulario.addEventListener('resultadoFormulario', (event) => {

    eventoSuccess.classList.remove('visible')
    eventoError.classList.remove('visible')

    clearTimeout(temporizador)


    if (event.detail.correcto) {

      eventoSuccess.classList.add('visible')

      formulario.reset()

      temporizador = setTimeout(() => {

        eventoSuccess.classList.remove('visible')

      }, 5000)

      return

    }


    eventoError.classList.add('visible')

    temporizador = setTimeout(() => {

      eventoError.classList.remove('visible')

    }, 5000)

  })

})()