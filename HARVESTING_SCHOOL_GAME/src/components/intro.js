class GameIntro extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML =/*html*/`
<style>
:host{display:block;width:100%;height:100%;overflow:hidden}.pantalla-inicio{position:relative;width:100%;height:100%;overflow:hidden;background:hsl(95 55% 82%)}.fondo{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;object-position:center}.escena{position:relative;width:100%;height:100%;overflow:hidden}.logo{position:absolute;top:0;left:50%;z-index:70;width:min(45vw,57vh,37rem);max-height:43%;object-fit:contain;object-position:center;transform:translateX(-50%);user-select:none;pointer-events:none}.vegetales{position:absolute;inset:0;z-index:10;overflow:hidden;pointer-events:none}.vegetal{position:absolute;width:var(--tamano);user-select:none;pointer-events:none;transform-origin:center bottom;animation:baile var(--duracion) ease-in-out var(--retraso) infinite alternate}.muneca{position:absolute;left:50%;bottom:-31%;z-index:60;width:min(55.9vw,115vh,38rem);height:auto;object-fit:contain;object-position:center bottom;transform:translateX(-50%);transform-origin:center bottom;animation:muneca 5s ease-in-out infinite;user-select:none;pointer-events:none}#nuevo-jugador{position:absolute;left:50%;bottom:-2%;z-index:100;width:min(82%,25rem);min-height:7.5rem;padding:1.2rem 2rem;border:.25rem solid hsl(214 82% 27%);border-radius:2.5rem;background:linear-gradient(180deg,hsl(199 100% 72%),hsl(199 88% 55%) 48%,hsl(201 82% 40%));color:hsl(0 0% 100%);font-family:"Fredoka",sans-serif;font-size:clamp(1.6rem,3.3vw,2.2rem);font-weight:700;line-height:1;letter-spacing:.03em;white-space:nowrap;text-shadow:0 .16rem .08rem hsl(214 82% 20%/.9),0 .3rem .35rem hsl(214 75% 18%/.65);cursor:pointer;transform:translateX(-50%);box-shadow:0 .35rem 0 hsl(214 82% 27%),0 .75rem 1.2rem hsl(214 60% 15%/.35),inset 0 .18rem 0 hsl(0 0% 100%/.5);transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}#nuevo-jugador::before{content:"";position:absolute;top:.3rem;left:10%;width:80%;height:.35rem;border-radius:999rem;background:hsl(0 0% 100%/.45)}#nuevo-jugador:hover{transform:translateX(-50%) translateY(-.15rem);filter:brightness(1.08);box-shadow:0 .47rem 0 hsl(214 82% 27%),0 .85rem 1.3rem hsl(214 60% 15%/.4),inset 0 .18rem 0 hsl(0 0% 100%/.5)}#nuevo-jugador:active{transform:translateX(-50%) translateY(.08rem);box-shadow:0 .18rem 0 hsl(214 82% 27%),0 .4rem .8rem hsl(214 60% 15%/.25)}
@keyframes baile{0%{transform:translate(0,0) rotate(var(--rotacion-1))}25%{transform:translate(var(--movimiento-x-1),var(--movimiento-y-1)) rotate(var(--rotacion-2))}50%{transform:translate(var(--movimiento-x-2),var(--movimiento-y-2)) rotate(var(--rotacion-3))}75%{transform:translate(var(--movimiento-x-3),var(--movimiento-y-3)) rotate(var(--rotacion-4))}100%{transform:translate(var(--movimiento-x-4),var(--movimiento-y-4)) rotate(var(--rotacion-5))}}
@keyframes muneca{0%,100%{transform:translateX(-50%) translateY(0) rotate(-1deg)}50%{transform:translateX(-50%) translateY(-.55rem) rotate(1deg)}}
@media(max-width:48rem){.logo{top:0;width:min(69vw,57vh,28rem);max-height:41%}.vegetal{width:calc(var(--tamano)*.88)}.muneca{width:min(67.8vw,115vh,25rem);bottom:-11%}#nuevo-jugador{bottom:-3%;width:min(84%,22rem);min-height:7rem;padding:1rem 1.5rem;font-size:clamp(1.5rem,5.3vw,1.95rem)}}
@media(max-width:30rem){.logo{top:0;width:min(77vw,52vh,23rem);max-height:38%}.vegetal{width:calc(var(--tamano)*.78)}.muneca{width:min(78.8vw,115vh,21rem);bottom:-10%}#nuevo-jugador{bottom:-4%;width:min(86%,20rem);min-height:6.5rem;padding:.9rem 1.2rem;font-size:1.45rem}}
@media(prefers-reduced-motion:reduce){.muneca,.vegetal{animation:none}}
</style>
<section class="pantalla-inicio"><img class="fondo" src="./img/fondo_02.jpg" alt=""><div class="escena"><img class="logo" src="./img/logo.svg" alt="UCO Garden"><div class="vegetales"></div><img class="muneca" src="./img/muneca01.svg" alt=""><button id="nuevo-jugador">NUEVA PARTIDA</button></div></section>`;

    this.crearVegetales();

    this.shadow.querySelector("#nuevo-jugador").addEventListener("click", async () => {
      this.dispatchEvent(new CustomEvent("nueva-partida", { bubbles: true }));
      const { iniciarTutorial } = await import("./tutorial.js");
      iniciarTutorial();
    });
  }

  crearVegetales() {
    const contenedor = this.shadow.querySelector(".vegetales"), vegetales = ["ajo", "apionabo", "berenjena", "boniato", "brocoli", "bruselas", "calabacin", "calabaza", "cebolla", "cebolleta", "col", "coliflor", "lombarda", "nabo", "patatas", "pepino", "pimiento", "rabanito", "rabano", "remolacha", "setas", "tomate", "zanahoria"], duraciones = [2.1, 2.4, 2.8, 3.2, 3.7, 4.1, 4.6, 5.1, 5.7, 6.3, 6.9, 7.5], rotaciones = [-18, -14, -11, -8, -5, 4, 7, 10, 13, 17], movimientoX = [".3rem", ".5rem", ".8rem", "1rem", "1.3rem", "1.6rem", "2rem"], movimientoY = ["-.3rem", "-.5rem", "-.8rem", "-1rem", "-1.3rem", "-1.6rem", "-2rem"];

    for (let indice = 0; indice < 300; indice++) {
      const vegetal = document.createElement("img"), tipo = indice < 23 ? vegetales[indice] : Math.random() < .18 ? "patatas" : Math.random() < .13 ? "tomate" : vegetales.filter(v => v !== "patatas" && v !== "tomate")[Math.floor(Math.random() * (vegetales.length - 2))];

      vegetal.className = "vegetal";
      vegetal.src = `./img/${tipo}.svg`;
      vegetal.alt = "";

      const left = -4 + Math.random() * 108;
      const bottom = -10 + Math.random() * 36;

      vegetal.style.left = `${left}%`;
      vegetal.style.bottom = `${bottom}%`;
      vegetal.style.setProperty("--tamano", `${tipo === "patatas" ? 14.4 + Math.random() * 12 : 6.5 + Math.random() * 6.3}rem`);
      vegetal.style.setProperty("--duracion", `${duraciones[Math.floor(Math.random() * duraciones.length)]}s`);
      vegetal.style.setProperty("--retraso", `${-Math.random() * 7}s`);

      for (let paso = 1; paso <= 4; paso++) {
        const x = movimientoX[Math.floor(Math.random() * movimientoX.length)], y = movimientoY[Math.floor(Math.random() * movimientoY.length)];
        vegetal.style.setProperty(`--movimiento-x-${paso}`, Math.random() > .5 ? x : `-${x}`);
        vegetal.style.setProperty(`--movimiento-y-${paso}`, y);
      }

      for (let paso = 1; paso <= 5; paso++) vegetal.style.setProperty(`--rotacion-${paso}`, `${rotaciones[Math.floor(Math.random() * rotaciones.length)]}deg`);
      contenedor.appendChild(vegetal);
    }
  }
}

customElements.define("game-intro", GameIntro);