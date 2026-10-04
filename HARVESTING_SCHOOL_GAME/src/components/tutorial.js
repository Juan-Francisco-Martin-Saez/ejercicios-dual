class GameTutorial extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.x = 0;
    this.inicioX = 0;
    this.xInicial = 0;
    this.arrastrando = false;

    this.shadow.innerHTML =/*html*/`
<style>
:host{display:block;width:100%;height:100%;overflow:hidden}
.tutorial{position:relative;width:100%;height:100%;overflow:hidden;background:hsl(95 20% 35%);cursor:grab;touch-action:none}
.mapa{position:absolute;left:50%;top:50%;width:100%;height:100%;object-fit:cover;object-position:center;transform:translate(-50%,-50%) translateX(var(--x,0px));user-select:none;pointer-events:none;will-change:transform}
.tutorial.arrastrando{cursor:grabbing}

.intro{position:absolute;left:50%;bottom:2%;z-index:50;width:clamp(17rem,32vw,27rem);transform:translateX(-50%);pointer-events:none}

.muneca{display:block;width:100%;height:auto;opacity:0;transform:translateY(4rem);filter:drop-shadow(0 .8rem .7rem hsl(215 45% 8%/.68)) drop-shadow(0 .25rem .25rem hsl(215 45% 8%/.5));transition:opacity .55s ease,transform .55s ease;user-select:none;pointer-events:none}
.muneca.visible{opacity:1;transform:translateY(0)}

.dialogo{position:absolute;left:50%;bottom:calc(100% + .8rem);width:clamp(20rem,175%,43rem);box-sizing:border-box;padding:1.35rem 1.8rem;border:.2rem solid hsl(38 48% 58%);border-radius:1.8rem;background:linear-gradient(180deg,hsl(45 80% 94%),hsl(40 70% 86%));color:hsl(215 55% 18%);font-family:Arial,Helvetica,sans-serif;font-size:clamp(1rem,1.5vw,1.4rem);font-weight:700;line-height:1.4;text-align:center;opacity:0;box-shadow:0 .35rem 0 hsl(37 42% 48%),0 .9rem 1.25rem hsl(215 45% 8%/.6),0 .25rem .4rem hsl(215 45% 8%/.45),inset 0 .15rem 0 hsl(0 0% 100%/.7);transform:translate(-50%,1.2rem) scale(.97);transition:opacity .4s ease,transform .4s ease}
.dialogo.visible{opacity:1;transform:translate(-50%,0) scale(1)}

.dialogo::after{content:"";position:absolute;left:50%;bottom:-1.05rem;width:1.8rem;height:1.8rem;background:hsl(40 70% 86%);border-right:.2rem solid hsl(38 48% 58%);border-bottom:.2rem solid hsl(38 48% 58%);transform:translateX(-50%) rotate(45deg);filter:drop-shadow(.3rem .4rem .2rem hsl(215 45% 8%/.45))}

@media(max-width:48rem){
  .mapa{width:auto;height:100%;max-width:none}
  .intro{bottom:4%;width:clamp(21rem,68vw,26rem)}
  .dialogo{bottom:calc(100% + .65rem);width:82vw;max-width:33rem;padding:1.15rem 1.35rem;font-size:clamp(1rem,2.8vw,1.25rem)}
}

@media(max-width:30rem){
  .intro{bottom:4%;width:min(94vw,27rem)}
  .dialogo{bottom:calc(100% + .5rem);width:76vw;max-width:21rem;padding:1rem 1.05rem;border-radius:1.35rem;font-size:clamp(.95rem,3.7vw,1.1rem);line-height:1.32}
  .dialogo::after{bottom:-.8rem;width:1.35rem;height:1.35rem}
}

@media(max-width:23rem){
  .intro{bottom:5%;width:98vw}
  .dialogo{bottom:calc(100% + .45rem);width:72vw;max-width:17rem;padding:.9rem .85rem;font-size:.9rem;line-height:1.3}
}

@media(prefers-reduced-motion:reduce){
  .muneca,.dialogo{transition:none}
}
</style>

<section class="tutorial">
  <img class="mapa" src="./img/Tuto_fondo.jpg" alt="">
  <div class="intro">
    <img class="muneca" src="./img/muneca01.svg" alt="">
    <div class="dialogo">¡Bienvenidos! Este es vuestro tutorial de aprendizaje. Aquí descubriréis todo lo necesario para convertiros en auténticos agricultores.</div>
  </div>
</section>`;

    this.tutorial = this.shadow.querySelector(".tutorial");
    this.mapa = this.shadow.querySelector(".mapa");
    this.muneca = this.shadow.querySelector(".muneca");
    this.dialogo = this.shadow.querySelector(".dialogo");

    this.tutorial.addEventListener("pointerdown", e => this.iniciarArrastre(e));
    this.tutorial.addEventListener("pointermove", e => this.mover(e));
    this.tutorial.addEventListener("pointerup", e => this.terminarArrastre(e));
    this.tutorial.addEventListener("pointercancel", e => this.terminarArrastre(e));

    this.mapa.addEventListener("load", () => {
      this.centrar();
      setTimeout(() => {
        this.muneca.classList.add("visible");
        setTimeout(() => this.dialogo.classList.add("visible"), 500);
      }, 600);
    });

    addEventListener("resize", () => this.centrar());
  }

  centrar() {
    this.x = 0;
    this.limitar();
    this.actualizar();
  }

  iniciarArrastre(e) {
    this.arrastrando = true;
    this.inicioX = e.clientX;
    this.xInicial = this.x;
    this.tutorial.classList.add("arrastrando");
    this.tutorial.setPointerCapture(e.pointerId);
  }

  mover(e) {
    if (!this.arrastrando) return;
    this.x = this.xInicial + e.clientX - this.inicioX;
    this.limitar();
    this.actualizar();
  }

  terminarArrastre(e) {
    if (!this.arrastrando) return;
    this.arrastrando = false;
    this.tutorial.classList.remove("arrastrando");
    if (this.tutorial.hasPointerCapture(e.pointerId)) this.tutorial.releasePointerCapture(e.pointerId);
  }

  limitar() {
    const ancho = this.mapa.getBoundingClientRect().width;
    const limite = Math.max(0, (ancho - innerWidth) / 2);
    this.x = Math.max(-limite, Math.min(limite, this.x));
  }

  actualizar() {
    this.mapa.style.setProperty("--x", `${this.x}px`);
  }
}

customElements.define("game-tutorial", GameTutorial);

export function iniciarTutorial() {
  const game = document.querySelector("game-app");
  game.innerHTML = `<game-tutorial></game-tutorial>`;
}