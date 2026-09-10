export default (() => {
  const formulario = document.querySelector(".formulario")

  formulario.addEventListener("submit", (event) => {
    event.preventDefault()
    alert("La información se ha enviado correctamente.")
    formulario.reset()

  })

})()