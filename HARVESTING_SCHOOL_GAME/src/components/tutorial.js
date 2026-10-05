class GameTutorial extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.x = 0;
    this.inicioX = 0;
    this.xInicial = 0;
    this.arrastrando = false;
    this.dialogoActual = 0;

    this.dialogos = [
      "¡Bienvenidos! Este es vuestro tutorial de aprendizaje. Aquí descubriréis todo lo necesario para convertiros en auténticos agricultores.",
      `A continuación os enseñaré el paso inicial para el cultivo: <strong>LA SIEMBRA DE SEMILLAS</strong>. Si la tierra esta bien labrada, como es el caso, podremos proceder a la siembra sin problemas.`,
      `Esta es una sección del huerto preparada para el cultivo. Como podéis ver, disponemos de <strong>DOS ÁREAS DE CULTIVO</strong> listas para comenzar la siembra.`
    ];

    this.shadow.innerHTML =/*html*/`
<style>
:host{display:block;width:100%;height:100%;overflow:hidden}
.tutorial{position:relative;width:100%;height:100%;overflow:hidden;background:hsl(95 20% 35%);cursor:grab;touch-action:none}
.mapa{position:absolute;left:50%;top:50%;width:100%;height:100%;object-fit:cover;object-position:center;transform:translate(-50%,-50%) translateX(var(--x,0px));user-select:none;pointer-events:none;will-change:transform}
.tutorial.arrastrando{cursor:grabbing}

.intro{position:absolute;left:50%;bottom:2%;z-index:50;width:clamp(17rem,32vw,27rem);transform:translateX(-50%);pointer-events:none}

.muneca{display:block;width:100%;height:auto;opacity:0;transform:translateY(4rem);filter:drop-shadow(0 .8rem .7rem hsl(215 45% 8%/.68)) drop-shadow(0 .25rem .25rem hsl(215 45% 8%/.5));transition:opacity .55s ease,transform .55s ease;user-select:none;pointer-events:none}
.muneca.visible{opacity:1;transform:translateY(0)}
.muneca.saliendo{opacity:0;transform:translateY(8rem)}

.dialogo{position:absolute;left:50%;bottom:calc(100% + 1.1rem);width:clamp(20rem,155%,38rem);box-sizing:border-box;padding:1.35rem 1.8rem;border:.2rem solid hsl(38 48% 58%);border-radius:1.8rem;background:linear-gradient(180deg,hsl(45 80% 94%),hsl(40 70% 86%));color:hsl(215 55% 18%);font-family:Arial,Helvetica,sans-serif;font-size:clamp(1rem,1.5vw,1.4rem);font-weight:700;line-height:1.4;text-align:center;opacity:0;box-shadow:0 .35rem 0 hsl(37 42% 48%),0 .9rem 1.25rem hsl(215 45% 8%/.6),0 .25rem .4rem hsl(215 45% 8%/.45),inset 0 .15rem 0 hsl(0 0% 100%/.7);transform:translate(-50%,1.2rem) scale(.97);transition:opacity .4s ease,transform .4s ease,bottom .55s ease,width .55s ease}
.dialogo.visible{opacity:1;transform:translate(-50%,0) scale(1)}
.dialogo strong{color:hsl(115 58% 36%);font-weight:900}

.dialogo::after{content:"";position:absolute;left:50%;bottom:-1.05rem;width:1.8rem;height:1.8rem;background:hsl(40 70% 86%);border-right:.2rem solid hsl(38 48% 58%);border-bottom:.2rem solid hsl(38 48% 58%);transform:translateX(-50%) rotate(45deg);filter:drop-shadow(.3rem .4rem .2rem hsl(215 45% 8%/.45));transition:opacity .3s ease}

.accion{position:absolute;right:1.3rem;bottom:-2.85rem;z-index:10;padding:.7rem 1.5rem;border:.18rem solid hsl(115 45% 27%);border-radius:1.4rem;background:linear-gradient(180deg,hsl(100 62% 48%),hsl(115 58% 36%));color:white;font-family:Arial,Helvetica,sans-serif;font-size:1rem;font-weight:900;letter-spacing:.04rem;cursor:pointer;pointer-events:auto;box-shadow:0 .28rem 0 hsl(115 48% 24%),0 .8rem .7rem hsl(215 45% 8%/.68),0 .25rem .25rem hsl(215 45% 8%/.5),inset 0 .12rem 0 hsl(0 0% 100%/.35);transition:transform .15s ease,filter .15s ease}
.accion:hover{transform:scale(1.06);filter:brightness(1.08)}
.accion:active{transform:scale(.96)}

.tutorial.sin-personaje .intro{bottom:0;width:100%;height:100%;transform:translateX(-50%)}
.tutorial.sin-personaje .dialogo{bottom:8%;width:clamp(25rem,52vw,48rem);padding:1.25rem 1.8rem}
.tutorial.sin-personaje .dialogo::after{opacity:0}
.tutorial.sin-personaje .muneca{opacity:0;transform:translateY(8rem)}

.indicadores{position:absolute;inset:0;z-index:35;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .45s ease}
.tutorial.sin-personaje .indicadores{opacity:1;visibility:visible}

.mano{position:absolute;display:block;width:clamp(5rem,8vw,8rem);height:auto;user-select:none;pointer-events:none;filter:drop-shadow(0 .55rem .45rem hsl(215 45% 8%/.55));will-change:transform;animation:senalar 1.15s ease-in-out infinite}
.mano-izq{left:22%;top:42%;transform:rotate(12deg)}
.mano-der{right:22%;top:42%;transform:rotate(-12deg);animation-delay:.15s}

@keyframes senalar{
  0%,100%{translate:0 0}
  50%{translate:0 .65rem}
}

@media(max-width:48rem){
  .mapa{width:auto;height:100%;max-width:none}
  .intro{bottom:4%;width:clamp(21rem,68vw,26rem)}
  .dialogo{bottom:calc(100% + .95rem);width:82vw;max-width:33rem;padding:1.1rem 1.3rem;font-size:clamp(.95rem,2.6vw,1.15rem);line-height:1.32}
  .accion{right:.8rem;bottom:-2.85rem;padding:.6rem 1.25rem;font-size:.92rem}

  .tutorial.sin-personaje .intro{bottom:0;width:100%;height:100%}
  .tutorial.sin-personaje .dialogo{bottom:9%;width:82vw;max-width:36rem;padding:1.1rem 1.3rem}

  .mano{width:clamp(4.5rem,12vw,6.5rem)}
  .mano-izq{left:16%;top:42%}
  .mano-der{right:16%;top:42%}
}

@media(max-width:30rem){
  .intro{bottom:4%;width:min(94vw,27rem)}
  .dialogo{bottom:calc(100% + .8rem);width:76vw;max-width:21rem;padding:.9rem 1rem;border-radius:1.35rem;font-size:clamp(.88rem,3.4vw,1rem);line-height:1.25}
  .dialogo::after{bottom:-.8rem;width:1.35rem;height:1.35rem}
  .accion{right:.45rem;bottom:-2.75rem;padding:.5rem 1rem;border-width:.14rem;border-radius:1.1rem;font-size:.82rem}

  .tutorial.sin-personaje .dialogo{bottom:10%;width:78vw;max-width:22rem;padding:.9rem 1rem}

  .mano{width:clamp(4rem,15vw,5.5rem)}
  .mano-izq{left:10%;top:41%}
  .mano-der{right:10%;top:41%}
}

@media(max-width:23rem){
  .intro{bottom:5%;width:98vw}
  .dialogo{bottom:calc(100% + .75rem);width:72vw;max-width:17rem;padding:.8rem;font-size:.82rem;line-height:1.22}
  .accion{right:.25rem;bottom:-2.65rem;padding:.45rem .85rem;font-size:.76rem}

  .tutorial.sin-personaje .dialogo{bottom:11%;width:76vw;max-width:18rem;padding:.8rem}

  .mano{width:4rem}
  .mano-izq{left:7%;top:40%}
  .mano-der{right:7%;top:40%}
}

@media(prefers-reduced-motion:reduce){
  .muneca,.dialogo,.indicadores{transition:none}
  .mano{animation:none}
}
</style>

<section class="tutorial">
  <img class="mapa" src="./img/Tuto_fondo.jpg" alt="">

  <div class="indicadores">
    <img class="mano mano-izq" src="./img/mano-izq.svg" alt="">
    <img class="mano mano-der" src="./img/mano-der.svg" alt="">
  </div>

  <div class="intro">
    <img class="muneca" src="./img/muneca01.svg" alt="">
    <div class="dialogo">
      <div class="texto">${this.dialogos[0]}</div>
      <button class="accion" type="button">SIGUIENTE ›</button>
    </div>
  </div>
</section>`;

    this.tutorial = this.shadow.querySelector(".tutorial");
    this.mapa = this.shadow.querySelector(".mapa");
    this.muneca = this.shadow.querySelector(".muneca");
    this.dialogo = this.shadow.querySelector(".dialogo");
    this.texto = this.shadow.querySelector(".texto");
    this.accion = this.shadow.querySelector(".accion");

    this.tutorial.addEventListener("pointerdown", e => this.iniciarArrastre(e));
    this.tutorial.addEventListener("pointermove", e => this.mover(e));
    this.tutorial.addEventListener("pointerup", e => this.terminarArrastre(e));
    this.tutorial.addEventListener("pointercancel", e => this.terminarArrastre(e));

    this.accion.addEventListener("pointerdown", e => e.stopPropagation());
    this.accion.addEventListener("click", e => {
      e.stopPropagation();
      this.siguienteDialogo();
    });

    this.mapa.addEventListener("load", () => {
      this.centrar();
      setTimeout(() => {
        this.muneca.classList.add("visible");
        setTimeout(() => this.dialogo.classList.add("visible"), 500);
      }, 600);
    });

    addEventListener("resize", () => this.centrar());
  }

  siguienteDialogo() {
    if (this.dialogoActual >= this.dialogos.length - 1) return;

    this.dialogo.classList.remove("visible");
    this.dialogoActual++;

    if (this.dialogoActual === 2) {
      this.muneca.classList.remove("visible");
      this.muneca.classList.add("saliendo");

      setTimeout(() => {
        this.tutorial.classList.add("sin-personaje");
        this.texto.innerHTML = this.dialogos[this.dialogoActual];
        this.dialogo.classList.add("visible");
      }, 500);

      return;
    }

    setTimeout(() => {
      this.texto.innerHTML = this.dialogos[this.dialogoActual];
      this.dialogo.classList.add("visible");
    }, 250);
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

    if (this.tutorial.hasPointerCapture(e.pointerId)) {
      this.tutorial.releasePointerCapture(e.pointerId);
    }
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