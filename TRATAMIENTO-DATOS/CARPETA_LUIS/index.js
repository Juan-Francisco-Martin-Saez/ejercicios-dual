(async () => {

  const fs = require('fs/promises')

  try {

    const file = await fs.readFile('./data.json', 'utf-8')
    const data = JSON.parse(file)

    let filterData = data.map(element => {
      return {
        medidas: element["MEDIDAS#es"],
        municipio: element['TERRITORIO#es'],
        codigoPostal: element['TERRITORIO_CODE'],
        periodo: element['TIME_PERIOD#es'],
        sexo: element['SEXO_CODE'],
        cantidad: element['OBS_VALUE']
      }
    })

    filterData = filterData.filter(element => {
      return element.sexo !== "_T" &&
        element.municipio === "Illes Balears" &&
        element.medidas === "Parados registrados" &&
        element.sexo !== "F"
    })

    filterData = filterData.reduce((accumulator, element) => {
      let [mes, año] = element.periodo.split("/");
      let cantidad = element.cantidad;
      let sexo = element.sexo;
      if (!accumulator[año]) {
        accumulator[año] = [];
      }
      accumulator[año].push({
        cantidad: cantidad,
        mes: mes,
        sexo: sexo
      })
      return accumulator
    }, {})



    await fs.writeFile('./resultado.json', JSON.stringify(filterData, null, 2))

  } catch (error) {
    console.log(error)
  }
})()