const fuenteRoboto = document.createElement("link");

fuenteRoboto.rel = "stylesheet";
fuenteRoboto.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap";

document.head.appendChild(fuenteRoboto);

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {

  menu.classList.toggle("menu-abierto");
  menuToggle.classList.toggle("activo");

});


/* HERO / SLIDER */

const heroSlider =
  document.querySelector(".hero-slider");

const heroSlides =
  document.querySelectorAll(".hero-slide");

const heroDots =
  document.querySelectorAll(".slider-indicadores span");

const prevButton =
  document.querySelector(".slider-prev");

const nextButton =
  document.querySelector(".slider-next");


let heroActual = 0;
let heroInicioX = 0;
let heroMovimientoX = 0;
let heroArrastrando = false;


function mostrarSlide(numero) {

  heroSlides.forEach((slide) => {

    slide.classList.remove("activo");

  });


  heroDots.forEach((dot) => {

    dot.classList.remove("activo");

  });


  heroSlides[numero].classList.add("activo");
  heroDots[numero].classList.add("activo");

}


function siguienteSlide() {

  heroActual++;

  if (heroActual >= heroSlides.length) {

    heroActual = 0;

  }

  mostrarSlide(heroActual);

}


function anteriorSlide() {

  heroActual--;

  if (heroActual < 0) {

    heroActual = heroSlides.length - 1;

  }

  mostrarSlide(heroActual);

}


/* FLECHA ANTERIOR */

prevButton.addEventListener("click", (evento) => {

  evento.stopPropagation();

  anteriorSlide();

});


/* FLECHA SIGUIENTE */

nextButton.addEventListener("click", (evento) => {

  evento.stopPropagation();

  siguienteSlide();

});


/* INDICADORES */

heroDots.forEach((dot, indice) => {

  dot.addEventListener("click", (evento) => {

    evento.stopPropagation();

    heroActual = indice;

    mostrarSlide(heroActual);

  });

});


/* ARRASTRE */

heroSlider.addEventListener(
  "pointerdown",
  (evento) => {

    if (
      evento.target.closest(".slider-controles")
    ) {

      return;

    }


    heroArrastrando = true;

    heroInicioX = evento.clientX;

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
      evento.clientX - heroInicioX;

  }
);


heroSlider.addEventListener(
  "pointerup",
  (evento) => {

    if (!heroArrastrando) {

      return;

    }


    heroMovimientoX =
      evento.clientX - heroInicioX;


    if (Math.abs(heroMovimientoX) > 50) {

      if (heroMovimientoX < 0) {

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


/* REVISTAS */

const revistasCarrusel =
  document.querySelector(
    ".revistas-carrusel"
  );


const revistaPrev =
  document.querySelector(
    ".revista-prev"
  );


const revistaNext =
  document.querySelector(
    ".revista-next"
  );


revistaNext.addEventListener("click", () => {

  revistasCarrusel.scrollBy({

    left:
      revistasCarrusel.clientWidth * 0.75,

    behavior: "smooth"

  });

});


revistaPrev.addEventListener("click", () => {

  revistasCarrusel.scrollBy({

    left:
      -revistasCarrusel.clientWidth * 0.75,

    behavior: "smooth"

  });

});


let revistaInicioX = 0;
let revistaScrollInicial = 0;
let revistaArrastrando = false;


revistasCarrusel.addEventListener(
  "pointerdown",
  (evento) => {

    revistaArrastrando = true;

    revistaInicioX = evento.clientX;

    revistaScrollInicial =
      revistasCarrusel.scrollLeft;

    revistasCarrusel.setPointerCapture(
      evento.pointerId
    );

  }
);


revistasCarrusel.addEventListener(
  "pointermove",
  (evento) => {

    if (!revistaArrastrando) {

      return;

    }


    const distancia =
      evento.clientX - revistaInicioX;


    revistasCarrusel.scrollLeft =
      revistaScrollInicial - distancia;

  }
);


revistasCarrusel.addEventListener(
  "pointerup",
  () => {

    revistaArrastrando = false;

  }
);


revistasCarrusel.addEventListener(
  "pointercancel",
  () => {

    revistaArrastrando = false;

  }
);