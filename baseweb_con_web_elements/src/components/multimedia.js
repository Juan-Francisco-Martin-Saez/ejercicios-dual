class Multimedia extends HTMLElement {

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

        .multimedia {
          width: 100vw;
          background: hsl(0, 0%, 95%);
          color: hsl(0, 0%, 10%);
        }

        .multimedia-contenedor {
          width: 80vw;
          margin: 0 auto;
          padding-block: 6rem;
        }

        .multimedia-cabecera {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .multimedia-titulos {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .multimedia-etiqueta {
          color: hsl(73, 100%, 35%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .multimedia-titulo {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .multimedia-descripcion {
          max-width: 35rem;
          margin: 0;
          color: hsl(0, 0%, 35%);
          font-size: 1rem;
          line-height: 1.6;
        }

        .multimedia-lista {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 2rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .multimedia-elemento {
          min-width: 0;
        }

        .multimedia-enlace {
          display: block;
          color: inherit;
        }

        .multimedia-imagen {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: hsl(0, 0%, 85%);
        }

        .multimedia-imagen img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .multimedia-enlace:hover .multimedia-imagen img {
          transform: scale(1.04);
        }

        .multimedia-play {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          border: 0.1rem solid hsl(0, 0%, 95%);
          border-radius: 50%;
          background: hsl(0, 0%, 5%, 0.65);
          color: hsl(0, 0%, 95%);
          transform: translate(-50%, -50%);
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .multimedia-play::after {
          content: '';
          width: 0;
          height: 0;
          margin-left: 0.2rem;
          border-top: 0.5rem solid transparent;
          border-bottom: 0.5rem solid transparent;
          border-left: 0.75rem solid currentColor;
        }

        .multimedia-enlace:hover .multimedia-play {
          background: hsl(73, 100%, 50%);
          color: hsl(0, 0%, 5%);
          transform: translate(-50%, -50%) scale(1.08);
        }

        .multimedia-contenido {
          padding-top: 1rem;
        }

        .multimedia-categoria {
          margin: 0;
          color: hsl(73, 100%, 35%);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .multimedia-nombre {
          margin: 0.5rem 0 0;
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .multimedia-texto {
          margin: 0.75rem 0 0;
          color: hsl(0, 0%, 40%);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .multimedia-mas {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .multimedia-boton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.9rem 1.5rem;
          border: 0.1rem solid hsl(0, 0%, 15%);
          background: transparent;
          color: hsl(0, 0%, 10%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .multimedia-boton:hover {
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          transform: translateY(-0.15rem);
        }

        .multimedia-boton:focus-visible,
        .multimedia-enlace:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 70rem) {

          .multimedia-contenedor {
            width: 88vw;
          }

          .multimedia-lista {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 55rem) {

          .multimedia-contenedor {
            width: 92vw;
            padding-block: 4rem;
          }

          .multimedia-cabecera {
            align-items: flex-start;
            flex-direction: column;
          }

          .multimedia-lista {
            grid-template-columns: 1fr;
          }

        }

      </style>

      <section
        class="multimedia"
        id="multimedia"
      >

        <div class="multimedia-contenedor">

          <header class="multimedia-cabecera">

            <div class="multimedia-titulos">

              <span class="multimedia-etiqueta">
                Vídeos y contenido
              </span>

              <h2 class="multimedia-titulo">
                Multimedia
              </h2>

            </div>

            <p class="multimedia-descripcion">
              Vídeos, entrevistas, avances y contenido
              audiovisual para seguir disfrutando de tus
              grandes aficiones.
            </p>

          </header>

          <ul class="multimedia-lista">

            <li class="multimedia-elemento">

              <a
                href="#"
                class="multimedia-enlace"
              >

                <div class="multimedia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Vídeo de Fanzine+"
                  >

                  <span
                    class="multimedia-play"
                    aria-hidden="true"
                  ></span>

                </div>

                <div class="multimedia-contenido">

                  <p class="multimedia-categoria">
                    Cine
                  </p>

                  <h3 class="multimedia-nombre">
                    Fanzine+ en vídeo
                  </h3>

                  <p class="multimedia-texto">
                    Descubre nuestros contenidos
                    audiovisuales.
                  </p>

                </div>

              </a>

            </li>

            <li class="multimedia-elemento">

              <a
                href="#"
                class="multimedia-enlace"
              >

                <div class="multimedia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Vídeo de Fanzine+"
                  >

                  <span
                    class="multimedia-play"
                    aria-hidden="true"
                  ></span>

                </div>

                <div class="multimedia-contenido">

                  <p class="multimedia-categoria">
                    Videojuegos
                  </p>

                  <h3 class="multimedia-nombre">
                    Especiales y entrevistas
                  </h3>

                  <p class="multimedia-texto">
                    Todo nuestro contenido
                    audiovisual.
                  </p>

                </div>

              </a>

            </li>

            <li class="multimedia-elemento">

              <a
                href="#"
                class="multimedia-enlace"
              >

                <div class="multimedia-imagen">

                  <img
                    src="./imagenes/cabecera.svg"
                    alt="Vídeo de Fanzine+"
                  >

                  <span
                    class="multimedia-play"
                    aria-hidden="true"
                  ></span>

                </div>

                <div class="multimedia-contenido">

                  <p class="multimedia-categoria">
                    Cultura
                  </p>

                  <h3 class="multimedia-nombre">
                    Más allá de la pantalla
                  </h3>

                  <p class="multimedia-texto">
                    Historias y contenidos para
                    los fans.
                  </p>

                </div>

              </a>

            </li>

          </ul>

          <div class="multimedia-mas">

            <a
              href="#"
              class="multimedia-boton"
            >
              Ver todo
            </a>

          </div>

        </div>

      </section>

    `

  }

  configurarEventos() {

  }

}

customElements.define('multimedia-component', Multimedia)