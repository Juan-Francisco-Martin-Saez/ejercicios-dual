class CopyrightFooter extends HTMLElement {

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

        .copyright-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-width: 0;
          padding-top: 1.5rem;
          border-top: 0.1rem solid hsl(0, 0%, 18%);
        }

        .copyright-footer-texto {
          margin: 0;
          color: hsl(0, 0%, 50%);
          font-size: 0.8rem;
          line-height: 1.5;
          text-align: center;
        }

      </style>

      <div class="copyright-footer">

        <p class="copyright-footer-texto">
          © 2026 Fanzine+. Todos los derechos reservados.
        </p>

      </div>

    `

  }

}

customElements.define('copyright-footer-component', CopyrightFooter);