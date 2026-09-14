export default(() => {
  
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