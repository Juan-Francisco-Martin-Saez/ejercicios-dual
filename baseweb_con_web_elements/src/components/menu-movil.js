class MenuMovil extends HTMLElement {

  constructor() {

    super()

    this.shadow = this.attachShadow({ mode: 'open' })

  }

  connectedCallback() {

    this.render()

    this.configurarEventos()

  }

  render() {

    this.shadow.innerHTML =
    /*html*/`

      <style>

        :host {
          display: none;
          width: 100vw;
          position: relative;
          z-index: 200;
        }

        .menu-movil {
          position: relative;
          width: 100vw;
          background: hsl(0, 0%, 7%);
          border-bottom: 0.1rem solid hsl(0, 0%, 18%);
        }

        .menu-movil-contenido {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 1rem;
          width: 92vw;
          min-height: 5rem;
          margin: 0 auto;
          padding-block: 0.75rem;
        }

        .menu-movil-logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
        }

        .menu-movil-boton {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 3rem;
          height: 3rem;
          padding: 0;
          border: 0.1rem solid hsl(0, 0%, 35%);
          border-radius: 0.4rem;
          background: hsl(0, 0%, 10%);
          color: hsl(0, 0%, 95%);
          cursor: pointer;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            color 0.25s ease;
        }

        .menu-movil-boton:hover {
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          color: hsl(0, 0%, 5%);
        }

        .menu-movil-linea {
          display: block;
          width: 1.4rem;
          height: 0.12rem;
          border-radius: 1rem;
          background: currentColor;
          transition:
            transform 0.25s ease,
            opacity 0.25s ease;
        }

        .menu-movil-boton.activo .menu-movil-linea:nth-child(1) {
          transform: translateY(0.47rem) rotate(45deg);
        }

        .menu-movil-boton.activo .menu-movil-linea:nth-child(2) {
          opacity: 0;
        }

        .menu-movil-boton.activo .menu-movil-linea:nth-child(3) {
          transform: translateY(-0.47rem) rotate(-45deg);
        }

        .menu-movil-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: hsl(0, 0%, 0%, 0.65);
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.25s ease,
            visibility 0.25s ease;
        }

        .menu-movil-panel {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100vw;
          padding: 1.5rem 4vw 2rem;
          background: hsl(0, 0%, 9%);
          border-bottom: 0.1rem solid hsl(0, 0%, 18%);
          box-shadow: 0 1rem 2rem hsl(0, 0%, 0%, 0.35);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-1rem);
          transition:
            opacity 0.25s ease,
            visibility 0.25s ease,
            transform 0.25s ease;
        }

        .menu-movil-panel-contenido {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 92vw;
          margin: 0 auto;
        }

        .menu-movil-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .menu-movil-redes {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        :host(.abierto) .menu-movil-panel {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        :host(.abierto) .menu-movil-overlay {
          opacity: 1;
          visibility: visible;
        }

        .menu-movil-boton:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 55rem) {

          :host {
            display: block;
          }

        }

      </style>

      <div class="menu-movil">

        <div class="menu-movil-contenido">

          <div class="menu-movil-logo">
            <slot name="logo"></slot>
          </div>

          <button
            class="menu-movil-boton"
            type="button"
            aria-label="Abrir menú"
            aria-expanded="false"
          >

            <span class="menu-movil-linea"></span>
            <span class="menu-movil-linea"></span>
            <span class="menu-movil-linea"></span>

          </button>

        </div>

        <div class="menu-movil-panel">

          <div class="menu-movil-panel-contenido">

            <nav class="menu-movil-menu">

              <slot name="menu"></slot>

            </nav>

            <div class="menu-movil-redes">

              <slot name="redes"></slot>

            </div>

          </div>

        </div>

        <button
          class="menu-movil-overlay"
          type="button"
          aria-label="Cerrar menú"
        ></button>

      </div>

    `

  }

  configurarEventos() {

    const boton = this.shadow.querySelector('.menu-movil-boton')
    const overlay = this.shadow.querySelector('.menu-movil-overlay')
    const enlaces = this.shadow.querySelector('slot[name="menu"]')

    boton.addEventListener('click', () => {

      this.alternarMenu()

    })

    overlay.addEventListener('click', () => {

      this.cerrarMenu()

    })

    enlaces.addEventListener('slotchange', () => {

      const menu = enlaces.assignedElements()[0]

      if (!menu) return

      menu.addEventListener('click', evento => {

        if (evento.target.closest('a')) {

          this.cerrarMenu()

        }

      })

    })

  }

  alternarMenu() {

    if (this.classList.contains('abierto')) {

      this.cerrarMenu()

    } else {

      this.abrirMenu()

    }

  }

  abrirMenu() {

    const boton = this.shadow.querySelector('.menu-movil-boton')

    this.classList.add('abierto')

    boton.classList.add('activo')

    boton.setAttribute('aria-expanded', 'true')
    boton.setAttribute('aria-label', 'Cerrar menú')

    document.body.style.overflow = 'hidden'

  }

  cerrarMenu() {

    const boton = this.shadow.querySelector('.menu-movil-boton')

    this.classList.remove('abierto')

    boton.classList.remove('activo')

    boton.setAttribute('aria-expanded', 'false')
    boton.setAttribute('aria-label', 'Abrir menú')

    document.body.style.overflow = ''

  }

}

customElements.define('menu-movil-component', MenuMovil);