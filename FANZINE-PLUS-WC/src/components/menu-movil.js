class MenuMovil extends HTMLElement {

  constructor() {

    super()

    this.attachShadow({
      mode: "open"
    })

  }


  connectedCallback() {

    this.render()

    this.iniciarTopo()

  }


  render() {

    this.shadowRoot.innerHTML =
    /*html*/`

      <style>

        :host {
          display: block;
        }


        .topo-interactivo {

          display: none;

        }


        @media (max-width: 50rem) {

          .topo-interactivo {

            position: fixed;

            top: 0;

            right: 0;

            z-index: 9999;

            display: block;

            pointer-events: none;

          }


          .topo-boton {

            position: fixed;

            top: 1rem;

            right: 1rem;

            width: 3.6rem;

            height: 3.6rem;

            padding: 0;

            border:
              0.125rem solid
              hsl(73 100% 50%);

            border-radius: 50%;

            background:
              hsl(0 0% 2%);

            color:
              hsl(0 0% 100%);

            cursor: pointer;

            display: flex;

            align-items: center;

            justify-content: center;

            box-shadow:
              0
              0.5rem
              1.5rem
              hsla(0 0% 0% / 0.45);

            transform:
              translateY(-7rem);

            opacity: 0;

            visibility: hidden;

            pointer-events: auto;

            transition:
              transform 0.45s
              cubic-bezier(
                0.22,
                0.61,
                0.36,
                1
              ),
              opacity 0.3s ease,
              visibility 0.3s ease,
              background 0.3s ease;

          }


          .topo-interactivo.topo-visible
          .topo-boton {

            transform:
              translateY(0);

            opacity: 1;

            visibility: visible;

          }


          .topo-cuerpo {

            display: block;

            font-size: 1.8rem;

            line-height: 1;

            transform:
              translateY(-0.05rem);

          }


          .topo-menu {

            position: fixed;

            top: 5.2rem;

            right: 1rem;

            width:
              min(
                17rem,
                calc(100vw - 2rem)
              );

            padding: 1.4rem;

            display: flex;

            flex-direction: column;

            align-items: stretch;

            gap: 0.15rem;

            background:
              hsl(0 0% 2%);

            border:
              0.0625rem solid
              hsl(0 0% 20%);

            box-shadow:
              0
              1rem
              3rem
              hsla(0 0% 0% / 0.55);

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

            transform:
              translateY(-0.75rem)
              scale(0.96);

            transform-origin:
              top right;

            transition:
              opacity 0.25s ease,
              visibility 0.25s ease,
              transform 0.25s ease;

          }


          .topo-interactivo.topo-menu-abierto
          .topo-menu {

            opacity: 1;

            visibility: visible;

            pointer-events: auto;

            transform:
              translateY(0)
              scale(1);

          }


          .topo-menu > a {

            position: relative;

            padding:
              0.8rem 0.5rem;

            color:
              hsl(0 0% 100%);

            font-size: 0.78rem;

            font-weight: 700;

            letter-spacing: 0.08rem;

            border-bottom:
              0.0625rem solid
              hsl(0 0% 11%);

            text-decoration: none;

            transition:
              color 0.25s ease,
              padding-left 0.25s ease;

          }


          .topo-menu > a:hover {

            color:
              hsl(73 100% 50%);

            padding-left:
              0.8rem;

          }


          .topo-redes {

            margin-top: 0.8rem;

            padding-top: 0.8rem;

            border-top:
              0.0625rem solid
              hsl(0 0% 20%);

            display: flex;

            justify-content: center;

            align-items: center;

            gap: 0.5rem;

          }


          .topo-redes a {

            width: 2rem;

            height: 2rem;

            display: flex;

            align-items: center;

            justify-content: center;

            border:
              0.0625rem solid
              hsl(0 0% 20%);

            color:
              hsl(0 0% 100%);

            text-decoration: none;

            transition:
              background 0.25s ease,
              color 0.25s ease,
              border-color 0.25s ease;

          }


          .topo-redes a:hover {

            background:
              hsl(73 100% 50%);

            border-color:
              hsl(73 100% 50%);

            color:
              hsl(0 0% 2%);

          }


          .topo-redes svg {

            display: block;

            width: 0.85rem;

            height: 0.85rem;

            flex-shrink: 0;

          }


          .topo-redes a .icon-youtube,
          .topo-redes a .icon-tiktok {

            fill: currentColor;

            stroke: none;

          }


          .topo-redes a .icon-instagram {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

            stroke-linecap: round;

            stroke-linejoin: round;

          }


          .topo-redes a .icon-instagram rect {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

          }


          .topo-redes a .icon-instagram circle {

            fill: none;

            stroke: currentColor;

            stroke-width: 1.7;

          }


          .topo-redes a .icon-instagram circle:last-child {

            fill: currentColor;

            stroke: none;

          }


          .topo-interactivo.topo-menu-abierto
          .topo-boton {

            background:
              hsl(73 100% 50%);

            color:
              hsl(0 0% 2%);

          }

        }


        @media (max-width: 30rem) {

          .topo-boton {

            top: 0.75rem;

            right: 0.75rem;

            width: 3.3rem;

            height: 3.3rem;

          }


          .topo-menu {

            top: 4.6rem;

            right: 0.75rem;

            width:
              min(
                16rem,
                calc(100vw - 1.5rem)
              );

          }

        }

      </style>


      <div class="topo-interactivo">

        <button
          class="topo-boton"
          type="button"
          aria-label="Abrir menú móvil"
          aria-expanded="false"
        >

          <span class="topo-cuerpo">☰</span>

        </button>


        <nav class="topo-menu">

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


          <div class="topo-redes">


            <a
              href="https://www.youtube.com/@fanzine_plus"
              aria-label="YouTube"
            >

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
            >

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
            >

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

      </div>

    `

  }


  iniciarTopo() {

    const topoInteractivo =
      this.shadowRoot.querySelector(
        ".topo-interactivo"
      )


    const topoBoton =
      this.shadowRoot.querySelector(
        ".topo-boton"
      )


    const topoMenu =
      this.shadowRoot.querySelector(
        ".topo-menu"
      )


    if (
      !topoInteractivo ||
      !topoBoton ||
      !topoMenu
    ) {

      return

    }


    let ultimoScroll =
      window.scrollY


    let scrollPendiente =
      false


    function esMovil() {

      return window.innerWidth <= 800

    }


    function cerrarTopoMenu() {

      topoInteractivo.classList.remove(
        "topo-menu-abierto"
      )

      topoBoton.setAttribute(
        "aria-expanded",
        "false"
      )

    }


    function abrirTopoMenu() {

      topoInteractivo.classList.add(
        "topo-menu-abierto"
      )

      topoBoton.setAttribute(
        "aria-expanded",
        "true"
      )

    }


    topoBoton.addEventListener(
      "click",
      evento => {

        evento.preventDefault()

        evento.stopPropagation()


        if (!esMovil()) {

          return

        }


        const menuAbierto =
          topoInteractivo.classList.contains(
            "topo-menu-abierto"
          )


        if (menuAbierto) {

          cerrarTopoMenu()

        } else {

          abrirTopoMenu()

        }

      }
    )


    topoMenu.addEventListener(
      "click",
      evento => {

        evento.stopPropagation()


        const enlace =
          evento.target.closest("a")


        if (enlace) {

          cerrarTopoMenu()

        }

      }
    )


    document.addEventListener(
      "click",
      evento => {

        if (
          !topoInteractivo.contains(
            evento.target
          )
        ) {

          cerrarTopoMenu()

        }

      }
    )


    const actualizarCabeceraScroll =
      () => {

        if (!esMovil()) {

          topoInteractivo.classList.remove(
            "topo-visible"
          )

          cerrarTopoMenu()

          ultimoScroll =
            window.scrollY

          return

        }


        const scrollActual =
          window.scrollY


        const diferencia =
          scrollActual - ultimoScroll


        const cabecera =
          document.querySelector(
            "cabecera-component"
          )


        if (scrollActual <= 20) {

          topoInteractivo.classList.remove(
            "topo-visible"
          )

          cerrarTopoMenu()


          if (cabecera) {

            cabecera.dispatchEvent(
              new CustomEvent(
                "mostrar-cabecera"
              )
            )

          }

        } else if (diferencia > 5) {

          topoInteractivo.classList.add(
            "topo-visible"
          )


          if (cabecera) {

            cabecera.dispatchEvent(
              new CustomEvent(
                "ocultar-cabecera"
              )
            )

          }

        } else if (diferencia < -5) {

          topoInteractivo.classList.remove(
            "topo-visible"
          )

          cerrarTopoMenu()


          if (cabecera) {

            cabecera.dispatchEvent(
              new CustomEvent(
                "mostrar-cabecera"
              )
            )

          }

        }


        ultimoScroll =
          scrollActual

      }


    window.addEventListener(
      "scroll",
      () => {

        if (scrollPendiente) {

          return

        }


        scrollPendiente = true


        requestAnimationFrame(
          () => {

            actualizarCabeceraScroll()

            scrollPendiente = false

          }
        )

      },
      {
        passive: true
      }
    )


    window.addEventListener(
      "resize",
      () => {

        if (!esMovil()) {

          topoInteractivo.classList.remove(
            "topo-visible"
          )

          cerrarTopoMenu()

        }

      }
    )


    actualizarCabeceraScroll()

  }

}


customElements.define("menu-movil-component", MenuMovil)