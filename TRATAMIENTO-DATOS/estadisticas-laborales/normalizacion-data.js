(async () => {

  const fs = require('fs/promises')

  try {
    
    const file = await fs.readFile('./data/data.json', 'utf-8')
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

    await fs.writeFile('./data/total.json', JSON.stringify(filterData, null, 2))

  } catch (error) {
    console.log(error)
  }
})()