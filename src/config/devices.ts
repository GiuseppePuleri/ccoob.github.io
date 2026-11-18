import { publicUrl } from './assets'
import type { CameraPreset, DeviceConfig, DeviceId } from '../store/types'

export type Vec3 = [number, number, number]

/** Scocca del frigo, in metri. `wall` è lo spessore della lamiera. */
export const fridgeBody = { width: 0.7, height: 1.56, depth: 0.62, wall: 0.04, base: 0.02 } as const

/** Corpo del sensore e spessore del biadesivo che lo tiene alla parete. */
export const sensorBody = { width: 0.058, height: 0.092, depth: 0.02, pad: 0.004 } as const

const fridge: Vec3 = [-0.55, 0, 0]
const shelf: Vec3 = [1.12, 1.0, -0.06]
const shelfSize: Vec3 = [1.1, 0.032, 0.82]
const tableTop = shelf[1] + shelfSize[1] / 2

/** Faccia interna della parete di fondo: il sensore è incollato qui. */
const backWallZ = fridge[2] - fridgeBody.depth / 2 + fridgeBody.wall
/** Spigolo anteriore della fiancata rivolta al tavolo: la fessura della porta è qui. */
const doorGap: Vec3 = [
  fridge[0] + fridgeBody.width / 2 - 0.02,
  1.32,
  fridge[2] + fridgeBody.depth / 2 + 0.05,
]

function offset(base: Vec3, dx: number, dy: number, dz: number): Vec3 {
  return [base[0] + dx, base[1] + dy, base[2] + dz]
}

/**
 * Superficie del diorama a y = 0, piano del tavolo a `tableTop`.
 * Sul tavolo ci sono solo il gateway e lo smartphone.
 */
export const stage = {
  fridge,
  sensor: [fridge[0] + 0.13, 1.3, backWallZ + sensorBody.pad + sensorBody.depth / 2] as Vec3,
  gateway: [0.92, tableTop, -0.04] as Vec3,
  phone: [1.38, tableTop, 0.02] as Vec3,
  shelf,
  shelfSize,
}

/** Punta dell'antenna del gateway: le onde LoRa finiscono qui. */
export const gatewayAntennaTip: Vec3 = offset(stage.gateway, 0.03, 0.5, 0)

/** Anello di selezione, in coordinate locali del dispositivo. */
export const hotspotAnchor: Record<DeviceId, Vec3> = {
  fridge: [0, 1.72, 0],
  sensor: [0, 0.1, 0.014],
  gateway: [-0.06, 0.42, 0],
  smartphone: [0, 0.22, 0],
}

/**
 * Punto sul corpo del dispositivo da cui parte la linea guida del pop-up,
 * in coordinate locali. Sta sul lato destro, così la scheda si apre di fianco.
 */
export const calloutAnchor: Record<DeviceId, Vec3> = {
  fridge: [fridgeBody.width / 2, 1.52, fridgeBody.depth / 2],
  sensor: [sensorBody.width / 2, sensorBody.height * 0.3, sensorBody.depth / 2],
  gateway: [0.08, 0.24, 0.025],
  smartphone: [0.036, 0.12, -0.02],
}

/** L'unica trasmissione in scena: dal sensore alla fessura della porta, poi in arco fino all'antenna del gateway. */
export const loraPath: Vec3[] = [stage.sensor, doorGap, [0.4, 1.58, 0.3], gatewayAntennaTip]

const phoneScreen = offset(stage.phone, 0, 0.084, 0)

export const devices: DeviceConfig[] = [
  {
    id: 'fridge',
    modelUrl: publicUrl('models/fridge.glb'),
    hotspotAnchor: hotspotAnchor.fridge,
    calloutAnchor: calloutAnchor.fridge,
    cameraPreset: { position: [0.85, 1.25, 2.35], target: [-0.55, 0.9, 0.05] },
  },
  {
    id: 'sensor',
    modelUrl: publicUrl('models/sensor.glb'),
    hotspotAnchor: hotspotAnchor.sensor,
    calloutAnchor: calloutAnchor.sensor,
    cameraPreset: { position: [-0.12, 1.62, 0.98], target: [stage.sensor[0], 1.24, -0.2] },
  },
  {
    id: 'gateway',
    modelUrl: publicUrl('models/gateway.glb'),
    hotspotAnchor: hotspotAnchor.gateway,
    calloutAnchor: calloutAnchor.gateway,
    cameraPreset: {
      position: offset(stage.gateway, 0.5, 0.534, 1.19),
      target: offset(stage.gateway, 0, 0.284, 0),
    },
  },
  {
    id: 'smartphone',
    modelUrl: publicUrl('models/smartphone.glb'),
    hotspotAnchor: hotspotAnchor.smartphone,
    calloutAnchor: calloutAnchor.smartphone,
    cameraPreset: { position: offset(phoneScreen, 0.17, 0.25, 0.8), target: phoneScreen },
  },
]

export const cameraHome: CameraPreset = {
  position: [2.59, 1.81, 3.23],
  target: [0.4, 1.0, 0.05],
}

export const cameraIntro: CameraPreset = {
  position: [3.5, 2.25, 4.8],
  target: [0.05, 0.8, 0],
}

/** Inquadratura dell'escalation: lo schermo dello smartphone, da vicino. */
export const cameraAlarm: CameraPreset = {
  position: offset(phoneScreen, 0.11, 0.18, 0.56),
  target: phoneScreen,
}

export function presetFor(id: DeviceId): CameraPreset {
  return devices.find((device) => device.id === id)?.cameraPreset ?? cameraHome
}
