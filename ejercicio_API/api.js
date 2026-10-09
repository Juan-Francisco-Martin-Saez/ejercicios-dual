const fs = require('fs')

async function getData() {

  try {
    const data = []
    const ciudades = ['BCN', 'MAD', 'PMI']

    for (const ciudad of ciudades) {

      console.log('fetching data for airport', ciudad)

      const response = await fetch(`https://www.aena.es/sites/Satellite?pagename=AENA_ConsultarVuelos&airport=${ciudad}&flightType=L&dosDias=si`)

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} en ${ciudad}`)
      }

      const result = await response.json()

      data.push({
        ciudad: ciudad,
        data: result
      })
    }

    fs.writeFileSync('aena.json', JSON.stringify(data, null, 2))

  } catch (error) {
    console.log(error)
  }
}

getData()