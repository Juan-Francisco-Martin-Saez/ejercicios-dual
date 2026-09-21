class Categorias extends HTMLElement {

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
          display: block;
          width: 100vw;
          position: relative;
        }

        .categorias {
          width: 100vw;
          background: hsl(0, 0%, 10%);
          color: hsl(0, 0%, 95%);
        }

        .categorias-contenedor {
          width: 80vw;
          margin: 0 auto;
          padding-block: 6rem;
        }

        .categorias-cabecera {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .categorias-etiqueta {
          color: hsl(73, 100%, 50%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .categorias-titulo {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .categorias-descripcion {
          max-width: 40rem;
          margin: 0;
          color: hsl(0, 0%, 70%);
          font-size: 1rem;
          line-height: 1.6;
        }

        .categorias-lista {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 1rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .categoria {
          min-width: 0;
        }

        .categoria-enlace {
          position: relative;
          display: flex;
          align-items: flex-end;
          min-height: 14rem;
          overflow: hidden;
          padding: 1.5rem;
          border: 0.1rem solid hsl(0, 0%, 25%);
          background: hsl(0, 0%, 7%);
          color: hsl(0, 0%, 95%);
          isolation: isolate;
          transition:
            border-color 0.3s ease,
            transform 0.3s ease;
        }

        .categoria-enlace::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(
              145deg,
              hsl(0, 0%, 18%),
              hsl(0, 0%, 5%)
            );
        }

        .categoria-enlace::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(
              0deg,
              hsl(0, 0%, 0%, 0.9),
              hsl(0, 0%, 0%, 0.1)
            );
        }

        .categoria-enlace:hover {
          border-color: hsl(73, 100%, 50%);
          transform: translateY(-0.25rem);
        }

        .categoria-contenido {
          position: relative;
          z-index: 1;
        }

        .categoria-numero {
          display: block;
          margin-bottom: 0.75rem;
          color: hsl(73, 100%, 50%);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .categoria-nombre {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
        }

        .categoria-flecha {
          display: inline-flex;
          margin-top: 1rem;
          color: hsl(73, 100%, 50%);
          font-size: 1.3rem;
          transition: transform 0.25s ease;
        }

        .categoria-enlace:hover .categoria-flecha {
          transform: translateX(0.35rem);
        }

        .categoria-enlace:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 70rem) {

          .categorias-contenedor {
            width: 88vw;
          }

          .categorias-lista {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 55rem) {

          .categorias-contenedor {
            width: 92vw;
            padding-block: 4rem;
          }

        }

        @media (max-width: 30rem) {

          .categorias-lista {
            grid-template-columns: 1fr;
          }

          .categoria-enlace {
            min-height: 11rem;
          }

        }

      </style>

      <section
        class="categorias"
        id="categorias"
      >

        <div class="categorias-contenedor">

          <header class="categorias-cabecera">

            <span class="categorias-etiqueta">
              Explora Fanzine+
            </span>

            <h2 class="categorias-titulo">
              Categorías
            </h2>

            <p class="categorias-descripcion">
              Explora nuestras principales categorías y
              encuentra todo aquello que te apasiona.
            </p>

          </header>

          <ul class="categorias-lista">

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    01
                  </span>

                  <h3 class="categoria-nombre">
                    Cine
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    02
                  </span>

                  <h3 class="categoria-nombre">
                    Series
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    03
                  </span>

                  <h3 class="categoria-nombre">
                    Videojuegos
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    04
                  </span>

                  <h3 class="categoria-nombre">
                    Cómic & Manga
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    05
                  </span>

                  <h3 class="categoria-nombre">
                    Retro
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    06
                  </span>

                  <h3 class="categoria-nombre">
                    Coleccionismo
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    07
                  </span>

                  <h3 class="categoria-nombre">
                    Televisión
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

            <li class="categoria">

              <a
                href="#"
                class="categoria-enlace"
              >

                <div class="categoria-contenido">

                  <span class="categoria-numero">
                    08
                  </span>

                  <h3 class="categoria-nombre">
                    Cultura Pop
                  </h3>

                  <span
                    class="categoria-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

              </a>

            </li>

          </ul>

        </div>

      </section>

    `

  }

  configurarEventos() {

  }

}

customElements.define('categorias-component', Categorias)