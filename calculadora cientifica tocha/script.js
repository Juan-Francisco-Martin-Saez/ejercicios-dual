export default (() => {

  const displayExpression = document.querySelector(".display-expression")
  const displayResult = document.querySelector(".display-result")
  const displayMode = document.querySelector(".display-mode")
  const displayStatus = document.querySelector(".display-status")

  const scientificSection = document.querySelector(".scientific-section")
  const scientificToggle = document.querySelector("#scientific-toggle")

  const numberButtons = document.querySelectorAll(".number-button")
  const operatorButtons = document.querySelectorAll(".operator-button")
  const functionButtons = document.querySelectorAll(".function-button")

  const memoryButtons = document.querySelectorAll(".memory-button")
  const toolbarButtons = document.querySelectorAll(".toolbar-button")
  const headerButtons = document.querySelectorAll(".header-button")

  const equalsButton = document.querySelector(".equals-button")
  const controlButtons = document.querySelectorAll(".control-button")
  const specialButton = document.querySelector(".special-button")
  const constantButton = document.querySelector(".constant-button")

  let expresion = ""
  let resultado = 0
  let respuestaAnterior = 0
  let memoria = 0
  let unidadAngular = "DEG"
  let formato = "NORMAL"
  let decimalesFijos = 2
  let nuevaOperacion = false
  let historial = []

  const PHI = (1 + Math.sqrt(5)) / 2

  const formatearNumero = (numero) => {

    if (!Number.isFinite(numero)) {
      return "Error"
    }

    if (Object.is(numero, -0)) {
      numero = 0
    }

    if (formato === "FIX") {
      return numero.toFixed(decimalesFijos)
    }

    if (formato === "SCI") {
      return numero.toExponential(8)
    }

    if (formato === "FE") {

      if (
        Math.abs(numero) >= 1e10 ||
        (Math.abs(numero) > 0 && Math.abs(numero) < 1e-9)
      ) {
        return numero.toExponential(8)
      }
    }

    return Number.parseFloat(
      numero.toPrecision(12)
    ).toString()
  }

  const actualizarDisplay = () => {

    displayExpression.textContent = expresion
    displayResult.textContent = formatearNumero(resultado)

    displayMode.innerHTML = `
      <span>SCIENTIFIC</span>
      <span class="mode-separator">•</span>
      <span>${unidadAngular}</span>
    `

    const estadoFormato =
      formato === "NORMAL"
        ? ""
        : formato

    displayStatus.innerHTML = `
      <span>Ans</span>
      <span>${memoria !== 0 ? "MEM" : ""}</span>
      <span>${estadoFormato}</span>
    `
  }

  const convertirARadianes = (numero) => {

    if (unidadAngular === "DEG") {
      return numero * Math.PI / 180
    }

    if (unidadAngular === "GRAD") {
      return numero * Math.PI / 200
    }

    return numero
  }

  const convertirDesdeRadianes = (numero) => {

    if (unidadAngular === "DEG") {
      return numero * 180 / Math.PI
    }

    if (unidadAngular === "GRAD") {
      return numero * 200 / Math.PI
    }

    return numero
  }

  const factorial = (numero) => {

    if (!Number.isFinite(numero)) {
      throw new Error("Factorial inválido")
    }

    if (numero < 0 || !Number.isInteger(numero)) {
      throw new Error("El factorial requiere un entero")
    }

    if (numero > 170) {
      throw new Error("Número demasiado grande")
    }

    let resultadoFactorial = 1

    for (let i = 2; i <= numero; i++) {
      resultadoFactorial *= i
    }

    return resultadoFactorial
  }

  const ejecutarFuncion = (nombre, numero) => {

    switch (nombre) {

      case "sin":
        return Math.sin(convertirARadianes(numero))

      case "cos":
        return Math.cos(convertirARadianes(numero))

      case "tan": {

        const radianes = convertirARadianes(numero)

        if (Math.abs(Math.cos(radianes)) < 1e-12) {
          throw new Error("Tangente indefinida")
        }

        return Math.tan(radianes)
      }

      case "asin":

        if (numero < -1 || numero > 1) {
          throw new Error("asin requiere -1 ≤ x ≤ 1")
        }

        return convertirDesdeRadianes(Math.asin(numero))

      case "acos":

        if (numero < -1 || numero > 1) {
          throw new Error("acos requiere -1 ≤ x ≤ 1")
        }

        return convertirDesdeRadianes(Math.acos(numero))

      case "atan":
        return convertirDesdeRadianes(Math.atan(numero))

      case "sinh":
        return Math.sinh(numero)

      case "cosh":
        return Math.cosh(numero)

      case "tanh":
        return Math.tanh(numero)

      case "asinh":
        return Math.asinh(numero)

      case "acosh":

        if (numero < 1) {
          throw new Error("acosh requiere x ≥ 1")
        }

        return Math.acosh(numero)

      case "atanh":

        if (numero <= -1 || numero >= 1) {
          throw new Error("atanh requiere -1 < x < 1")
        }

        return Math.atanh(numero)

      case "ln":

        if (numero <= 0) {
          throw new Error("ln requiere x > 0")
        }

        return Math.log(numero)

      case "log":

        if (numero <= 0) {
          throw new Error("log requiere x > 0")
        }

        return Math.log10(numero)

      case "log2":

        if (numero <= 0) {
          throw new Error("log₂ requiere x > 0")
        }

        return Math.log2(numero)

      case "pow10":
        return Math.pow(10, numero)

      case "exp":
        return Math.exp(numero)

      case "sqrt":

        if (numero < 0) {
          throw new Error("Raíz cuadrada negativa")
        }

        return Math.sqrt(numero)

      case "cbrt":
        return Math.cbrt(numero)

      default:
        throw new Error("Función desconocida")
    }
  }

  const tokenizar = (texto) => {

    const tokens = []
    let posicion = 0

    while (posicion < texto.length) {

      const caracter = texto[posicion]

      if (/\s/.test(caracter)) {
        posicion++
        continue
      }

      if (/[0-9.]/.test(caracter)) {

        let numero = ""
        let tienePunto = false

        while (posicion < texto.length) {

          const actual = texto[posicion]

          if (actual === ".") {

            if (tienePunto) {
              throw new Error("Número decimal inválido")
            }

            tienePunto = true
            numero += actual
            posicion++

            continue
          }

          if (/[0-9]/.test(actual)) {
            numero += actual
            posicion++
            continue
          }

          break
        }

        if (
          texto[posicion] === "e" ||
          texto[posicion] === "E"
        ) {

          numero += texto[posicion]
          posicion++

          if (
            texto[posicion] === "+" ||
            texto[posicion] === "-"
          ) {
            numero += texto[posicion]
            posicion++
          }

          let digitosExponente = ""

          while (
            posicion < texto.length &&
            /[0-9]/.test(texto[posicion])
          ) {
            digitosExponente += texto[posicion]
            numero += texto[posicion]
            posicion++
          }

          if (!digitosExponente) {
            throw new Error("Exponente inválido")
          }
        }

        if (numero === ".") {
          throw new Error("Número inválido")
        }

        const valor = Number(numero)

        if (!Number.isFinite(valor)) {
          throw new Error("Número inválido")
        }

        tokens.push({
          tipo: "numero",
          valor
        })

        continue
      }

      if (/[a-zA-Z]/.test(caracter)) {

        let palabra = ""

        while (
          posicion < texto.length &&
          /[a-zA-Z]/.test(texto[posicion])
        ) {
          palabra += texto[posicion]
          posicion++
        }

        tokens.push({
          tipo: "palabra",
          valor: palabra
        })

        continue
      }

      if ("+-*/%^()!".includes(caracter)) {

        tokens.push({
          tipo: "operador",
          valor: caracter
        })

        posicion++

        continue
      }

      throw new Error("Carácter no válido")
    }

    return tokens
  }

  const calcularExpresion = (texto) => {

    const tokens = tokenizar(texto)
    let posicion = 0

    const actual = () => tokens[posicion]

    const avanzar = () => tokens[posicion++]

    const aceptar = (valor) => {

      if (
        actual() &&
        actual().valor === valor
      ) {
        avanzar()
        return true
      }

      return false
    }

    const expresionParser = () => {

      let resultadoParser = termino()

      while (true) {

        if (aceptar("+")) {

          const siguiente = termino()

          resultadoParser =
            siguiente.porcentaje
              ? resultadoParser.valor + (
                resultadoParser.valor * siguiente.valor
              )
              : resultadoParser.valor + siguiente.valor

          resultadoParser = {
            valor: resultadoParser,
            porcentaje: false
          }

          continue
        }

        if (aceptar("-")) {

          const siguiente = termino()

          resultadoParser =
            siguiente.porcentaje
              ? resultadoParser.valor - (
                resultadoParser.valor * siguiente.valor
              )
              : resultadoParser.valor - siguiente.valor

          resultadoParser = {
            valor: resultadoParser,
            porcentaje: false
          }

          continue
        }

        break
      }

      return resultadoParser
    }

    const termino = () => {

      let resultadoTermino = potencia()

      while (true) {

        if (aceptar("*")) {

          const siguiente = potencia()

          resultadoTermino = {
            valor: resultadoTermino.valor * siguiente.valor,
            porcentaje: false
          }

          continue
        }

        if (aceptar("/")) {

          const siguiente = potencia()

          if (siguiente.valor === 0) {
            throw new Error("División entre cero")
          }

          resultadoTermino = {
            valor: resultadoTermino.valor / siguiente.valor,
            porcentaje: false
          }

          continue
        }

        break
      }

      return resultadoTermino
    }

    const potencia = () => {

      let valor = unario()

      if (aceptar("^")) {

        const exponente = potencia()

        valor = {
          valor: valor.valor ** exponente.valor,
          porcentaje: false
        }
      }

      return valor
    }

    const unario = () => {

      if (aceptar("+")) {
        return unario()
      }

      if (aceptar("-")) {

        const valor = unario()

        return {
          valor: -valor.valor,
          porcentaje: false
        }
      }

      return postfijo()
    }

    const postfijo = () => {

      let valor = primario()
      let porcentaje = false

      while (true) {

        if (aceptar("%")) {

          valor = {
            valor: valor.valor / 100,
            porcentaje: true
          }

          porcentaje = true

          continue
        }

        if (aceptar("!")) {

          valor = {
            valor: factorial(valor.valor),
            porcentaje: false
          }

          porcentaje = false

          continue
        }

        break
      }

      return {
        valor: valor.valor,
        porcentaje
      }
    }

    const primario = () => {

      const token = actual()

      if (!token) {
        throw new Error("Expresión incompleta")
      }

      if (aceptar("(")) {

        const valor = expresionParser()

        if (!aceptar(")")) {
          throw new Error("Falta )")
        }

        return {
          valor: valor.valor,
          porcentaje: false
        }
      }

      if (token.tipo === "numero") {

        avanzar()

        return {
          valor: token.valor,
          porcentaje: false
        }
      }

      if (token.tipo === "palabra") {

        avanzar()

        const nombre = token.valor.toLowerCase()

        if (nombre === "pi") {

          return {
            valor: Math.PI,
            porcentaje: false
          }
        }

        if (nombre === "e") {

          return {
            valor: Math.E,
            porcentaje: false
          }
        }

        if (nombre === "phi") {

          return {
            valor: PHI,
            porcentaje: false
          }
        }

        if (nombre === "ans") {

          return {
            valor: respuestaAnterior,
            porcentaje: false
          }
        }

        if (aceptar("(")) {

          const argumento = expresionParser()

          if (!aceptar(")")) {
            throw new Error("Falta )")
          }

          return {
            valor: ejecutarFuncion(
              nombre,
              argumento.valor
            ),
            porcentaje: false
          }
        }

        throw new Error("Función desconocida")
      }

      throw new Error("Expresión inválida")
    }

    const valorFinal = expresionParser()

    if (posicion < tokens.length) {
      throw new Error("Expresión inválida")
    }

    if (!Number.isFinite(valorFinal.valor)) {
      throw new Error("Resultado no válido")
    }

    return valorFinal.valor
  }

  const prepararExpresion = (texto) => {

    return texto
      .replaceAll("×", "*")
      .replaceAll("÷", "/")
      .replaceAll("−", "-")
      .replaceAll("π", "pi")
      .replaceAll("φ", "phi")
  }

  const mostrarError = (mensaje) => {

    displayExpression.textContent = mensaje
    displayResult.textContent = "Error"

    resultado = 0
  }

  const calcular = () => {

    if (!expresion) {
      return
    }

    try {

      const texto = prepararExpresion(expresion)
      const nuevoResultado = calcularExpresion(texto)

      resultado = nuevoResultado
      respuestaAnterior = nuevoResultado

      historial.push({
        expresion,
        resultado: nuevoResultado
      })

      if (historial.length > 50) {
        historial.shift()
      }

      displayExpression.textContent = expresion
      displayResult.textContent = formatearNumero(resultado)

      expresion = formatearNumero(resultado)
      nuevaOperacion = true

    } catch (error) {

      mostrarError(error.message)

      expresion = ""
      nuevaOperacion = true
    }
  }

  const añadir = (texto) => {

    if (nuevaOperacion) {
      expresion = ""
      nuevaOperacion = false
    }

    expresion += texto

    actualizarDisplay()
  }

  const añadirNumero = (numero) => {

    if (nuevaOperacion) {
      expresion = ""
      nuevaOperacion = false
    }

    if (numero === ".") {

      const ultimoNumero =
        expresion.match(
          /(?:^|[+\-*/^(])(\d*(?:\.\d*)?(?:[eE][+\-]?\d*)?)$/
        )

      if (
        ultimoNumero &&
        ultimoNumero[1].includes(".")
      ) {
        return
      }
    }

    expresion += numero

    actualizarDisplay()
  }

  numberButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const valor =
        boton.textContent.trim()

      añadirNumero(valor)
    })
  })

  const cambiarSigno = () => {

    if (!expresion) {

      expresion = "−"

      actualizarDisplay()

      return
    }

    try {

      const valor =
        calcularExpresion(
          prepararExpresion(expresion)
        )

      expresion =
        formatearNumero(-valor)

      resultado = -valor
      nuevaOperacion = false

      actualizarDisplay()

    } catch {

      expresion = "−"
      nuevaOperacion = false

      actualizarDisplay()
    }
  }

  operatorButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const valor =
        boton.textContent.trim()

      if (valor === "±") {

        cambiarSigno()

        return
      }

      if (valor === "%") {

        if (!expresion) {
          return
        }

        if (
          /[%!)]$/.test(expresion)
        ) {
          return
        }

        expresion += "%"

        nuevaOperacion = false

        actualizarDisplay()

        return
      }

      if (valor === "(") {

        if (
          expresion &&
          /[\dπφe)]$/i.test(expresion)
        ) {
          expresion += "×"
        }

        añadir("(")

        return
      }

      if (valor === ")") {

        if (!expresion) {
          return
        }

        if (
          /[+\-×÷^(]$/.test(expresion)
        ) {
          return
        }

        añadir(")")

        return
      }

      const operadores =
        ["+", "−", "×", "÷"]

      if (operadores.includes(valor)) {

        if (!expresion) {

          if (valor === "−") {
            expresion = "−"
          }

          actualizarDisplay()

          return
        }

        if (/[+−×÷]$/.test(expresion)) {

          expresion =
            expresion.slice(0, -1) + valor

        } else {

          expresion += valor
        }

        nuevaOperacion = false

        actualizarDisplay()
      }
    })
  })

  controlButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const accion =
        boton.textContent.trim()

      if (accion === "AC") {

        expresion = ""
        resultado = 0
        nuevaOperacion = false

        actualizarDisplay()

        return
      }

      if (accion === "⌫") {

        if (nuevaOperacion) {

          expresion = ""
          resultado = 0
          nuevaOperacion = false

        } else {

          expresion =
            expresion.slice(0, -1)
        }

        actualizarDisplay()
      }
    })
  })

  equalsButton.addEventListener("click", () => {
    calcular()
  })

  constantButton.addEventListener("click", () => {
    añadir("π")
  })

  specialButton.addEventListener("click", () => {

    if (nuevaOperacion) {

      expresion = ""
      nuevaOperacion = false
    }

    if (!expresion) {

      expresion = "1e"

      actualizarDisplay()

      return
    }

    const ultimoNumero =
      expresion.match(
        /(?:^|[+\-×÷^(])(\d+(?:\.\d*)?)$/
      )

    if (!ultimoNumero) {
      return
    }

    if (/[eE]/.test(ultimoNumero[1])) {
      return
    }

    expresion += "e"

    actualizarDisplay()
  })

  functionButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const funcion =
        boton.dataset.function

      if (funcion === "pi") {

        añadir("π")

        return
      }

      if (funcion === "e") {

        añadir("e")

        return
      }

      if (funcion === "phi") {

        añadir("φ")

        return
      }

      if (funcion === "ans") {

        añadir("Ans")

        return
      }

      if (funcion === "square") {

        if (!expresion) {
          return
        }

        expresion += "^2"

        actualizarDisplay()

        return
      }

      if (funcion === "cube") {

        if (!expresion) {
          return
        }

        expresion += "^3"

        actualizarDisplay()

        return
      }

      if (funcion === "power") {

        if (!expresion) {
          return
        }

        expresion += "^"

        actualizarDisplay()

        return
      }

      if (funcion === "inverse") {

        if (!expresion) {
          return
        }

        try {

          const valor =
            calcularExpresion(
              prepararExpresion(expresion)
            )

          if (valor === 0) {

            throw new Error(
              "No se puede dividir entre cero"
            )
          }

          expresion =
            `1/(${expresion})`

          nuevaOperacion = false

          actualizarDisplay()

        } catch (error) {

          mostrarError(error.message)

          expresion = ""
          nuevaOperacion = true
        }

        return
      }

      if (funcion === "factorial") {

        if (!expresion) {
          return
        }

        if (
          /[!%)]$/.test(expresion)
        ) {
          return
        }

        expresion += "!"

        actualizarDisplay()

        return
      }

      if (funcion === "percent") {

        if (!expresion) {
          return
        }

        if (
          /[%!)]$/.test(expresion)
        ) {
          return
        }

        expresion += "%"

        nuevaOperacion = false

        actualizarDisplay()

        return
      }

      if (!expresion) {

        expresion =
          `${funcion}(`

      } else {

        if (/[\dπφe)]$/i.test(expresion)) {

          expresion =
            `${funcion}(${expresion})`

        } else {

          expresion =
            `${funcion}(`
        }
      }

      nuevaOperacion = false

      actualizarDisplay()
    })
  })

  scientificToggle.addEventListener("click", () => {

    scientificSection.classList.toggle("collapsed")

    const abierto =
      !scientificSection.classList.contains("collapsed")

    scientificToggle.setAttribute(
      "aria-expanded",
      String(abierto)
    )
  })

  const obtenerValorActual = () => {

    try {

      if (expresion) {

        return calcularExpresion(
          prepararExpresion(expresion)
        )
      }

      return resultado

    } catch {

      return resultado
    }
  }

  memoryButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const accion =
        boton.textContent.trim()

      if (accion === "MC") {

        memoria = 0

        actualizarDisplay()

        return
      }

      if (accion === "MR") {

        expresion =
          formatearNumero(memoria)

        resultado = memoria
        nuevaOperacion = false

        actualizarDisplay()

        return
      }

      if (accion === "MS") {

        memoria =
          obtenerValorActual()

        actualizarDisplay()

        return
      }

      if (accion === "M+") {

        memoria +=
          obtenerValorActual()

        actualizarDisplay()

        return
      }

      if (accion === "M−") {

        memoria -=
          obtenerValorActual()

        actualizarDisplay()
      }
    })
  })

  toolbarButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const accion =
        boton.textContent.trim()

      if (accion === "DEG") {

        unidadAngular = "DEG"

        actualizarDisplay()

        return
      }

      if (accion === "RAD") {

        unidadAngular = "RAD"

        actualizarDisplay()

        return
      }

      if (accion === "GRAD") {

        unidadAngular = "GRAD"

        actualizarDisplay()

        return
      }

      if (accion === "F-E") {

        formato =
          formato === "FE"
            ? "NORMAL"
            : "FE"

        actualizarDisplay()

        return
      }

      if (accion === "SCI") {

        formato =
          formato === "SCI"
            ? "NORMAL"
            : "SCI"

        actualizarDisplay()

        return
      }

      if (accion === "FIX") {

        const nuevoValor =
          prompt(
            "¿Cuántos decimales quieres mostrar? (0-10)",
            decimalesFijos
          )

        if (nuevoValor === null) {
          return
        }

        const numero =
          Number(nuevoValor)

        if (
          Number.isInteger(numero) &&
          numero >= 0 &&
          numero <= 10
        ) {

          decimalesFijos = numero
          formato = "FIX"

          actualizarDisplay()

        } else {

          alert(
            "Introduce un número entre 0 y 10."
          )
        }
      }
    })
  })

  const mostrarHistorial = () => {

    if (historial.length === 0) {

      alert(
        "No hay operaciones en el historial."
      )

      return
    }

    const texto =
      historial
        .slice()
        .reverse()
        .map((operacion) => {

          return (
            `${operacion.expresion} = ` +
            `${formatearNumero(operacion.resultado)}`
          )

        })
        .join("\n")

    alert(
      `HISTORIAL\n\n${texto}`
    )
  }

  headerButtons.forEach((boton) => {

    boton.addEventListener("click", () => {

      const tipo =
        boton.getAttribute("aria-label")

      if (tipo === "Historial") {

        mostrarHistorial()

        return
      }

      if (tipo === "Configuración") {

        alert(
          `CONFIGURACIÓN\n\n` +
          `Modo angular: ${unidadAngular}\n` +
          `Formato: ${formato}\n` +
          `Decimales FIX: ${decimalesFijos}`
        )
      }
    })
  })

  document.addEventListener("keydown", (evento) => {

    const tecla = evento.key

    if (/^[0-9]$/.test(tecla)) {

      añadirNumero(tecla)

      return
    }

    if (tecla === ".") {

      añadirNumero(".")

      return
    }

    if (tecla === "+") {

      añadir("+")

      return
    }

    if (tecla === "-") {

      añadir("−")

      return
    }

    if (tecla === "*") {

      añadir("×")

      return
    }

    if (tecla === "/") {

      evento.preventDefault()

      añadir("÷")

      return
    }

    if (
      tecla === "(" ||
      tecla === ")"
    ) {

      añadir(tecla)

      return
    }

    if (tecla === "%") {

      if (
        expresion &&
        !/[%!)]$/.test(expresion)
      ) {

        expresion += "%"

        nuevaOperacion = false

        actualizarDisplay()
      }

      return
    }

    if (tecla === "!") {

      if (
        expresion &&
        !/[!%)]$/.test(expresion)
      ) {

        expresion += "!"

        actualizarDisplay()
      }

      return
    }

    if (
      tecla === "Enter" ||
      tecla === "="
    ) {

      evento.preventDefault()

      calcular()

      return
    }

    if (tecla === "Backspace") {

      if (nuevaOperacion) {

        expresion = ""
        resultado = 0
        nuevaOperacion = false

      } else {

        expresion =
          expresion.slice(0, -1)
      }

      actualizarDisplay()

      return
    }

    if (tecla === "Escape") {

      expresion = ""
      resultado = 0
      nuevaOperacion = false

      actualizarDisplay()
    }
  })

  if (!scientificSection.classList.contains("collapsed")) {
    scientificSection.classList.add("collapsed")
  }

  scientificToggle.setAttribute(
    "aria-expanded",
    "false"
  )

  actualizarDisplay()

})()