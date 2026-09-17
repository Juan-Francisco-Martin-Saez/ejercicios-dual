// (async () => {

//  const fs = require('fs/promises')

//try {

// const file = await fs.readFile('./data.json', 'utf-8')
// const data = JSON.parse(file)

// let filterData = data.map(element => {
//return {
//   medidas: element["MEDIDAS#es"],
//   municipio: element['TERRITORIO#es'],
//  codigoPostal: element['TERRITORIO_CODE'],
//   periodo: element['TIME_PERIOD#es'],
//   sexo: element['SEXO_CODE'],
//   cantidad: element['OBS_VALUE']
// }
// })

//filterData = filterData.filter(element => {
//return element.sexo !== "_T" &&
// element.municipio !== "Illes Balears" &&
// element.medidas === "Parados registrados" &&
//element.municipio === "Palma" &&
// element.sexo === "F"
//})

//const desempleados = filterData.reduce((total, element) => {
//  return total + element.cantidad
//}, 0)


//console.log(desempleados / filterData.length)

// filterData.sort((a,b) => b.cantidad - a.cantidad)

// await fs.writeFile('./total.json', JSON.stringify(filterData, null, 2))

// } catch (error) {
// console.log(error)
// }
// }) ()




(async () => {

  const fs = require('fs/promises')

  try {

    const file = await fs.readFile('./poblacion_baleares_2005_2025_sexo.json', 'utf-8')
    const data = JSON.parse(file)

    let filterData = data.map(elemento => {
      if (elemento.municipio.includes('-')) {
        const [nombre, articulo] = elemento.municipio.split('-')
        elemento.municipio = `${nombre.trim()} ${articulo.trim()}`
      }
      return elemento
    })

    await fs.writeFile('./poblacion_por_sexo.json', JSON.stringify(filterData, null, 2))

  } catch (error) {
    console.log(error)
  }
})()