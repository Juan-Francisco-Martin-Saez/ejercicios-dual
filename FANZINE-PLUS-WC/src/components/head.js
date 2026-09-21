class Logo extends HTMLElement {

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

        .logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          min-width: 0;
        }

        .logo-imagen {
          display: block;
          width: 60%;
          max-width: 16rem;
          min-width: 10rem;
          height: auto;
        }

      </style>

      <a href="#inicio" class="logo">

        <img
          src="./img/cabecera.svg"
          alt="Fanzine+"
          class="logo-imagen"
        >

      </a>

    `

  }

}

customElements.define('logo-component', Logo);