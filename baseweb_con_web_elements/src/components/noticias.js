class Noticias extends HTMLElement {

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

        .noticias {
          width: 100vw;
          background: hsl(0, 0%, 10%);
          color: hsl(0, 0%, 95%);
        }

        .noticias-contenedor {
          width: 80vw;
          margin: 0 auto;
          padding-block: 6rem;
        }

        .noticias-cabecera {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .noticias-titulos {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .noticias-etiqueta {
          color: hsl(73, 100%, 50%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .noticias-titulo {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .noticias-descripcion {
          max-width: 35rem;
          margin: 0;
          color: hsl(0, 0%, 70%);
          font-size: 1rem;
          line-height: 1.6;
        }

        .noticias-lista {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 2rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .noticia {
          min-width: 0;
        }

        .noticia-enlace {
          display: block;
          color: inherit;
        }

        .noticia-imagen {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: hsl(0, 0%, 18%);
        }

        .noticia-imagen img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .noticia-enlace:hover .noticia-imagen img {
          transform: scale(1.04);
        }

        .noticia-contenido {
          padding-top: 1rem;
        }

        .noticia-categoria {
          margin: 0;
          color: hsl(73, 100%, 50%);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .noticia-titulo {
          margin: 0.5rem 0 0;
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .noticia-fecha {
          margin: 0.75rem 0 0;
          color: hsl(0, 0%, 55%);
          font-size: 0.8rem;
        }

        .noticias-mas {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .noticias-boton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.9rem 1.5rem;
          border: 0.1rem solid hsl(73, 100%, 50%);
          background: transparent;
          color: hsl(73, 100%, 50%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .noticias-boton:hover {
          background: hsl(73, 100%, 50%);
          color: hsl(0, 0%, 5%);
          transform: translateY(-0.15rem);
        }

        .noticias-boton:focus-visible,
        .noticia-enlace:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 70rem) {

          .noticias-contenedor {
            width: 88vw;
          }

          .noticias-lista {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 55rem) {

          .noticias-contenedor {
            width: 92vw;
            padding-block: 4rem;
          }

          .noticias-cabecera {
            align-items: flex-start;
            flex-direction: column;
          }

          .noticias-lista {
            grid-template-columns: 1fr;
          }

        }

      </style>

      <section
        class="noticias"
        id="noticias"
      >

        <div class="noticias-contenedor">

          <header class="noticias-cabecera">

            <div class="noticias-titulos">

              <span class="noticias-etiqueta">
                Actualidad
              </span>

              <h2 class="noticias-titulo">
                Noticias
              </h2>

            </div>

            <p class="noticias-descripcion">
              Las últimas noticias del mundo del cine,
              televisión, cómic, manga y videojuegos.
            </p>

          </header>

          <ul class="noticias-lista">

            <li class="noticia">

              <a
                href="#"
                class="noticia-enlace"
              >

                <div class="noticia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Noticia de cine"
                  >

                </div>

                <div class="noticia-contenido">

                  <p class="noticia-categoria">
                    Cine
                  </p>

                  <h3 class="noticia-titulo">
                    Últimas novedades del mundo del cine
                  </h3>

                  <p class="noticia-fecha">
                    21 septiembre 2026
                  </p>

                </div>

              </a>

            </li>

            <li class="noticia">

              <a
                href="#"
                class="noticia-enlace"
              >

                <div class="noticia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Noticia de videojuegos"
                  >

                </div>

                <div class="noticia-contenido">

                  <p class="noticia-categoria">
                    Videojuegos
                  </p>

                  <h3 class="noticia-titulo">
                    Todo lo que tienes que saber
                  </h3>

                  <p class="noticia-fecha">
                    21 septiembre 2026
                  </p>

                </div>

              </a>

            </li>

            <li class="noticia">

              <a
                href="#"
                class="noticia-enlace"
              >

                <div class="noticia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Noticia de cómic y manga"
                  >

                </div>

                <div class="noticia-contenido">

                  <p class="noticia-categoria">
                    Cómic & Manga
                  </p>

                  <h3 class="noticia-titulo">
                    Nuevas historias para descubrir
                  </h3>

                  <p class="noticia-fecha">
                    21 septiembre 2026
                  </p>

                </div>

              </a>

            </li>

          </ul>

          <div class="noticias-mas">

            <a
              href="#"
              class="noticias-boton"
            >
              Ver todas las noticias
            </a>

          </div>

        </div>

      </section>

    `

  }

  configurarEventos() {

  }

}

customElements.define('noticias-component', Noticias)