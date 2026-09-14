export default(() => {
  
  const menuButton = document.querySelector('.menu-button')
  const menu = document.querySelector('.menu')

  menuButton.addEventListener('click', (event) => {
    menu.classList.toggle('active')
    menuButton.classList.toggle('active')
  })
})()