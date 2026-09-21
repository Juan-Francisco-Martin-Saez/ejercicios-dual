class Redes extends HTMLElement {

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

        .redes {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          min-width: 0;
        }

        .redes-lista {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .red-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.4rem;
          height: 2.4rem;
          border: 0.1rem solid hsl(0, 0%, 35%);
          border-radius: 50%;
          color: hsl(0, 0%, 95%);
          background: hsl(0, 0%, 10%);
          transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .red-social svg {
          width: 1rem;
          height: 1rem;
          fill: currentColor;
        }

        .red-social:hover {
          color: hsl(0, 0%, 5%);
          background: hsl(73, 100%, 50%);
          border-color: hsl(73, 100%, 50%);
          transform: translateY(-0.15rem);
        }

        .red-social:focus-visible {
          outline: 0.15rem solid hsl(73, 100%, 50%);
          outline-offset: 0.2rem;
        }

        @media (max-width: 60rem) {
          .redes-lista {
            gap: 0.4rem;
          }

          .red-social {
            width: 2.2rem;
            height: 2.2rem;
          }
        }

      </style>

      <nav class="redes" aria-label="Redes sociales">
        <ul class="redes-lista">
          <li>
            <a href="#" class="red-social" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" class="red-social" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm12 3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-5.25 3.25a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" class="red-social" aria-label="TikTok" title="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.5 2h-3.2v13.1a3.2 3.2 0 1 1-2.2-3.05V8.7a6.5 6.5 0 1 0 5.4 6.4V8.6a8.2 8.2 0 0 0 4.5 1.3V6.7c-2.5-.1-4.4-1.9-4.5-4.7Z"/>
              </svg>
            </a>
          </li>
        </ul>
      </nav>

    `

  }

}

customElements.define('redes-component', Redes);