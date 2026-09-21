class Cabecera extends HTMLElement {

  constructor() {

    super()

    this.shadow = this.attachShadow({ mode: 'open' })

  }

  connectedCallback() {

    this.render()

  }

  render() {

    this.shadow.innerHTML =
    /*html*/`

      <style>

        :host {
          display: block;
          width: 100vw;
          position: relative;
          z-index: 100;
        }

        .cabecera {
          width: 100vw;
          background: hsl(0, 0%, 7%);
          border-bottom: 0.1rem solid hsl(0, 0%, 18%);
        }

        .cabecera-contenido {
          display: grid;
          grid-template-columns: 16rem 1fr 12rem;
          align-items: center;
          gap: 2rem;
          width: 80vw;
          min-height: 5rem;
          margin: 0 auto;
          padding-block: 0.75rem;
        }

        .cabecera-logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
        }

        .cabecera-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .cabecera-redes {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-width: 0;
        }

        @media (max-width: 70rem) {

          .cabecera-contenido {
            grid-template-columns: 14rem 1fr 10rem;
            gap: 1rem;
            width: 88vw;
          }

        }

        @media (max-width: 55rem) {

          :host {
            display: none;
          }

        }

      </style>

      <header class="cabecera">

        <div class="cabecera-contenido">

          <div class="cabecera-logo">
            <slot name="logo"></slot>
          </div>

          <nav class="cabecera-menu">
            <slot name="menu"></slot>
          </nav>

          <div class="cabecera-redes">
            <slot name="redes"></slot>
          </div>

        </div>

      </header>

    `

  }

}

customElements.define('cabecera-component', Cabecera);