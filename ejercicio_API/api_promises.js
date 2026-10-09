const fs = require('fs')

async function getData() {

  try {
    const ciudades = ['BCN', 'MAD', 'PMI']

    const promises = ciudades.map(async (ciudad) => {

      console.log('fetching data for airport', ciudad)

      const response = await fetch(
        `https://www.aena.es/sites/Satellite?pagename=AENA_ConsultarVuelos&airport=${ciudad}&flightType=L&dosDias=si`
      )

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} en ${ciudad}`)
      }

      const result = await response.json()

      return {
        ciudad,
        data: result
      }
    })

    const data = await Promise.all(promises)

    fs.writeFileSync('aena_promises.json', JSON.stringify(data, null, 2))



  } catch (error) {
    console.log(error)
  }
}

getData()