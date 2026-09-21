class Cabecera extends HTMLElement {

  constructor() {

    super()

    this.shadow = this.attachShadow({
      mode: "open"
    })

  }


  connectedCallback() {

    this.render()

    this.iniciarMenu()


    const cabecera =
      this.shadow.querySelector(
        ".cabecera"
      )


    this.addEventListener(
      "ocultar-cabecera",
      () => {

        cabecera.classList.add(
          "cabecera-oculta"
        )

      }
    )


    this.addEventListener(
      "mostrar-cabecera",
      () => {

        cabecera.classList.remove(
          "cabecera-oculta"
        )

      }
    )

  }


  render() {

    this.shadow.innerHTML =
    /*html*/`

      <style>

        :host {
          display: block;
          width: 100%;
          font-family: "Roboto", sans-serif;

          position: sticky;

          top: 0;

          z-index: 10000;
        }


        .cabecera {

          width: 100%;

          min-height: 5rem;

          background:
            hsl(0 0% 2%);

          border-bottom:
            0.0625rem solid
            hsl(0 0% 14%);

          overflow: visible;

          padding-left: 5%;
          padding-right: 5%;

          box-sizing: border-box;

          transition:
            transform 0.4s ease,
            opacity 0.4s ease;

        }


        .cabecera-oculta {

          transform:
            translateY(-100%);

          opacity: 0;

        }


        .cabecera-contenedor {

          width: 100%;

          max-width: 100%;

          min-height: 5rem;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            auto
            minmax(0, 1fr);

          align-items: center;

          position: relative;

        }


        logo-component {

          display: flex;

          align-items: center;

          justify-self: start;

          min-width: 0;

        }


        .menu {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 2rem;

          justify-self: center;

        }


        .menu a {

          position: relative;

          color:
            hsl(0 0% 100%);

          font-size: 0.8rem;

          font-weight: 700;

          letter-spacing: 0.08rem;

          text-decoration: none;

          transition:
            color 0.3s ease;

        }


        .menu a::after {

          content: "";

          position: absolute;

          left: 0;

          bottom: -0.5rem;

          width: 0;

          height: 0.125rem;

          background:
            hsl(73 100% 50%);

          transition:
            width 0.3s ease;

        }


        .menu a:hover {

          color:
            hsl(73 100% 50%);

        }


        .menu a:hover::after {

          width: 100%;

        }


        .redes {

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 0.75rem;

          justify-self: end;

        }


        .redes-escritorio {

          display: flex;

        }


        .redes-movil {

          display: none;

        }


        .redes a {

          width: 3.1rem;

          height: 3.1rem;

          border:
            0.0625rem solid
            hsl(0 0% 23%);

          display: flex;

          align-items: center;

          justify-content: center;

          color:
            hsl(0 0% 100%);

          text-decoration: none;

          transition:
            all 0.3s ease;

        }


        .redes svg {

          display: block;

          width: 1.6rem;

          height: 1.6rem;

          flex-shrink: 0;

        }


        .redes a .icon-youtube,
        .redes a .icon-tiktok {

          fill: currentColor;

          stroke: none;

        }


        .redes a .icon-instagram {

          fill: none;

          stroke: currentColor;

          stroke-width: 1.7;

          stroke-linecap: round;

          stroke-linejoin: round;

        }


        .redes a .icon-instagram rect {

          fill: none;

          stroke: currentColor;

          stroke-width: 1.7;

        }


        .redes a .icon-instagram circle {

          fill: none;

          stroke: currentColor;

          stroke-width: 1.7;

        }


        .redes a .icon-instagram circle:last-child {

          fill: currentColor;

          stroke: none;

        }


        .redes a:hover {

          background:
            hsl(73 100% 50%);

          border-color:
            hsl(73 100% 50%);

          color:
            hsl(0 0% 2%);

        }


        .menu-toggle {

          display: none;

          width: 2.75rem;

          height: 2.75rem;

          padding: 0;

          border: 0;

          background:
            transparent;

          cursor: pointer;

          flex-direction: column;

          justify-content: center;

          align-items: center;

          gap: 0.35rem;

        }


        .menu-toggle span {

          display: block;

          width: 1.7rem;

          height: 0.125rem;

          background:
            hsl(0 0% 100%);

          transition:
            all 0.3s ease;

        }


        .menu-toggle.activo
        span:nth-child(1) {

          transform:
            translateY(0.475rem)
            rotate(45deg);

        }


        .menu-toggle.activo
        span:nth-child(2) {

          opacity: 0;

        }


        .menu-toggle.activo
        span:nth-child(3) {

          transform:
            translateY(-0.475rem)
            rotate(-45deg);

        }


        @media (
          max-width: 70rem
        ) and (
          min-width: 50.01rem
        ) {

          .cabecera-contenedor {

            width: 92%;

          }


          .menu {

            gap: 0.85rem;

          }


          .menu a {

            font-size: 0.72rem;

            letter-spacing: 0.045rem;

            white-space: nowrap;

          }


          .menu a::after {

            bottom: -0.4rem;

          }


          .redes {

            gap: 0.45rem;

          }


          .redes a {

            width: 2.55rem;

            height: 2.55rem;

          }


          .redes svg {

            width: 1.3rem;

            height: 1.3rem;

          }

        }


        @media (
          max-width: 50rem
        ) {

          .cabecera {

            min-height: 4.5rem;

          }


          .cabecera-contenedor {

            width: 92%;

            min-height: 4.5rem;

            display: grid;

            grid-template-columns:
              minmax(0, 1fr)
              auto;

            align-items: center;

            justify-content: initial;

            gap: 0.5rem;

          }


          logo-component {

            justify-self: start;

          }


          .menu-toggle {

            display: flex;

            margin-left: 0;

            justify-self: end;

            flex-shrink: 0;

          }


          .menu {

            position: absolute;

            top: 4.5rem;

            left: 0;

            width: 100%;

            padding: 1.5rem;

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 1.35rem;

            background:
              hsl(0 0% 2%);

            border:
              0.0625rem solid
              hsl(0 0% 13%);

            border-top: 0;

            opacity: 0;

            visibility: hidden;

            transform:
              translateY(-1rem);

            transition:
              all 0.3s ease;

          }


          .menu.menu-abierto {

            opacity: 1;

            visibility: visible;

            transform:
              translateY(0);

          }


          .menu > a {

            width: 100%;

            text-align: center;

            font-size: 0.8rem;

            line-height: 1.2;

            padding:
              0.15rem 0;

          }


          .menu > a::after {

            left: 50%;

            transform:
              translateX(-50%);

          }


          .menu > a:hover::after {

            width: 100%;

          }


          .redes-escritorio {

            display: none;

          }


          .menu .redes-movil {

            position: static;

            width: 100%;

            height: auto;

            min-height: 4rem;

            margin-top: 0.25rem;

            padding:
              1rem 0 0;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 0.65rem;

            border-top:
              0.0625rem solid
              hsl(0 0% 13%);

          }


          .menu .redes-movil a {

            position: static;

            width: 2.7rem;

            height: 2.7rem;

            min-width: 2.7rem;

            min-height: 2.7rem;

            padding: 0;

            margin: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border:
              0.0625rem solid
              hsl(0 0% 23%);

            background:
              transparent;

            color:
              hsl(0 0% 100%);

            font-size: 0;

            line-height: 0;

            letter-spacing: 0;

            transform: none;

          }


          .menu .redes-movil a::after {

            content: none;

            display: none;

          }


          .menu .redes-movil a:hover {

            background:
              hsl(73 100% 50%);

            border-color:
              hsl(73 100% 50%);

            color:
              hsl(0 0% 2%);

            transform: none;

          }


          .menu .redes-movil svg {

            display: block;

            width: 1.35rem;

            height: 1.35rem;

            margin: 0;

            flex-shrink: 0;

          }


          .menu .redes-movil a .icon-youtube,
          .menu .redes-movil a .icon-tiktok {

            fill: currentColor;

            stroke: none;

          }


          .menu .redes-movil a .icon-instagram {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

            stroke-linecap: round;

            stroke-linejoin: round;

          }


          .menu .redes-movil a .icon-instagram rect {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

          }


          .menu .redes-movil a .icon-instagram circle {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

          }


          .menu .redes-movil a .icon-instagram circle:last-child {

            fill: currentColor;

            stroke: none;

          }

        }


        @media (
          max-width: 30rem
        ) {

          .cabecera-contenedor {

            width: 94%;

            grid-template-columns:
              minmax(0, 1fr)
              auto;

            gap: 0.35rem;

          }


          .menu .redes-movil {

            gap: 0.5rem;

          }


          .menu .redes-movil a {

            width: 2.35rem;

            height: 2.35rem;

            min-width: 2.35rem;

            min-height: 2.35rem;

          }


          .menu-toggle {

            width: 2.5rem;

            height: 2.5rem;

          }

        }

      </style>


      <header class="cabecera" id="inicio">

        <div class="cabecera-contenedor">


          <logo-component></logo-component>


          <nav class="menu">

            <a href="#inicio">
              INICIO
            </a>

            <a href="#revistas">
              REVISTAS
            </a>

            <a href="#noticias">
              NOTICIAS
            </a>

            <a href="#multimedia">
              MULTIMEDIA
            </a>

            <a href="#explora">
              EXPLORA
            </a>

            <a href="#sobre-fanzine">
              SOBRE FANZINE+
            </a>


            <div class="redes redes-movil">


              <a
                href="https://www.youtube.com/@fanzine_plus"
                aria-label="YouTube"
                target="_blank">

                <svg
                  class="icon-youtube"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path
                    d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"
                    fill="currentColor"
                  />

                </svg>

              </a>


              <a
                href="https://www.instagram.com/fanzine_plus/"
                aria-label="Instagram"
                target="_blank">

                <svg
                  class="icon-instagram"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  ></rect>

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  ></circle>

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                  ></circle>

                </svg>

              </a>


              <a
                href="https://www.tiktok.com/@fanzine_plus"
                aria-label="TikTok"
                target="_blank">

                <svg
                  class="icon-tiktok"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path
                    d="M16.5 3c.3 2.4 1.7 4.2 4.5 4.5v3.1c-1.6-.1-3-.6-4.3-1.5v7.1c0 4.1-2.7 6.8-6.5 6.8-3.7 0-6.2-2.5-6.2-5.8 0-3.5 2.7-6.1 6.4-6.1.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.6 0-2.8 1.1-2.8 2.8 0 1.5 1.1 2.7 2.7 2.7 1.8 0 2.8-1.2 2.8-3.4V3h3.4Z"
                  />

                </svg>

              </a>


            </div>

          </nav>


          <div class="redes redes-escritorio">


            <a
              href="https://www.youtube.com/@fanzine_plus"
              aria-label="YouTube"
              target="_blank">

              <svg
                class="icon-youtube"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"
                  fill="currentColor"
                />

              </svg>

            </a>


            <a
              href="https://www.instagram.com/fanzine_plus/"
              aria-label="Instagram"
              target="_blank">

              <svg
                class="icon-instagram"
                viewBox="0 0 24 24"
                aria-hidden="true">

                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                ></rect>

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                ></circle>

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                ></circle>

              </svg>

            </a>


            <a
              href="https://www.tiktok.com/@fanzine_plus"
              aria-label="TikTok"
              target="_blank">

              <svg
                class="icon-tiktok"
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                  d="M16.5 3c.3 2.4 1.7 4.2 4.5 4.5v3.1c-1.6-.1-3-.6-4.3-1.5v7.1c0 4.1-2.7 6.8-6.5 6.8-3.7 0-6.2-2.5-6.2-5.8 0-3.5 2.7-6.1 6.4-6.1.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.6 0-2.8 1.1-2.8 2.8 0 1.5 1.1 2.7 2.7 2.7 1.8 0 2.8-1.2 2.8-3.4V3h3.4Z"
                />

              </svg>

            </a>


          </div>


          <button
            class="menu-toggle"
            type="button"
            aria-label="Abrir menú"
            aria-expanded="false">

            <span></span>
            <span></span>
            <span></span>

          </button>


        </div>

      </header>

    `

  }


  iniciarMenu() {

    const menuToggle =
      this.shadow.querySelector(
        ".menu-toggle"
      )


    const menu =
      this.shadow.querySelector(
        ".menu"
      )


    if (
      !menuToggle ||
      !menu
    ) {

      return

    }


    menuToggle.addEventListener(
      "click",
      () => {

        const abierto =
          menu.classList.toggle(
            "menu-abierto"
          )


        menuToggle.classList.toggle(
          "activo",
          abierto
        )


        menuToggle.setAttribute(
          "aria-expanded",
          abierto
        )

      }
    )


    const enlaces =
      menu.querySelectorAll(
        "a"
      )


    enlaces.forEach(
      enlace => {

        enlace.addEventListener(
          "click",
          () => {

            menu.classList.remove(
              "menu-abierto"
            )

            menuToggle.classList.remove(
              "activo"
            )

            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            )

          }
        )

      }
    )

  }

}


customElements.define("cabecera-component", Cabecera)