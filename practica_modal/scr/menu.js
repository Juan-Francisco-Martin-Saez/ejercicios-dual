export default (() => {

  const botonLogin = document.querySelector("#boton-login")
  const botonAceptar = document.querySelector("#boton-aceptar")
  const botonCancelar = document.querySelector("#boton-cancelar")
  const modal = document.querySelector("#fondo-modal")


  botonLogin.addEventListener("click", () => {

    modal.classList.add("active")

  })


  botonAceptar.addEventListener("click", () => {

    modal.classList.remove("active")

  })


  botonCancelar.addEventListener("click", () => {

    modal.classList.remove("active")

  })

})()
