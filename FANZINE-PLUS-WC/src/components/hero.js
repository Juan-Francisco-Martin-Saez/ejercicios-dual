class Hero extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({
      mode: "open"
    });

  }


  connectedCallback() {

    this.render();

    this.iniciarSlider();

  }


  render() {

    this.shadowRoot.innerHTML =
/*html*/`
      <style>

        * {
          box-sizing: border-box;
        }

        :host {
          font-family: "Roboto", sans-serif;
        }

        img {
          max-width: 100%;
          height: auto;
          object-fit: cover;
        }


        a {
          color: inherit;
          text-decoration: none;
        }


        button {
          font-family: inherit;
        }


        .hero {
          position: relative;
          width: 100%;
          height: calc(100vh - 5rem);
          min-height: 40rem;
          background: hsl(0 0% 3%);
          overflow: hidden;
        }


        .hero-slider {
          position: relative;
          width: 100%;
          height: 100%;
          touch-action: pan-y;
          user-select: none;
        }


        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          overflow: hidden;
          transition: opacity 0.5s ease;
          background: hsl(0 0% 3%);
        }


        .hero-slide.activo {
          opacity: 1;
          visibility: visible;
        }


        .hero-fondo {
          position: absolute;
          inset: 0;
          width: 100%;
          max-width: none;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }


        .hero-slide::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              hsla(0 0% 2% / 0.95) 0%,
              hsla(0 0% 2% / 0.82) 35%,
              hsla(0 0% 2% / 0.35) 75%,
              hsla(0 0% 2% / 0.75) 100%
            ),
            linear-gradient(
              180deg,
              hsla(0 0% 0% / 0.05),
              hsla(0 0% 2% / 0.8)
            );
        }


        .hero-slide:nth-child(1) {
          background-color: hsl(0 0% 6%);
        }


        .hero-slide:nth-child(2) {
          background-color: hsl(0 0% 9%);
        }


        .hero-slide:nth-child(3) {
          background-color: hsl(120 16% 6%);
        }


        .hero-slide:nth-child(4) {
          background-color: hsl(40 10% 6%);
        }


        .hero-contenedor {
          width: 90%;
          max-width: 90rem;
          height: 100%;
          margin: 0 auto;
          position: relative;
          display: flex;
          align-items: center;
          z-index: 2;
        }


        .hero-contenido {
          width: min(42rem, 65%);
        }


        .etiqueta {
          display: inline-block;
          margin-bottom: 1.25rem;
          color: hsl(73 100% 50%);
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.15rem;
        }


        .hero h1 {
          margin: 0;
          color: hsl(0 0% 100%);
          font-size: clamp(3rem, 6vw, 6rem);
          line-height: 1.1;
          font-weight: 900;
        }


        .hero p {
          max-width: 32rem;
          margin: 2rem 0;
          color: hsl(0 0% 80%);
          font-size: 1rem;
          line-height: 1.6;
        }


        .boton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.8rem 1.8rem;
          background: hsl(73 100% 50%);
          color: hsl(0 0% 2%);
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 0.08rem;
          transition: all 0.3s ease;
        }


        .boton:hover {
          background: hsl(0 0% 100%);
          transform: translateY(-0.15rem);
        }


        .slider-controles {
          position: absolute;
          right: 5%;
          bottom: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          z-index: 10;
        }


        .slider-controles button {
          width: 3rem;
          height: 3rem;
          border: 0.0625rem solid hsl(0 0% 33%);
          background: hsla(0 0% 0% / 0.65);
          color: hsl(0 0% 100%);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }


        .slider-controles button:hover {
          background: hsl(73 100% 50%);
          border-color: hsl(73 100% 50%);
          color: hsl(0 0% 2%);
        }


        .slider-indicadores {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }


        .slider-indicadores span {
          width: 0.5rem;
          height: 0.5rem;
          background: hsl(0 0% 33%);
          border-radius: 50%;
          transition: all 0.3s ease;
        }


        .slider-indicadores span.activo {
          width: 1.7rem;
          border-radius: 1rem;
          background: hsl(73 100% 50%);
        }


        @media (max-width: 50rem) {

          .hero {
            height: 75vh;
            min-height: 32rem;
          }


          .hero-contenido {
            width: 100%;
            padding-top: 3rem;
          }


          .hero h1 {
            font-size: clamp(2.7rem, 12vw, 4.5rem);
          }


          .hero p {
            max-width: 28rem;
            font-size: 0.9rem;
          }


          .slider-controles {
            right: 4%;
            bottom: 1.5rem;
          }


          .slider-controles button {
            width: 2.7rem;
            height: 2.7rem;
          }

        }


        @media (max-width: 30rem) {

          .hero {
            min-height: 30rem;
          }


          .hero h1 {
            font-size: 2.6rem;
          }


          .hero p {
            font-size: 0.85rem;
          }


          .slider-controles {
            right: 3%;
            gap: 0.5rem;
          }


          .slider-indicadores {
            gap: 0.3rem;
          }

        }

      </style>


      <section class="hero">

        <div class="hero-slider">


          <article class="hero-slide activo">

            <img
              src="./IMG/master08.webp"
              alt="Fanzine+"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  ESPECIAL RETRO
                </span>

                <h1>
                  ¡DESCARGA<br>
                  ÚLTIMO<br>
                  NÚMERO!
                </h1>

                <p>
                  Videojuegos, cine, cómic y cultura pop
                  para los que nunca dejamos de ser fans.
                </p>

                <a href="#" class="boton">
                  DESCUBRIR
                </a>

              </div>

            </div>

          </article>


          <article class="hero-slide">

            <img
              src="./IMG/CABECERA.svg"
              alt="Fanzine+"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  CINE
                </span>

                <h1>
                  EL CINE QUE<br>
                  MARCÓ NUESTRA<br>
                  GENERACIÓN
                </h1>

                <p>
                  Películas, personajes y momentos
                  que siguen formando parte de nuestra historia.
                </p>

                <a href="#" class="boton">
                  DESCUBRIR
                </a>

              </div>

            </div>

          </article>


          <article class="hero-slide">

            <img
              src="./IMG/CABECERA.svg"
              alt="Fanzine+"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  VIDEOJUEGOS
                </span>

                <h1>
                  PIXELES QUE<br>
                  NUNCA<br>
                  OLVIDAMOS
                </h1>

                <p>
                  Consolas, arcades y videojuegos
                  que hicieron historia.
                </p>

                <a href="#" class="boton">
                  DESCUBRIR
                </a>

              </div>

            </div>

          </article>


          <article class="hero-slide">

            <img
              src="./IMG/CABECERA.svg"
              alt="Fanzine+"
              class="hero-fondo"
            >

            <div class="hero-contenedor">

              <div class="hero-contenido">

                <span class="etiqueta">
                  CÓMIC & MANGA
                </span>

                <h1>
                  HÉROES DE<br>
                  PAPEL QUE<br>
                  TRASCIENDEN
                </h1>

                <p>
                  Cómic, manga y personajes
                  que forman parte de nuestra cultura.
                </p>

                <a href="#" class="boton">
                  DESCUBRIR
                </a>

              </div>

            </div>

          </article>


          <div class="slider-controles">

            <button
              class="slider-prev"
              type="button"
              aria-label="Slide anterior"
            >
              ←
            </button>


            <div class="slider-indicadores">

              <span class="activo"></span>
              <span></span>
              <span></span>
              <span></span>

            </div>


            <button
              class="slider-next"
              type="button"
              aria-label="Siguiente slide"
            >
              →
            </button>

          </div>


        </div>

      </section>

    `;

  }


  iniciarSlider() {

    const heroSlider =
      this.shadowRoot.querySelector(".hero-slider");

    const heroSlides =
      this.shadowRoot.querySelectorAll(".hero-slide");

    const heroDots =
      this.shadowRoot.querySelectorAll(
        ".slider-indicadores span"
      );

    const prevButton =
      this.shadowRoot.querySelector(".slider-prev");

    const nextButton =
      this.shadowRoot.querySelector(".slider-next");


    let heroActual = 0;
    let heroInicioX = 0;
    let heroMovimientoX = 0;
    let heroArrastrando = false;


    function mostrarSlide(numero) {

      if (!heroSlides.length) {
        return;
      }


      heroSlides.forEach(
        (slide) => {

          slide.classList.remove(
            "activo"
          );

        }
      );


      heroDots.forEach(
        (dot) => {

          dot.classList.remove(
            "activo"
          );

        }
      );


      heroSlides[numero].classList.add(
        "activo"
      );


      if (heroDots[numero]) {

        heroDots[numero].classList.add(
          "activo"
        );

      }

    }


    function siguienteSlide() {

      heroActual++;


      if (
        heroActual >=
        heroSlides.length
      ) {

        heroActual = 0;

      }


      mostrarSlide(heroActual);

    }


    function anteriorSlide() {

      heroActual--;


      if (heroActual < 0) {

        heroActual =
          heroSlides.length - 1;

      }


      mostrarSlide(heroActual);

    }


    if (prevButton) {

      prevButton.addEventListener(
        "click",
        (evento) => {

          evento.stopPropagation();

          anteriorSlide();

        }
      );

    }


    if (nextButton) {

      nextButton.addEventListener(
        "click",
        (evento) => {

          evento.stopPropagation();

          siguienteSlide();

        }
      );

    }


    heroDots.forEach(
      (dot, indice) => {

        dot.addEventListener(
          "click",
          (evento) => {

            evento.stopPropagation();

            heroActual = indice;

            mostrarSlide(heroActual);

          }
        );

      }
    );


    if (heroSlider) {

      heroSlider.addEventListener(
        "pointerdown",
        (evento) => {

          if (
            evento.target.closest(
              ".slider-controles"
            )
          ) {

            return;

          }


          heroArrastrando = true;


          heroInicioX =
            evento.clientX;


          heroMovimientoX = 0;


          heroSlider.setPointerCapture(
            evento.pointerId
          );

        }
      );


      heroSlider.addEventListener(
        "pointermove",
        (evento) => {

          if (!heroArrastrando) {
            return;
          }


          heroMovimientoX =
            evento.clientX -
            heroInicioX;

        }
      );


      heroSlider.addEventListener(
        "pointerup",
        (evento) => {

          if (!heroArrastrando) {
            return;
          }


          heroMovimientoX =
            evento.clientX -
            heroInicioX;


          if (
            Math.abs(heroMovimientoX) >
            50
          ) {

            if (
              heroMovimientoX < 0
            ) {

              siguienteSlide();

            } else {

              anteriorSlide();

            }

          }


          heroArrastrando = false;


          if (
            heroSlider.hasPointerCapture(
              evento.pointerId
            )
          ) {

            heroSlider.releasePointerCapture(
              evento.pointerId
            );

          }

        }
      );


      heroSlider.addEventListener(
        "pointercancel",
        (evento) => {

          heroArrastrando = false;


          if (
            heroSlider.hasPointerCapture(
              evento.pointerId
            )
          ) {

            heroSlider.releasePointerCapture(
              evento.pointerId
            );

          }

        }
      );

    }

  }

}


customElements.define("hero-component", Hero);