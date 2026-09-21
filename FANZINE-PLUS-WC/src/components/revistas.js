class Revistas extends HTMLElement {

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }


  connectedCallback() {

    this.render()
    this.iniciarCoverflow()

  }


  render() {

    this.shadowRoot.innerHTML = /*html*/`

      <style>

  /* =========================================================
   REVISTAS — WEB COMPONENT
========================================================= */


/* =========================================================
   BASE DEL COMPONENTE
========================================================= */

:host {

  display: block;

  width: 100%;

  overflow: hidden;

  font-family: "Roboto", sans-serif;

}


/* =========================================================
   NORMALIZACIÓN LOCAL DEL SHADOW DOM
========================================================= */

*,
*::before,
*::after {

  box-sizing: border-box;

}


img {

  max-width: 100%;

  height: auto;

}


a {

  color: inherit;

  text-decoration: none;

}


button {

  font-family: inherit;

}


/* =========================================================
   SECCIÓN
========================================================= */

.revistas {

  width: 100%;

  max-width: none;

  margin: 0 auto;

  padding: 4rem 5%;

  background: hsl(60 15% 95%);

  color: hsl(0 0% 3%);

  overflow: hidden;

}


/* =========================================================
   CABECERA DE SECCIÓN
========================================================= */

.seccion-cabecera {

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 2.7rem;

  width: 100%;

  margin-top: 2.5rem;

  margin-bottom: 1rem;

}


.subtitulo-revistas {

  display: block;

  margin-bottom: 0.7rem;

  color: hsl(76 100% 25%);

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.16rem;

}


.seccion-cabecera h2 {

  margin: 0;

  color: hsl(0 0% 3%);

  font-size: clamp(2rem, 4vw, 3.5rem);

  line-height: 0.95;

  font-weight: 900;

  letter-spacing: -0.08rem;

}


.ver-mas {

  color: hsl(0 0% 3%);

  font-size: 0.75rem;

  font-weight: 700;

  white-space: nowrap;

  transition: color 0.3s ease;

}


.ver-mas:hover {

  color: hsl(76 100% 25%);

}


/* =========================================================
   CONTENEDOR DEL CARRUSEL
========================================================= */

.revistas-wrapper {

  position: relative;

  width: 100%;

  height: 43rem;

  display: flex;

  align-items: center;

  justify-content: center;

  perspective: 2200px;

  perspective-origin: center center;

  isolation: isolate;

}


/* =========================================================
   CARRUSEL 3D
========================================================= */

.revistas-carrusel {

  position: relative;

  width: 100%;

  max-width: 110rem;

  height: 100%;

  display: block;

  transform-style: preserve-3d;

  touch-action: pan-y;

  user-select: none;

  cursor: grab;

  overflow: visible;

  z-index: 1;

}


.revistas-carrusel:active {

  cursor: grabbing;

}


/* =========================================================
   REVISTA
========================================================= */

.revista {

  position: absolute;

  top: 50%;

  left: 50%;

  width: 28rem;

  min-width: 28rem;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  transform-origin: center center;

  transform-style: preserve-3d;

  transition:
    transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.6s ease,
    filter 0.6s ease;

  will-change: transform;

  cursor: pointer;

}


/* =========================================================
   PORTADA
========================================================= */

.revista .portada {

  width: 100%;

  aspect-ratio: 0.72;

}


.portada {

  position: relative;

  width: 100%;

  aspect-ratio: 0.72;

  overflow: hidden;

  border: 0.0625rem solid hsl(0 0% 20%);

  color: hsl(0 0% 100%);

  box-shadow:
    0 1.5rem 3rem hsla(0 0% 0% / 0.16),
    0 3rem 6rem hsla(0 0% 0% / 0.08);

  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

}


/* =========================================================
   IMAGEN DE PORTADA
========================================================= */

.portada-imagen {

  position: absolute;

  inset: 0;

  z-index: 0;

  width: 100%;

  height: 100%;

  max-width: none;

  object-fit: cover;

  object-position: center;

  display: block;

  opacity: 1;

  filter: none;

}


/* =========================================================
   CAPA DE PORTADA
========================================================= */

.portada::after {

  display: none;

  content: none;

}


.portada-contenido {

  position: absolute;

  inset: 0;

  z-index: 2;

  padding: 1.75rem;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  pointer-events: none;

}


/* =========================================================
   REVISTA CENTRAL
========================================================= */

.revista.revista-centro .portada {

  border-color: hsl(73 100% 50%);

  box-shadow:
    0 2rem 3rem hsla(0 0% 0% / 0.24),
    0 3rem 6rem hsla(0 0% 0% / 0.14);

}


/* =========================================================
   HOVER
========================================================= */

.revista:hover .portada {

  border-color: hsl(73 100% 50%);

}


/* =========================================================
   TEXTO DE PORTADA
========================================================= */

.portada span {

  font-size: 0.8rem;

  font-weight: 900;

  letter-spacing: 0.1rem;

}


.portada strong {

  font-size: 5rem;

  line-height: 1;

  font-weight: 900;

}


.portada small {

  font-size: 0.8rem;

  font-weight: 700;

  letter-spacing: 0.08rem;

}


/* =========================================================
   INFORMACIÓN DE LA REVISTA
========================================================= */

.revista h3 {

  margin: 1rem 0 0.5rem;

  color: hsl(0 0% 3%);

  font-size: 1rem;

  font-weight: 800;

}


.revista a {

  color: hsl(75 100% 22%);

  font-size: 0.7rem;

  font-weight: 900;

}


/* =========================================================
   FLECHAS
========================================================= */

.flecha {

  position: absolute;

  top: 50%;

  z-index: 1000;

  width: 3.5rem;

  height: 3.5rem;

  margin: 0;

  padding: 0;

  border: 0.0625rem solid hsl(0 0% 67%);

  border-radius: 0;

  background: hsl(0 0% 100%);

  color: hsl(0 0% 3%);

  cursor: pointer;

  transform: translateY(-50%);

  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;

  pointer-events: auto;

  flex-shrink: 0;

}


/* =========================================================
   POSICIÓN DE LAS FLECHAS
========================================================= */

.revista-prev {

  left: 0;

}


.revista-next {

  right: 0;

}


/* =========================================================
   HOVER DE LAS FLECHAS
========================================================= */

.flecha:hover {

  background: hsl(73 100% 50%);

  border-color: hsl(73 100% 50%);

  color: hsl(0 0% 2%);

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 70rem) and (min-width: 50.01rem) {

  .revistas {

    padding-left: 4%;

    padding-right: 4%;

  }


  .revistas-wrapper {

    height: 38rem;

  }


  .revista {

    width: 24rem;

    min-width: 24rem;

  }

}


/* =========================================================
   MÓVIL
========================================================= */

@media (max-width: 50rem) {

  .revistas {

    padding-top: 5rem;

    padding-bottom: 5rem;

    padding-left: 5%;

    padding-right: 5%;

  }


  .seccion-cabecera {

    align-items: flex-start;

    flex-direction: column;

    margin-bottom: 2rem;

  }


  .seccion-cabecera h2 {

    font-size: 2.2rem;

  }


  .revistas-wrapper {

    width: 100%;

    height: 34rem;

    margin-left: 0;

  }


  .revistas-carrusel {

    width: 100%;

    overflow: visible;

  }


  .revista {

    width: 19rem;

    min-width: 19rem;

  }


  .portada-contenido {

    padding: 1.25rem;

  }


  .portada strong {

    font-size: 4rem;

  }


  .flecha {

    display: none;

  }

}


/* =========================================================
   MÓVIL PEQUEÑO
========================================================= */

@media (max-width: 30rem) {

  .revistas-wrapper {

    height: 31rem;

  }


  .revista {

    width: 16rem;

    min-width: 16rem;

  }


  .portada-contenido {

    padding: 1rem;

  }


  .portada strong {

    font-size: 3.2rem;

  }


  .portada span,
  .portada small {

    font-size: 0.7rem;

  }

}

      </style>


      <section class="revistas" id="revistas">

        <div class="seccion-cabecera">

          <div>

            <span class="subtitulo-revistas">
              PUBLICACIÓN DIGITAL
            </span>

            <h2>
              LA REVISTA
            </h2>

          </div>

          <a href="#" class="ver-mas">
            VER TODAS →
          </a>

        </div>


        <div class="revistas-wrapper">

          <button class="flecha revista-prev" type="button">
            ←
          </button>


          <div class="revistas-carrusel">

            <article class="revista">

              <div class="portada portada-10">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 01 - Orígenes"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº01</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-9">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 02 - Videojuegos"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº02</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-8">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 03 - Cine y TV"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº03</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-7">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 04 - Retro"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº04</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-6">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 05 - Especial"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº05</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-5">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 06 - Manga"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº06</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-4">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 07 - Cómic"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº07</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista revista-destacada">

              <div class="portada portada-3">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 08 - Videojuegos"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº08</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-2">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 09 - Cine"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº09</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>


            <article class="revista">

              <div class="portada portada-1">

                <img
                  src="./IMG/master08.webp"
                  alt="FANZINE+ Nº 10 - Retro Gaming"
                  class="portada-imagen"
                >

                <div class="portada-contenido"></div>

              </div>

              <h3>FANZINE+ Nº10</h3>

              <a href="#">
                VER REVISTA →
              </a>

            </article>

          </div>


          <button class="flecha revista-next" type="button">
            →
          </button>

        </div>

      </section>

    `
  }

  iniciarCoverflow() {

    const revistasCarrusel =
      this.shadowRoot.querySelector(
        ".revistas-carrusel"
      );


    const revistas =
      this.shadowRoot.querySelectorAll(
        ".revista"
      );


    const revistaPrev =
      this.shadowRoot.querySelector(
        ".revista-prev"
      );


    const revistaNext =
      this.shadowRoot.querySelector(
        ".revista-next"
      );


    let revistaActual =
      revistas.length > 0
        ? revistas.length - 1
        : 0;


    let revistaArrastrando = false;

    let revistaInicioX = 0;

    let revistaMovimientoX = 0;

    let revistaAnimando = false;


    function obtenerConfiguracionCoverflow() {

      const ancho =
        window.innerWidth;


      if (ancho <= 500) {

        return {
          separacion: 62,
          escalaCentro: 1,
          escalaLateral: 0.76,
          escalaExterior: 0.56,
          rotacionLateral: 48,
          profundidadCentro: 120,
          profundidadLateral: -25,
          profundidadExterior: -130
        };

      }


      if (ancho <= 800) {

        return {
          separacion: 68,
          escalaCentro: 1,
          escalaLateral: 0.78,
          escalaExterior: 0.58,
          rotacionLateral: 50,
          profundidadCentro: 135,
          profundidadLateral: -35,
          profundidadExterior: -155
        };

      }


      if (ancho <= 1120) {

        return {
          separacion: 74,
          escalaCentro: 1,
          escalaLateral: 0.8,
          escalaExterior: 0.6,
          rotacionLateral: 52,
          profundidadCentro: 150,
          profundidadLateral: -40,
          profundidadExterior: -175
        };

      }


      return {
        separacion: 82,
        escalaCentro: 1,
        escalaLateral: 0.82,
        escalaExterior: 0.62,
        rotacionLateral: 54,
        profundidadCentro: 175,
        profundidadLateral: -45,
        profundidadExterior: -200
      };

    }


    function distanciaCircular(
      indice,
      centro,
      total
    ) {

      let distancia =
        centro - indice;


      if (distancia > total / 2) {

        distancia -= total;

      }


      if (distancia < -total / 2) {

        distancia += total;

      }


      return distancia;

    }


    function actualizarCoverflow() {

      if (
        !revistasCarrusel ||
        !revistas.length
      ) {

        return;

      }


      const configuracion =
        obtenerConfiguracionCoverflow();


      revistas.forEach(
        (revista, indice) => {

          const distancia =
            distanciaCircular(
              indice,
              revistaActual,
              revistas.length
            );


          revista.classList.toggle(
            "revista-centro",
            distancia === 0
          );


          revista.style.marginLeft =
            "0px";


          if (distancia === 0) {

            revista.style.zIndex = "100";

            revista.style.opacity = "1";

            revista.style.pointerEvents = "auto";

            revista.style.filter =
              "brightness(1)";

            revista.style.transform =
              `
              translate3d(
                -50%,
                -50%,
                ${configuracion.profundidadCentro}px
              )
              rotateY(0deg)
              scale(${configuracion.escalaCentro})
              `;

            return;

          }


          if (distancia === -1) {

            revista.style.zIndex = "90";

            revista.style.opacity = "0.95";

            revista.style.pointerEvents = "auto";

            revista.style.filter =
              "brightness(0.82)";

            revista.style.transform =
              `
              translate3d(
                calc(-50% - ${configuracion.separacion}%),
                -50%,
                ${configuracion.profundidadLateral}px
              )
              rotateY(${configuracion.rotacionLateral}deg)
              scale(${configuracion.escalaLateral})
              `;

            return;

          }


          if (distancia === 1) {

            revista.style.zIndex = "90";

            revista.style.opacity = "0.95";

            revista.style.pointerEvents = "auto";

            revista.style.filter =
              "brightness(0.82)";

            revista.style.transform =
              `
              translate3d(
                calc(-50% + ${configuracion.separacion}%),
                -50%,
                ${configuracion.profundidadLateral}px
              )
              rotateY(-${configuracion.rotacionLateral}deg)
              scale(${configuracion.escalaLateral})
              `;

            return;

          }


          if (distancia === -2) {

            revista.style.zIndex = "70";

            revista.style.opacity = "0.5";

            revista.style.pointerEvents = "none";

            revista.style.filter =
              "brightness(0.62)";

            revista.style.transform =
              `
              translate3d(
                calc(-50% - ${configuracion.separacion * 1.65}%),
                -50%,
                ${configuracion.profundidadExterior}px
              )
              rotateY(${configuracion.rotacionLateral + 8}deg)
              scale(${configuracion.escalaExterior})
              `;

            return;

          }


          if (distancia === 2) {

            revista.style.zIndex = "70";

            revista.style.opacity = "0.5";

            revista.style.pointerEvents = "none";

            revista.style.filter =
              "brightness(0.62)";

            revista.style.transform =
              `
              translate3d(
                calc(-50% + ${configuracion.separacion * 1.65}%),
                -50%,
                ${configuracion.profundidadExterior}px
              )
              rotateY(-${configuracion.rotacionLateral + 8}deg)
              scale(${configuracion.escalaExterior})
              `;

            return;

          }


          revista.style.zIndex = "10";

          revista.style.opacity = "0";

          revista.style.pointerEvents = "none";

          revista.style.filter =
            "brightness(0.4)";

          revista.style.transform =
            `
            translate3d(
              -50%,
              -50%,
              -500px
            )
            rotateY(0deg)
            scale(0.4)
            `;

        }
      );

    }


    function siguienteRevista() {

      if (
        revistaAnimando ||
        revistas.length < 2
      ) {

        return;

      }


      revistaAnimando = true;

      revistaActual--;


      if (revistaActual < 0) {

        revistaActual =
          revistas.length - 1;

      }


      actualizarCoverflow();


      setTimeout(
        () => {

          revistaAnimando = false;

        },
        600
      );

    }


    function anteriorRevista() {

      if (
        revistaAnimando ||
        revistas.length < 2
      ) {

        return;

      }


      revistaAnimando = true;

      revistaActual++;


      if (
        revistaActual >=
        revistas.length
      ) {

        revistaActual = 0;

      }


      actualizarCoverflow();


      setTimeout(
        () => {

          revistaAnimando = false;

        },
        600
      );

    }


    /* =====================================
       FLECHA IZQUIERDA
    ===================================== */

    if (revistaPrev) {

      revistaPrev.addEventListener(
        "pointerdown",
        (evento) => {

          evento.preventDefault();

          evento.stopPropagation();

        }
      );


      revistaPrev.addEventListener(
        "click",
        (evento) => {

          evento.preventDefault();

          evento.stopPropagation();

          anteriorRevista();

        }
      );

    }


    /* =====================================
       FLECHA DERECHA
    ===================================== */

    if (revistaNext) {

      revistaNext.addEventListener(
        "pointerdown",
        (evento) => {

          evento.preventDefault();

          evento.stopPropagation();

        }
      );


      revistaNext.addEventListener(
        "click",
        (evento) => {

          evento.preventDefault();

          evento.stopPropagation();

          siguienteRevista();

        }
      );

    }


    /* =====================================
       ARRASTRE
    ===================================== */

    if (revistasCarrusel) {

      revistasCarrusel.addEventListener(
        "pointerdown",
        (evento) => {

          if (
            evento.target.closest(".flecha")
          ) {

            return;

          }


          if (revistaAnimando) {

            return;

          }


          revistaArrastrando = true;

          revistaInicioX =
            evento.clientX;

          revistaMovimientoX = 0;


          revistasCarrusel.setPointerCapture(
            evento.pointerId
          );


          revistasCarrusel.style.cursor =
            "grabbing";

        }
      );


      revistasCarrusel.addEventListener(
        "pointermove",
        (evento) => {

          if (!revistaArrastrando) {

            return;

          }


          revistaMovimientoX =
            evento.clientX -
            revistaInicioX;

        }
      );


      function finalizarArrastre(evento) {

        if (!revistaArrastrando) {

          return;

        }


        revistaMovimientoX =
          evento.clientX -
          revistaInicioX;


        revistaArrastrando = false;


        revistasCarrusel.style.cursor =
          "grab";


        if (
          Math.abs(revistaMovimientoX) > 45
        ) {

          if (revistaMovimientoX < 0) {

            siguienteRevista();

          } else {

            anteriorRevista();

          }

        }


        if (
          evento.pointerId !== undefined &&
          revistasCarrusel.hasPointerCapture(
            evento.pointerId
          )
        ) {

          revistasCarrusel.releasePointerCapture(
            evento.pointerId
          );

        }

      }


      revistasCarrusel.addEventListener(
        "pointerup",
        finalizarArrastre
      );


      revistasCarrusel.addEventListener(
        "pointercancel",
        finalizarArrastre
      );


      revistasCarrusel.addEventListener(
        "lostpointercapture",
        (evento) => {

          if (!revistaArrastrando) {

            return;

          }


          finalizarArrastre(evento);

        }
      );


      revistas.forEach(
        (revista, indice) => {

          revista.addEventListener(
            "click",
            () => {

              if (
                revistaArrastrando ||
                revistaAnimando
              ) {

                return;

              }


              const distancia =
                distanciaCircular(
                  indice,
                  revistaActual,
                  revistas.length
                );


              if (distancia === 1) {

                siguienteRevista();

              } else if (
                distancia === -1
              ) {

                anteriorRevista();

              }

            }
          );

        }
      );

    }


    window.addEventListener(
      "resize",
      actualizarCoverflow
    );


    actualizarCoverflow();

  }

}


customElements.define("revistas-component", Revistas);