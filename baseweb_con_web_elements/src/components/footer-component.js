class Footer extends HTMLElement {

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
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .footer {
          width: 100vw;
          background: hsl(0, 0%, 7%);
          border-top: 0.1rem solid hsl(0, 0%, 18%);
        }

        .footer-contenido {
          position: relative;
          width: 80vw;
          margin: 0 auto;
          padding-block: 3rem 1.5rem;
        }

        .footer-superior {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: start;
          gap: 3rem;
        }

        .footer-logo,
        .footer-enlaces,
        .footer-informacion {
          min-width: 0;
        }

        .footer-logo {
          display: flex;
          justify-content: flex-start;
        }

        .footer-enlaces {
          display: flex;
          justify-content: flex-start;
        }

        .footer-informacion {
          display: flex;
          justify-content: flex-start;
        }

        .footer-redes {
          position: absolute;
          top: 3rem;
          right: 0;
          display: flex;
          justify-content: flex-end;
          min-width: 0;
        }

        .footer-copyright {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 2.5rem;
        }

        @media (max-width: 70rem) {

          .footer-contenido {
            width: 88vw;
          }

          .footer-superior {
            gap: 2rem;
          }

          .footer-redes {
            position: static;
            margin-top: 2rem;
            justify-content: flex-start;
          }

        }

        @media (max-width: 55rem) {

          .footer-contenido {
            width: 92vw;
          }

          .footer-superior {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-logo,
          .footer-enlaces,
          .footer-informacion,
          .footer-redes {
            justify-content: center;
          }

          .footer-redes {
            margin-top: 0;
          }

        }

      </style>

      <footer class="footer">

        <div class="footer-contenido">

          <div class="footer-superior">

            <div class="footer-logo">
              <slot name="logo-footer"></slot>
            </div>

            <div class="footer-enlaces">
              <slot name="enlaces-footer"></slot>
            </div>

            <div class="footer-informacion">
              <slot name="informacion-footer"></slot>
            </div>

          </div>

          <div class="footer-redes">
            <slot name="redes-footer"></slot>
          </div>

          <div class="footer-copyright">
            <slot name="copyright-footer"></slot>
          </div>

        </div>

      </footer>

    `

  }

}

customElements.define('footer-component', Footer);