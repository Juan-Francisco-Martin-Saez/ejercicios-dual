const fuenteRoboto = document.createElement("link");

fuenteRoboto.rel = "stylesheet";
fuenteRoboto.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap";

document.head.appendChild(fuenteRoboto);


/* MENÚ */

const menuToggle =
  document.querySelector(".menu-toggle");

const menu =
  document.querySelector(".menu");


if (menuToggle && menu) {

  menuToggle.addEventListener(
    "click",
    () => {

      menu.classList.toggle(
        "menu-abierto"
      );

      menuToggle.classList.toggle(
        "activo"
      );

    }
  );

}


/* HERO / SLIDER */

const heroSlider =
  document.querySelector(".hero-slider");

const heroSlides =
  document.querySelectorAll(".hero-slide");

const heroDots =
  document.querySelectorAll(
    ".slider-indicadores span"
  );

const prevButton =
  document.querySelector(".slider-prev");

const nextButton =
  document.querySelector(".slider-next");


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


/* REVISTAS / COVERFLOW 3D */

const revistasCarrusel =
  document.querySelector(
    ".revistas-carrusel"
  );

const revistas =
  document.querySelectorAll(
    ".revista"
  );

const revistaPrev =
  document.querySelector(
    ".revista-prev"
  );

const revistaNext =
  document.querySelector(
    ".revista-next"
  );


/*
   LA ÚLTIMA REVISTA DEL HTML
   SIEMPRE COMIENZA EN EL CENTRO.

   Ejemplo:

   revista 01
   revista 02
   revista 03
   revista 24

   Resultado inicial:

             24
        23         01

   Si se añade una revista 25 al final:

             25
        24         01
*/

let revistaActual =
  revistas.length > 0
    ? revistas.length - 1
    : 0;


let revistaArrastrando = false;

let revistaInicioX = 0;

let revistaMovimientoX = 0;

let revistaAnimando = false;


/* CONFIGURACIÓN COVERFLOW */

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


/* DISTANCIA CIRCULAR */

function distanciaCircular(
  indice,
  centro,
  total
) {

  let distancia =
    indice - centro;


  if (
    distancia >
    total / 2
  ) {

    distancia -= total;

  }


  if (
    distancia <
    -total / 2
  ) {

    distancia += total;

  }


  return distancia;

}


/* ACTUALIZAR COVERFLOW */

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


      /* CENTRO */

      if (distancia === 0) {

        revista.style.zIndex = "100";

        revista.style.opacity = "1";

        revista.style.pointerEvents =
          "auto";

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


      /* IZQUIERDA */

      if (distancia === -1) {

        revista.style.zIndex = "90";

        revista.style.opacity = "0.95";

        revista.style.pointerEvents =
          "auto";

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


      /* DERECHA */

      if (distancia === 1) {

        revista.style.zIndex = "90";

        revista.style.opacity = "0.95";

        revista.style.pointerEvents =
          "auto";

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


      /* SEGUNDA IZQUIERDA */

      if (distancia === -2) {

        revista.style.zIndex = "70";

        revista.style.opacity = "0.5";

        revista.style.pointerEvents =
          "none";

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


      /* SEGUNDA DERECHA */

      if (distancia === 2) {

        revista.style.zIndex = "70";

        revista.style.opacity = "0.5";

        revista.style.pointerEvents =
          "none";

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


      /* RESTO DE PORTADAS */

      revista.style.zIndex = "10";

      revista.style.opacity = "0";

      revista.style.pointerEvents =
        "none";

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


/* SIGUIENTE */

function siguienteRevista() {

  if (
    revistaAnimando ||
    revistas.length < 2
  ) {

    return;

  }


  revistaAnimando = true;


  revistaActual =
    (revistaActual + 1) %
    revistas.length;


  actualizarCoverflow();


  setTimeout(
    () => {

      revistaAnimando = false;

    },
    600
  );

}


/* ANTERIOR */

function anteriorRevista() {

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


/* FLECHA SIGUIENTE */

if (revistaNext) {

  revistaNext.addEventListener(
    "click",
    (evento) => {

      evento.preventDefault();

      evento.stopPropagation();

      siguienteRevista();

    }
  );

}


/* FLECHA ANTERIOR */

if (revistaPrev) {

  revistaPrev.addEventListener(
    "click",
    (evento) => {

      evento.preventDefault();

      evento.stopPropagation();

      anteriorRevista();

    }
  );

}


/* ARRASTRE */

if (revistasCarrusel) {

  revistasCarrusel.addEventListener(
    "pointerdown",
    (evento) => {

      if (
        evento.target.closest(
          ".flecha"
        )
      ) {

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


      const desplazamiento =
        revistaMovimientoX * 0.12;


      revistas.forEach(
        (revista, indice) => {

          const distancia =
            distanciaCircular(
              indice,
              revistaActual,
              revistas.length
            );


          if (
            Math.abs(distancia) <= 2
          ) {

            revista.style.marginLeft =
              `${desplazamiento}px`;

          }

        }
      );

    }
  );


  function finalizarArrastre(
    evento
  ) {

    if (!revistaArrastrando) {
      return;
    }


    revistaMovimientoX =
      evento.clientX -
      revistaInicioX;


    revistaArrastrando = false;


    revistasCarrusel.style.cursor =
      "grab";


    revistas.forEach(
      (revista) => {

        revista.style.marginLeft =
          "0px";

      }
    );


    if (
      Math.abs(revistaMovimientoX) >
      45
    ) {

      if (
        revistaMovimientoX < 0
      ) {

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


  /* CLIC EN PORTADAS LATERALES */

  revistas.forEach(
    (revista, indice) => {

      revista.addEventListener(
        "click",
        () => {

          if (revistaArrastrando) {
            return;
          }


          const distancia =
            distanciaCircular(
              indice,
              revistaActual,
              revistas.length
            );


          if (
            distancia === -1
          ) {

            anteriorRevista();

          } else if (
            distancia === 1
          ) {

            siguienteRevista();

          }

        }
      );

    }
  );

}


/* RECALCULAR AL CAMBIAR RESOLUCIÓN */

window.addEventListener(
  "resize",
  () => {

    actualizarCoverflow();

  }
);


/* INICIALIZACIÓN */

actualizarCoverflow();