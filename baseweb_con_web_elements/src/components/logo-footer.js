class LogoFooter extends HTMLElement {

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

        .logo-footer {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          min-width: 0;
        }

        .logo-footer-imagen {
          display: block;
          width: 60%;
          max-width: 16rem;
          min-width: 10rem;
          height: auto;
        }

      </style>

      <a href="#inicio" class="logo-footer">

        <img
          src="./img/cabecera.svg"
          alt="Fanzine+"
          class="logo-footer-imagen"
        >

      </a>

    `

  }

}

customElements.define('logo-footer-component', LogoFooter);