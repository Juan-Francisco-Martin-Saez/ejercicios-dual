class GameIntro extends HTMLElement {
  constructor() {
    super(); this.shadow = this.attachShadow({ mode: "open" }); this.shadow.innerHTML =/*html*/`
<style>
:host{display:block;width:100%;height:100%;overflow:hidden}.pantalla-inicio{position:relative;width:100%;height:100%;overflow:hidden;background:hsl(95 55% 82%)}.fondo{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;object-position:center}.escena{position:relative;width:100%;height:100%;overflow:hidden}.logo{position:absolute;top:0;left:50%;z-index:70;width:min(45vw,57vh,37rem);max-height:43%;height:auto;object-fit:contain;object-position:center;transform:translateX(-50%);user-select:none;pointer-events:none}.vegetales{position:absolute;inset:0;z-index:10;overflow:hidden;pointer-events:none}.vegetal{position:absolute;width:var(--tamano);height:auto;user-select:none;pointer-events:none;transform-origin:center bottom;animation:baile var(--duracion) ease-in-out var(--retraso) infinite alternate}.muneca{position:absolute;left:50%;bottom:-33%;z-index:60;width:min(54vw,112vh,37rem);height:auto;object-fit:contain;object-position:center bottom;transform:translateX(-50%);transform-origin:center bottom;animation:muneca 4.5s ease-in-out infinite;user-select:none;pointer-events:none}#nuevo-jugador{position:absolute;left:50%;bottom:-2%;z-index:100;display:flex;align-items:center;justify-content:center;width:min(82%,25rem);height:7.5rem;padding:0 1.5rem;box-sizing:border-box;border:.25rem solid hsl(214 82% 27%);border-radius:2.5rem;background:linear-gradient(180deg,hsl(199 100% 72%),hsl(199 88% 55%) 48%,hsl(201 82% 40%));color:hsl(0 0% 100%);font-family:"Fredoka",sans-serif;font-size:clamp(1.6rem,3.3vw,2.2rem);font-weight:700;line-height:1;letter-spacing:.03em;text-align:center;white-space:nowrap;text-shadow:0 .16rem .08rem hsl(214 82% 20%/.9),0 .3rem .35rem hsl(214 75% 18%/.65);cursor:pointer;transform:translateX(-50%);box-shadow:0 .35rem 0 hsl(214 82% 27%),0 .75rem 1.2rem hsl(214 60% 15%/.35),inset 0 .18rem 0 hsl(0 0% 100%/.5);transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}#nuevo-jugador::before{content:"";position:absolute;top:.3rem;left:10%;width:80%;height:.35rem;border-radius:999rem;background:hsl(0 0% 100%/.45)}#nuevo-jugador:hover{transform:translateX(-50%) translateY(-.15rem);filter:brightness(1.08);box-shadow:0 .47rem 0 hsl(214 82% 27%),0 .85rem 1.3rem hsl(214 60% 15%/.4),inset 0 .18rem 0 hsl(0 0% 100%/.5)}#nuevo-jugador:active{transform:translateX(-50%) translateY(.08rem);box-shadow:0 .18rem 0 hsl(214 82% 27%),0 .4rem .8rem hsl(214 60% 15%/.25)}
@keyframes baile{0%{transform:translate(0,0) rotate(var(--rotacion-1))}25%{transform:translate(var(--movimiento-x-1),var(--movimiento-y-1)) rotate(var(--rotacion-2))}50%{transform:translate(var(--movimiento-x-2),var(--movimiento-y-2)) rotate(var(--rotacion-3))}75%{transform:translate(var(--movimiento-x-3),var(--movimiento-y-3)) rotate(var(--rotacion-4))}100%{transform:translate(var(--movimiento-x-4),var(--movimiento-y-4)) rotate(var(--rotacion-5))}}@keyframes muneca{0%,100%{transform:translateX(-50%) translateY(.3rem) rotate(-1.5deg)}25%{transform:translateX(-50%) translateY(-.45rem) rotate(.5deg)}50%{transform:translateX(-50%) translateY(-1rem) rotate(1.5deg)}75%{transform:translateX(-50%) translateY(-.35rem) rotate(-.5deg)}}
@media(max-width:48rem){.logo{width:min(69vw,57vh,28rem);max-height:41%}.vegetal{width:calc(var(--tamano)*.68)}.muneca{width:min(69vw,108vh,26rem);bottom:-15%}#nuevo-jugador{width:min(84%,25rem);font-size:clamp(1.6rem,4.5vw,2.2rem)}}@media(max-width:30rem){.logo{width:min(77vw,52vh,23rem);max-height:38%}.vegetal{width:calc(var(--tamano)*.48)}.muneca{width:min(85vw,106vh,23rem);bottom:-15%}#nuevo-jugador{width:min(86%,25rem);font-size:clamp(1.5rem,5.2vw,2.2rem)}}@media(max-height:32rem) and (orientation:landscape){.logo{width:min(45vw,52vh,26rem);max-height:38%}.vegetal{width:calc(var(--tamano)*.55)}.muneca{width:min(63vw,116vh,36rem);bottom:-40%}#nuevo-jugador{width:min(42%,25rem)}}@media(max-width:36.25rem) and (min-height:40rem){.logo{width:min(77vw,52vh,23rem);max-height:38%}.vegetal{width:calc(var(--tamano)*.5)}.muneca{width:min(110vw,70vh,30.5rem);max-width:none;bottom:-20%}#nuevo-jugador{width:min(86%,25rem)}}@media(prefers-reduced-motion:reduce){.muneca,.vegetal{animation:none}}
</style>
<section class="pantalla-inicio"><img class="fondo" src="./img/fondo_02.jpg" alt=""><div class="escena"><img class="logo" src="./img/logo.svg" alt="UCO Garden"><div class="vegetales"></div><img class="muneca" src="./img/muneca01.svg" alt=""><button id="nuevo-jugador">NUEVA PARTIDA</button></div></section>`;
    this.crearVegetales(); this.shadow.querySelector("#nuevo-jugador").addEventListener("click", async () => { this.dispatchEvent(new CustomEvent("nueva-partida", { bubbles: true })); const { iniciarTutorial } = await import("./tutorial.js"); iniciarTutorial() })
  }

  crearVegetales() {
    const contenedor = this.shadow.querySelector(".vegetales"), vegetales = ["ajo", "apionabo", "berenjena", "boniato", "brocoli", "bruselas", "calabacin", "calabaza", "cebolla", "cebolleta", "col", "coliflor", "lombarda", "nabo", "patatas", "pepino", "pimiento", "rabanito", "rabano", "remolacha", "setas", "tomate", "zanahoria"], duraciones = [1.9, 2.2, 2.5, 2.8, 3.1, 3.5, 3.9, 4.3, 4.8, 5.3, 5.8, 6.4], rotaciones = [-23, -18, -14, -10, -6, 5, 9, 13, 18, 23], movimientoX = [".5rem", ".8rem", "1.1rem", "1.4rem", "1.8rem", "2.2rem", "2.6rem"], movimientoY = ["-.5rem", "-.8rem", "-1.1rem", "-1.4rem", "-1.8rem", "-2.2rem", "-2.6rem"], cantidad = 253, tipos = [], posiciones = [], columnas = innerWidth <= 480 ? 19 : innerWidth <= 768 ? 22 : 25, filas = Math.ceil(cantidad / columnas), ancho = 112 / columnas, alto = 48 / filas;

    for (let i = 0; i < cantidad; i++)tipos.push(vegetales[i % vegetales.length]);

    for (let i = tipos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tipos[i], tipos[j]] = [tipos[j], tipos[i]]
    }

    for (let i = 0; i < cantidad; i++) {
      const columna = i % columnas, fila = Math.floor(i / columnas);
      posiciones.push({
        left: -6 + columna * ancho + Math.random() * ancho * .8,
        bottom: -12 + fila * alto + Math.random() * alto * .8
      })
    }

    for (let i = 1; i < tipos.length; i++)if (tipos[i] === tipos[i - 1]) {
      const candidatos = [];
      for (let j = i + 1; j < tipos.length; j++)if (tipos[j] !== tipos[i] && tipos[j] !== tipos[Math.max(0, i - 1)]) candidatos.push(j);
      if (candidatos.length) {
        const j = candidatos[Math.floor(Math.random() * candidatos.length)];
        [tipos[i], tipos[j]] = [tipos[j], tipos[i]]
      }
    }

    for (let indice = 0; indice < cantidad; indice++) {
      const vegetal = document.createElement("img"), tipo = tipos[indice], { left, bottom } = posiciones[indice], azar = Math.random(), tamano = tipo === "patatas" ? 8.2 + azar * 7.2 : 6.2 + azar * 7;
      vegetal.className = "vegetal";
      vegetal.src = `./img/${tipo}.svg`;
      vegetal.alt = "";
      vegetal.style.left = `${left}%`;
      vegetal.style.bottom = `${bottom}%`;
      vegetal.style.setProperty("--tamano", `${tamano}rem`);
      vegetal.style.setProperty("--duracion", `${duraciones[Math.floor(Math.random() * duraciones.length)]}s`);
      vegetal.style.setProperty("--retraso", `${-Math.random() * 7}s`);

      for (let paso = 1; paso <= 4; paso++) {
        const x = movimientoX[Math.floor(Math.random() * movimientoX.length)], y = movimientoY[Math.floor(Math.random() * movimientoY.length)];
        vegetal.style.setProperty(`--movimiento-x-${paso}`, Math.random() > .5 ? x : `-${x}`);
        vegetal.style.setProperty(`--movimiento-y-${paso}`, Math.random() > .18 ? y : y.replace("-", ""))
      }

      for (let paso = 1; paso <= 5; paso++)vegetal.style.setProperty(`--rotacion-${paso}`, `${rotaciones[Math.floor(Math.random() * rotaciones.length)]}deg`);
      contenedor.appendChild(vegetal)
    }
  }
}

customElements.define("game-intro", GameIntro);