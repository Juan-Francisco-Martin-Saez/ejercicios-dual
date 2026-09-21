class InformacionFooter extends HTMLElement {

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

        .informacion-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }

        .informacion-footer-titulo {
          margin: 0 0 1rem;
          color: hsl(0, 0%, 95%);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .informacion-footer-texto {
          margin: 0;
          color: hsl(0, 0%, 65%);
          font-size: 0.9rem;
          line-height: 1.6;
        }

      </style>

      <section class="informacion-footer">

        <h2 class="informacion-footer-titulo">
          Sobre Fanzine+
        </h2>

        <p class="informacion-footer-texto">
          Fanzine+ es una revista<br>
          digital para fans del cine,<br>
          las series, los videojuegos,<br>
          el cómic, el manga<br>
          y la cultura pop.
        </p>

      </section>

    `

  }

}

customElements.define('informacion-footer-component', InformacionFooter);