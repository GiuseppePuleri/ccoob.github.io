import { publicUrl } from './assets'
import type { CameraPreset, DeviceConfig, DeviceId } from '../store/types'

export type Vec3 = [number, number, number]

/** Superficie del diorama: i dispositivi appoggiano a y = 0. */
export const stage = {
  fridge: [-0.55, 0, 0] as Vec3,
  sensor: [-0.55, 1.08, -0.08] as Vec3,
  gateway: [0.78, 1.016, -0.32] as Vec3,
  router: [1.32, 1.016, 0.18] as Vec3,
  phone: [0.42, 0, 0.72] as Vec3,
  shelf: [1.05, 1.0, -0.06] as Vec3,
  shelfSize: [1.15, 0.032, 0.82] as Vec3,
}

/** Ancoraggio del pop-up, in coordinate locali del dispositivo. */
export const hotspotAnchor: Record<DeviceId, Vec3> = {
  fridge: [0, 1.72, 0],
  sensor: [0, 0.16, 0],
  gateway: [0, 0.42, 0],
  router: [0, 0.28, 0],
  smartphone: [0, 0.28, 0],
}

export const signalPaths = {
  /** Esce dal sensore, attraversa la porta, arriva all'antenna del gateway. */
  lora: [
    [-0.55, 1.08, -0.08],
    [-0.55, 1.1, 0.38],
    [0.05, 1.48, 0.62],
    [0.78, 1.42, -0.32],
  ] as Vec3[],
  /** Si spegne sulla lamiera, prima di entrare. */
  wifi: [
    [1.32, 1.16, 0.18],
    [0.4, 1.08, 0.5],
    [-0.4, 1.02, 0.42],
  ] as Vec3[],
  cellular: [
    [0.78, 1.36, -0.22],
    [0.7, 0.75, 0.28],
    [0.42, 0.28, 0.72],
  ] as Vec3[],
}

export const devices: DeviceConfig[] = [
  {
    id: 'fridge',
    modelUrl: publicUrl('models/fridge.glb'),
    hotspotAnchor: hotspotAnchor.fridge,
    cameraPreset: { position: [0.85, 1.25, 2.35], target: [-0.55, 0.9, 0.05] },
  },
  {
    id: 'sensor',
    modelUrl: publicUrl('models/sensor.glb'),
    hotspotAnchor: hotspotAnchor.sensor,
    cameraPreset: { position: [0.35, 1.25, 1.7], target: [-0.55, 1.08, -0.05] },
  },
  {
    id: 'gateway',
    modelUrl: publicUrl('models/gateway.glb'),
    hotspotAnchor: hotspotAnchor.gateway,
    cameraPreset: { position: [1.7, 1.35, 1.15], target: [0.78, 1.2, -0.25] },
  },
  {
    id: 'router',
    modelUrl: publicUrl('models/router.glb'),
    hotspotAnchor: hotspotAnchor.router,
    cameraPreset: { position: [2.15, 1.3, 1.25], target: [1.32, 1.12, 0.15] },
  },
  {
    id: 'smartphone',
    modelUrl: publicUrl('models/smartphone.glb'),
    hotspotAnchor: hotspotAnchor.smartphone,
    cameraPreset: { position: [1.15, 0.72, 1.55], target: [0.42, 0.16, 0.68] },
  },
]

export const cameraHome: CameraPreset = {
  position: [2.55, 1.62, 3.65],
  target: [0.12, 0.72, 0.12],
}

export const cameraIntro: CameraPreset = {
  position: [3.5, 2.25, 4.8],
  target: [0.05, 0.8, 0],
}

/** Inquadratura dell'escalation: lo smartphone sul bancone. */
export const cameraAlarm: CameraPreset = {
  position: [1.25, 0.85, 1.7],
  target: [0.42, 0.18, 0.68],
}

export function presetFor(id: DeviceId): CameraPreset {
  return devices.find((device) => device.id === id)?.cameraPreset ?? cameraHome
}
