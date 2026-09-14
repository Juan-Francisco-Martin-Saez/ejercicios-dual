export default (() => {

  const tabs = document.querySelector('.tabs')

  tabs.addEventListener('click', (event) => {

    if (event.target.closest('.tab-button')) {

      if (event.target.closest('.tab-button').classList.contains('active')) {
        return
      }

      const tabClicked = event.target.closest('.tab-button')

      const tabActive = tabClicked.parentElement.querySelector('.active')


      tabClicked.classList.add('active')


      tabActive.classList.remove('active')

      tabs.querySelector(`.tab-content.active`).classList.remove('active')

      tabs.querySelector(`.tab-content[data-tab="${tabClicked.dataset.tab}"]`).classList.add('active')
    }
  })
})()


/* EXPLICACION CODIGO

(const tabs) guarda todas las pestañas y const contenidos guarda todos sus contenidos. 

(tabs.forEach) recorre cada pestaña y addEventListener("click") hace que al pulsarla se ejecute el código. 

(contenidos.forEach) recorre todos los contenidos

(toggle("active", ...)) añade active al contenido que corresponde a la pestaña pulsada y se la quita a los demás. 

(tabs[0].click()) simula un clic en la primera pestaña para mostrarla automáticamente al cargar la página. */