(async () => {

  const fs = require('fs/promises')

  try {

    const file = await fs.readFile('./data/afiliados-por-municipio-sexo.json', 'utf-8')

    const data = JSON.parse(file)

    let filterData = data.series[0].data.filter(element => {

      return element.sexo !== "TOTAL" &&
        element["Isla y municipio de residencia"] !== "ILLES BALEARS" &&
        element["Isla y municipio de residencia"] !== "MALLORCA" &&
        element["Isla y municipio de residencia"] !== "MENORCA" &&
        element["Isla y municipio de residencia"] !== "EIVISSA" &&
        element["Isla y municipio de residencia"] !== "FORMENTERA" &&
        element["Isla y municipio de residencia"] !== "Sin descripción" &&
        element.Sexo !== "TOTAL"
    })

    filterData = filterData.reduce((acumulador, elemento) => {

      const [codigoPostal, ...nombreMunicipio] =
        elemento["Isla y municipio de residencia"].split(" ")

      let municipio = nombreMunicipio.join(" ")

      if (municipio.includes("(")) {

        let nombre = municipio.replace(")", "").split(" (")

        municipio = nombre[1] + " " + nombre[0]

      }

      const sexo = elemento.Sexo === "Hombres" ? "M" : "F"
      const periodo = elemento.Periodo

      if (!acumulador[codigoPostal]) acumulador[codigoPostal] = {}
      if (!acumulador[codigoPostal][sexo]) acumulador[codigoPostal][sexo] = {}
      acumulador[codigoPostal][sexo][periodo] = {
        periodo,
        municipio,
        codigoPostal,
        sexo,
        cantidad: Number(elemento.valor)
      }
      return acumulador

    }, {})

    await fs.writeFile('./data/normalizacion-afiliados-por-municipio-sexo.json', JSON.stringify(filterData, null, 2))

  } catch (error) {

    console.log(error)

  }

})()