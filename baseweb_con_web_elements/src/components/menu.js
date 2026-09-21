class Menu extends HTMLElement {

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

        .menu {
          display: flex
          align-items: center;
          justify-content: center;
          width: 100%;
          min-width: 0;
        }

        .menu-lista {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .menu-enlace {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0;
          color: hsl(0, 0%, 95%);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.25s ease;
        }

        .menu-enlace::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0.1rem;
          background: hsl(73, 100%, 50%);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s ease;
        }

        .menu-enlace:hover {
          color: hsl(73, 100%, 50%);
        }

        .menu-enlace:hover::after {
          transform: scaleX(1);
        }

        @media (max-width: 60rem) {
          .menu-lista {
            gap: 1.25rem;
          }

          .menu-enlace {
            font-size: 0.8rem;
          }
        }

      </style>

      <nav class="menu">
        <ul class="menu-lista">
          <li>
            <a href="#inicio" class="menu-enlace">Inicio</a>
          </li>
          <li>
            <a href="#revistas" class="menu-enlace">Revistas</a>
          </li>
          <li>
            <a href="#noticias" class="menu-enlace">Noticias</a>
          </li>
          <li>
            <a href="#multimedia" class="menu-enlace">Multimedia</a>
          </li>
          <li>
            <a href="#categorias" class="menu-enlace">Explora</a>
          </li>
          <li>
            <a href="#sobre-fanzine" class="menu-enlace">Sobre Fanzine+</a>
          </li>
        </ul>
      </nav>

    `

  }

}

customElements.define('menu-component', Menu);