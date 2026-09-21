class Hero extends HTMLElement {

  constructor() {

    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.heroActual = 0
    this.heroArrastrando = false
    this.heroInicioX = 0
    this.heroMovimientoX = 0

  }

  connectedCallback() {

    this.render()

    this.configurarSlider()

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

        .hero {
          position: relative;
          width: 100vw;
          min-height: calc(100svh - 5rem);
          overflow: hidden;
          background: hsl(0, 0%, 5%);
        }

        .hero-slider {
          position: relative;
          width: 100%;
          min-height: calc(100svh - 5rem);
          overflow: hidden;
          touch-action: pan-y;
          user-select: none;
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.6s ease,
            visibility 0.6s ease;
        }

        .hero-slide.activo {
          opacity: 1;
          visibility: visible;
          z-index: 1;
        }

        .hero-fondo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }

        .hero-slide::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              90deg,
              hsl(0, 0%, 0%, 0.88) 0%,
              hsl(0, 0%, 0%, 0.68) 35%,
              hsl(0, 0%, 0%, 0.25) 70%,
              hsl(0, 0%, 0%, 0.5) 100%
            );
        }

        .hero-contenedor {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          width: 80vw;
          min-height: calc(100svh - 5rem);
          margin: 0 auto;
        }

        .hero-contenido {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          width: 50rem;
          max-width: 60vw;
        }

        .etiqueta {
          margin-bottom: 1rem;
          color: hsl(73, 100%, 50%);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 0;
          color: hsl(0, 0%, 95%);
          font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .hero p {
          max-width: 40rem;
          margin: 1.5rem 0 0;
          color: hsl(0, 0%, 85%);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .hero-acciones {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .boton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 10rem;
          padding: 0.9rem 1.5rem;
          border: 0.1rem solid hsl(73, 100%, 50%);
          background: hsl(73, 100%, 50%);
          color: hsl(0, 0%, 5%);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .boton:hover {
          background: transparent;
          color: hsl(73, 100%, 50%);
          transform: translateY(-0.15rem);
        }

        .slider-controles {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.8rem;
        }

        .slider-prev,
        .slider-next {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0;
          border: 0.1rem solid hsl(0, 0%, 40%);
          border-radius: 50%;
          background: hsl(0, 0%, 5%, 0.45);
          color: hsl(0, 0%, 95%);
          font-size: 1.1rem;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .slider-prev:hover,
        .slider-next:hover {
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          color: hsl(0, 0%, 5%);
          transform: translateY(-0.15rem);
        }

        .slider-indicadores {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .slider-indicador {
          width: 0.6rem;
          height: 0.6rem;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: hsl(0, 0%, 60%);
          opacity: 0.7;
          transition:
            background 0.25s ease,
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .slider-indicador.activo {
          background: hsl(73, 100%, 50%);
          opacity: 1;
          transform: scale(1.3);
        }

        .slider-prev:focus-visible,
        .slider-next:focus-visible,
        .slider-indicador:focus-visible,
        .boton:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 70rem) {

          .hero-contenedor {
            width: 88vw;
          }

          .hero-contenido {
            max-width: 65vw;
          }

        }

        @media (max-width: 55rem) {

          .hero,
          .hero-slider,
          .hero-contenedor {
            min-height: calc(100svh - 5rem);
          }

          .hero-contenedor {
            width: 92vw;
          }

          .hero-contenido {
            max-width: 80vw;
          }

          .hero h1 {
            font-size: clamp(2.2rem, 9vw, 4rem);
          }

          .hero p {
            font-size: 1rem;
          }

          .hero-acciones {
            gap: 1.25rem;
          }

        }

        @media (max-width: 30rem) {

          .hero-contenido {
            max-width: 100%;
          }

          .hero h1 {
            font-size: 2.2rem;
          }

          .hero p {
            font-size: 0.95rem;
          }

          .hero-acciones {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .slider-controles {
            width: 100%;
            justify-content: flex-start;
          }

        }

      </style>

      <section class="hero">

        <div class="hero-slider">

          <article class="hero-slide activo">

            <img
              src="./img/cabecera.svg"
              alt="Especial Retro"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  Especial Retro
                </span>

                <h1>
                  EL MUNDO<br>
                  RETRO NUNCA<br>
                  MUERE
                </h1>

                <p>
                  Videojuegos, cine, cómic y cultura pop
                  para los que nunca dejamos de ser fans.
                </p>

                <div class="hero-acciones">

                  <a href="#revistas" class="boton">
                    Descubrir
                  </a>

                  <div class="slider-controles">

                    <button
                      class="slider-prev"
                      type="button"
                      aria-label="Anterior"
                    >
                      ←
                    </button>

                    <div
                      class="slider-indicadores"
                      aria-label="Seleccionar diapositiva"
                    >

                      <button
                        class="slider-indicador activo"
                        type="button"
                        aria-label="Diapositiva 1"
                      ></button>

                      <button
                        class="slider-indicador"
                        type="button"
                        aria-label="Diapositiva 2"
                      ></button>

                      <button
                        class="slider-indicador"
                        type="button"
                        aria-label="Diapositiva 3"
                      ></button>

                      <button
                        class="slider-indicador"
                        type="button"
                        aria-label="Diapositiva 4"
                      ></button>

                    </div>

                    <button
                      class="slider-next"
                      type="button"
                      aria-label="Siguiente"
                    >
                      →
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </article>

          <article class="hero-slide">

            <img
              src="./img/cabecera.svg"
              alt="Cine"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  Cine
                </span>

                <h1>
                  EL CINE<br>
                  QUE NOS<br>
                  APASIONA
                </h1>

                <p>
                  Estrenos, clásicos, curiosidades y todo lo que
                  rodea al séptimo arte.
                </p>

                <div class="hero-acciones">

                  <a href="#noticias" class="boton">
                    Descubrir
                  </a>

                </div>

              </div>

            </div>

          </article>

          <article class="hero-slide">

            <img
              src="./img/cabecera.svg"
              alt="Videojuegos"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  Videojuegos
                </span>

                <h1>
                  JUGAMOS<br>
                  PORQUE<br>
                  SOMOS FANS
                </h1>

                <p>
                  Historia, actualidad, clásicos y experiencias
                  que forman parte de nuestra cultura gamer.
                </p>

                <div class="hero-acciones">

                  <a href="#multimedia" class="boton">
                    Descubrir
                  </a>

                </div>

              </div>

            </div>

          </article>

          <article class="hero-slide">

            <img
              src="./img/cabecera.svg"
              alt="Cómic y Manga"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  Cómic & Manga
                </span>

                <h1>
                  VIÑETAS<br>
                  QUE FORMAN<br>
                  PARTE DE NOSOTROS
                </h1>

                <p>
                  Cómic, manga, personajes y universos que
                  continúan acompañándonos generación tras generación.
                </p>

                <div class="hero-acciones">

                  <a href="#categorias" class="boton">
                    Descubrir
                  </a>

                </div>

              </div>

            </div>

          </article>

        </div>

      </section>

    `

  }

  configurarSlider() {

    const slides = this.shadow.querySelectorAll('.hero-slide')
    const indicadores = this.shadow.querySelectorAll('.slider-indicador')
    const anterior = this.shadow.querySelector('.slider-prev')
    const siguiente = this.shadow.querySelector('.slider-next')
    const slider = this.shadow.querySelector('.hero-slider')

    const mostrarSlide = indice => {

      this.heroActual = (indice + slides.length) % slides.length

      slides.forEach((slide, i) => {

        slide.classList.toggle(
          'activo',
          i === this.heroActual
        )

      })

      indicadores.forEach((indicador, i) => {

        indicador.classList.toggle(
          'activo',
          i === this.heroActual
        )

      })

    }

    const siguienteSlide = () => {

      mostrarSlide(this.heroActual + 1)

    }

    const anteriorSlide = () => {

      mostrarSlide(this.heroActual - 1)

    }

    anterior.addEventListener('click', evento => {

      evento.stopPropagation()

      anteriorSlide()

    })

    siguiente.addEventListener('click', evento => {

      evento.stopPropagation()

      siguienteSlide()

    })

    indicadores.forEach((indicador, indice) => {

      indicador.addEventListener('click', evento => {

        evento.stopPropagation()

        mostrarSlide(indice)

      })

    })

    slider.addEventListener('pointerdown', evento => {

      this.heroArrastrando = true
      this.heroInicioX = evento.clientX
      this.heroMovimientoX = 0

      slider.setPointerCapture(evento.pointerId)

    })

    slider.addEventListener('pointermove', evento => {

      if (!this.heroArrastrando) return

      this.heroMovimientoX =
        evento.clientX - this.heroInicioX

    })

    const finalizarArrastre = () => {

      if (!this.heroArrastrando) return

      this.heroArrastrando = false

      if (Math.abs(this.heroMovimientoX) < 50) {

        this.heroMovimientoX = 0

        return

      }

      if (this.heroMovimientoX < 0) {

        siguienteSlide()

      } else {

        anteriorSlide()

      }

      this.heroMovimientoX = 0

    }

    slider.addEventListener(
      'pointerup',
      finalizarArrastre
    )

    slider.addEventListener(
      'pointercancel',
      finalizarArrastre
    )

  }

}

customElements.define('hero-component', Hero)