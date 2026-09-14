export default(() => {
  
  const modalButton = document.querySelector('.modal-button')
  const overlay = document.querySelector('.overlay')

  modalButton.addEventListener('click', (event) => {
    overlay.classList.add('active')
  })

  overlay.addEventListener('click', event => {
    if(event.target.closest('.close-button')){
      overlay.classList.remove('active')
    }

    if(event.target.closest('.confirm-button')){
      overlay.classList.remove('active')
    }
  })
})()