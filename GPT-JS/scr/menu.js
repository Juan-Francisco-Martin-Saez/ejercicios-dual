export default (() => {
  const sidebarToggleButton = document.querySelector(".sidebar-toggle-button")
  const sidebar = document.querySelector(".sidebar")

  sidebarToggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("active")
  })
})()