const CLAVE_PARTIDA = "harvestingSchoolPartida"

export function obtenerPartida() {
  const partida = localStorage.getItem(CLAVE_PARTIDA)
  return partida ? JSON.parse(partida) : null
}
export function existePartida() {
  const partida = obtenerPartida()
  return partida?.tutorialCompletado === true
}
export function crearPartida() {
  const partida = {
    tutorialCompletado: true,
    jugador: {},
    cultivo: {},
    inventario: {},
    creditos: 0
  }
  localStorage.setItem(CLAVE_PARTIDA, JSON.stringify(partida))
  return partida
}
export function guardarPartida(datos) {
  const partida = obtenerPartida()
  if (!partida?.tutorialCompletado) return false
  localStorage.setItem(CLAVE_PARTIDA, JSON.stringify({ ...partida, ...datos }))
  return true
}