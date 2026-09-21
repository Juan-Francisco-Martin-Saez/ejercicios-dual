class Revistas extends HTMLElement {

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

        .revistas {
          width: 100vw;
          background: hsl(0, 0%, 95%);
          color: hsl(0, 0%, 10%);
        }

        .revistas-contenedor {
          width: 80vw;
          margin: 0 auto;
          padding-block: 6rem;
        }

        .revistas-cabecera {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .revistas-titulos {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .revistas-etiqueta {
          color: hsl(73, 100%, 35%);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .revistas-titulo {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .revistas-descripcion {
          max-width: 35rem;
          margin: 0;
          color: hsl(0, 0%, 35%);
          font-size: 1rem;
          line-height: 1.6;
        }

        .revistas-contenido {
          position: relative;
        }

        .revistas-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          touch-action: pan-y;
          user-select: none;
        }

        .revistas-lista {
          display: flex;
          gap: 2rem;
          width: max-content;
          margin: 0;
          padding: 0;
          list-style: none;
          transition: transform 0.4s ease;
        }

        .revista {
          flex: 0 0 18rem;
        }

        .revista-enlace {
          display: block;
          color: inherit;
        }

        .revista-portada {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: hsl(0, 0%, 85%);
        }

        .revista-portada img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .revista-enlace:hover .revista-portada img {
          transform: scale(1.04);
        }

        .revista-informacion {
          padding-top: 1rem;
        }

        .revista-numero {
          margin: 0;
          color: hsl(0, 0%, 45%);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .revista-nombre {
          margin: 0.4rem 0 0;
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .revistas-controles {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .revistas-boton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.8rem;
          height: 2.8rem;
          padding: 0;
          border: 0.1rem solid hsl(0, 0%, 25%);
          border-radius: 50%;
          background: transparent;
          color: hsl(0, 0%, 10%);
          font-size: 1.1rem;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .revistas-boton:hover {
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          transform: translateY(-0.15rem);
        }

        .revistas-boton:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 70rem) {

          .revistas-contenedor {
            width: 88vw;
          }

          .revista {
            flex-basis: 16rem;
          }

        }

        @media (max-width: 55rem) {

          .revistas-contenedor {
            width: 92vw;
            padding-block: 4rem;
          }

          .revistas-cabecera {
            align-items: flex-start;
            flex-direction: column;
          }

          .revista {
            flex-basis: 14rem;
          }

        }

        @media (max-width: 30rem) {

          .revista {
            flex-basis: 12rem;
          }

        }

      </style>

      <section
        class="revistas"
        id="revistas"
      >

        <div class="revistas-contenedor">

          <header class="revistas-cabecera">

            <div class="revistas-titulos">

              <span class="revistas-etiqueta">
                Publicación revista digital
              </span>

              <h2 class="revistas-titulo">
                Últimos números
              </h2>

            </div>

            <p class="revistas-descripcion">
              Descubre nuestros últimos números y disfruta
              de todo el contenido de Fanzine+.
            </p>

          </header>

          <div class="revistas-contenido">

            <div class="revistas-slider">

              <ul class="revistas-lista">

                <li class="revista">

                  <a
                    href="#"
                    class="revista-enlace"
                  >

                    <div class="revista-portada">

                      <img
                        src="./imagenes/cabecera.svg"
                        alt="Revista Fanzine+"
                      >

                    </div>

                    <div class="revista-informacion">

                      <p class="revista-numero">
                        Número 01
                      </p>

                      <h3 class="revista-nombre">
                        Fanzine+
                      </h3>

                    </div>

                  </a>

                </li>

                <li class="revista">

                  <a
                    href="#"
                    class="revista-enlace"
                  >

                    <div class="revista-portada">

                      <img
                        src="./imagenes/cabecera.svg"
                        alt="Revista Fanzine+"
                      >

                    </div>

                    <div class="revista-informacion">

                      <p class="revista-numero">
                        Número 02
                      </p>

                      <h3 class="revista-nombre">
                        Fanzine+
                      </h3>

                    </div>

                  </a>

                </li>

                <li class="revista">

                  <a
                    href="#"
                    class="revista-enlace"
                  >

                    <div class="revista-portada">

                      <img
                        src="./imagenes/cabecera.svg"
                        alt="Revista Fanzine+"
                      >

                    </div>

                    <div class="revista-informacion">

                      <p class="revista-numero">
                        Número 03
                      </p>

                      <h3 class="revista-nombre">
                        Fanzine+
                      </h3>

                    </div>

                  </a>

                </li>

                <li class="revista">

                  <a
                    href="#"
                    class="revista-enlace"
                  >

                    <div class="revista-portada">

                      <img
                        src="./imagenes/cabecera.svg"
                        alt="Revista Fanzine+"
                      >

                    </div>

                    <div class="revista-informacion">

                      <p class="revista-numero">
                        Número 04
                      </p>

                      <h3 class="revista-nombre">
                        Fanzine+
                      </h3>

                    </div>

                  </a>

                </li>

              </ul>

            </div>

            <div class="revistas-controles">

              <button
                class="revistas-boton revistas-anterior"
                type="button"
                aria-label="Revista anterior"
              >
                ←
              </button>

              <button
                class="revistas-boton revistas-siguiente"
                type="button"
                aria-label="Revista siguiente"
              >
                →
              </button>

            </div>

          </div>

        </div>

      </section>

    `

  }

  configurarEventos() {

    const lista =
      this.shadow.querySelector('.revistas-lista')

    const anterior =
      this.shadow.querySelector('.revistas-anterior')

    const siguiente =
      this.shadow.querySelector('.revistas-siguiente')

    let posicion = 0

    const mover = direccion => {

      const desplazamiento =
        this.shadow.querySelector('.revista').getBoundingClientRect().width + 32

      posicion += direccion

      const maximo =
        Math.max(
          0,
          lista.children.length - 1
        )

      posicion =
        Math.max(
          0,
          Math.min(posicion, maximo)
        )

      lista.style.transform =
        `translateX(-${posicion * desplazamiento}px)`

    }

    anterior.addEventListener('click', () => {

      mover(-1)

    })

    siguiente.addEventListener('click', () => {

      mover(1)

    })

  }

}

customElements.define('revistas-component', Revistas)