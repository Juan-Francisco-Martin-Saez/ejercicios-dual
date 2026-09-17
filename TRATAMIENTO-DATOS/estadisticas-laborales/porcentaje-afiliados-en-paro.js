(async () => {

  const fs = require('fs/promises')

  try {

    const afiliadosFile = await fs.readFile('./data/normalizacion-afiliados-por-municipio-sexo.json', 'utf-8')
    const paradosFile = await fs.readFile('./data/normalizacion-parados-por-municipio-sexo.json', 'utf-8')

    const afiliadosData = JSON.parse(afiliadosFile)
    const paradosData = JSON.parse(paradosFile)

    let resultado = paradosData.reduce((acc, element) => {

      if (afiliadosData[element.codigoPostal]) {

        if (afiliadosData[element.codigoPostal][element.sexo][element.periodo]) {

          const afiliados = afiliadosData[element.codigoPostal][element.sexo][element.periodo].cantidad
          const parados = element.cantidad

          if (afiliados !== null && parados !== null) {

            const porcentaje = (parados * 100) / afiliados

            acc.push({
              municipio: element.municipio,
              codigoPostal: element.codigoPostal,
              sexo: element.sexo,
              periodo: element.periodo,
              parados: parados,
              porcentaje: porcentaje
            })

          }

        }

      }

      return acc

    }, [])

    await fs.writeFile('./data/porcentaje-afiliados-en-paro.json', JSON.stringify(resultado, null, 2))

  } catch (error) {

    console.log(error)

  }

})()
