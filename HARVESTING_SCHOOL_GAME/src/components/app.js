class GameApp extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = /*html*/`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100dvh;
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define("game-app", GameApp);