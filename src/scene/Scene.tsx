import { PerformanceMonitor } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import { Fridge } from './devices/Fridge'
import { Gateway } from './devices/Gateway'
import { Sensor } from './devices/Sensor'
import { Smartphone } from './devices/Smartphone'
import { LoraWaves } from './links/LoraWaves'
import { Effects } from './effects/Effects'
import { CameraRig } from './staging/CameraRig'
import { Lighting } from './staging/Lighting'
import { Room } from './staging/Room'
import { StudioEnvironment } from './staging/StudioEnvironment'

/** Contenuto della scena, montato dentro il Canvas. */
export function Scene() {
  return (
    <>
      <StudioEnvironment />
      <Lighting />
      <CameraRig />
      <Room />
      <Fridge />
      <Sensor />
      <Gateway />
      <Smartphone />
      <LoraWaves />
      <Effects />
      <PerformanceMonitor
        ms={180}
        iterations={6}
        threshold={0.7}
        flipflops={3}
        onDecline={() => useAppStore.getState().setQuality('low')}
      />
    </>
  )
}
