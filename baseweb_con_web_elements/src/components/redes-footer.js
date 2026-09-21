class RedesFooter extends HTMLElement {

  constructor() {

    super()

    this.shadow = this.attachShadow({ mode: 'open' })

  }

  connectedCallback() {

    this.render()

  }

  render() {

    this.shadow.innerHTML =
    /*html*/`

      <style>

        .redes-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }

        .redes-footer-titulo {
          margin: 0 0 1rem;
          color: hsl(0, 0%, 95%);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .redes-footer-lista {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .red-social-footer {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.4rem;
          height: 2.4rem;
          border: 0.1rem solid hsl(0, 0%, 35%);
          border-radius: 50%;
          color: hsl(0, 0%, 95%);
          background: hsl(0, 0%, 10%);
          transition:
            color 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .red-social-footer svg {
          width: 1rem;
          height: 1rem;
          fill: currentColor;
        }

        .red-social-footer:hover {
          color: hsl(0, 0%, 5%);
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          transform: translateY(-0.15rem);
        }

        .red-social-footer:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

      </style>

      <section class="redes-footer">

        <h2 class="redes-footer-titulo">
          Síguenos
        </h2>

        <ul class="redes-footer-lista">

          <li>

            <a
              href="#"
              class="red-social-footer"
              aria-label="YouTube"
            >

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z"/>
              </svg>

            </a>

          </li>

          <li>

            <a
              href="#"
              class="red-social-footer"
              aria-label="Instagram"
            >

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
              </svg>

            </a>

          </li>

          <li>

            <a
              href="#"
              class="red-social-footer"
              aria-label="TikTok"
            >

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.5 2h3.1c.2 1.7 1.1 3.2 2.4 4.2 1 .8 2.2 1.3 3.5 1.4v3.2a10.1 10.1 0 0 1-5.9-1.9v7.7a7.4 7.4 0 1 1-7.4-7.4c.4 0 .8 0 1.2.1v3.3a4.3 4.3 0 1 0 3.1 4.1V2Z"/>
              </svg>

            </a>

          </li>

        </ul>

      </section>

    `

  }

}

customElements.define('redes-footer-component', RedesFooter);