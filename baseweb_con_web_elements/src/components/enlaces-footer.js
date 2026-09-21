class EnlacesFooter extends HTMLElement {

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

        .enlaces-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }

        .enlaces-footer-titulo {
          margin: 0 0 1rem;
          color: hsl(0, 0%, 95%);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .enlaces-footer-lista {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .enlaces-footer-enlace {
          color: hsl(0, 0%, 65%);
          font-size: 0.9rem;
          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .enlaces-footer-enlace:hover {
          color: hsl(73, 100%, 50%);
          transform: translateX(0.2rem);
        }

      </style>

      <nav class="enlaces-footer" aria-label="Enlaces del pie">

        <h2 class="enlaces-footer-titulo">Enlaces</h2>

        <ul class="enlaces-footer-lista">

          <li>
            <a href="#inicio" class="enlaces-footer-enlace">
              Inicio
            </a>
          </li>

          <li>
            <a href="#revistas" class="enlaces-footer-enlace">
              Revistas
            </a>
          </li>

          <li>
            <a href="#noticias" class="enlaces-footer-enlace">
              Noticias
            </a>
          </li>

          <li>
            <a href="#multimedia" class="enlaces-footer-enlace">
              Multimedia
            </a>
          </li>

          <li>
            <a href="#categorias" class="enlaces-footer-enlace">
              Explora
            </a>
          </li>

          <li>
            <a href="#sobre-fanzine" class="enlaces-footer-enlace">
              Sobre Fanzine+
            </a>
          </li>

        </ul>

      </nav>

    `

  }

}

customElements.define('enlaces-footer-component', EnlacesFooter);