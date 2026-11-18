import { create } from 'zustand'
import { cameraAlarm, cameraHome } from '../config/devices'
import { thermal } from '../config/scenarios'
import { copy } from '../content/it'
import { simulation } from '../simulation/director'
import type { AlarmPhase, AppStore, DeviceId, QualityTier } from './types'

const initial = {
  alarmPhase: 'idle' as const,
  temperatureC: thermal.nominalC,
  appPhase: 'intro' as const,
  selectedDevice: null,
  hoveredDevice: null,
  targetPosition: cameraHome.position,
  lookAtTarget: cameraHome.target,
  isAnimatingCamera: false,
  quality: 'high' as const,
  reducedMotion: false,
  liveMessage: '',
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...initial,

  triggerExcursion: () => {
    // Stesso gesto del bottone Smartphone, ma con l'inquadratura più stretta dell'escalation.
    set({
      targetPosition: [...cameraAlarm.position],
      lookAtTarget: [...cameraAlarm.target],
      isAnimatingCamera: true,
    })
    simulation.excursion()
  },

  acknowledgeAlarm: () => {
    simulation.acknowledge()
  },

  reset: () => {
    simulation.reset()
  },

  setAlarmPhase: (alarmPhase: AlarmPhase) => set({ alarmPhase }),

  setTemperature: (celsius: number) => {
    const temperatureC = Math.round(celsius * 10) / 10
    if (get().temperatureC === temperatureC) return
    set({ temperatureC })
  },

  selectDevice: (selectedDevice: DeviceId | null) => set({ selectedDevice }),
  hoverDevice: (hoveredDevice: DeviceId | null) => set({ hoveredDevice }),
  moveCamera: (targetPosition, lookAtTarget) =>
    set({
      targetPosition: [...targetPosition],
      lookAtTarget: [...lookAtTarget],
      isAnimatingCamera: true,
    }),
  releaseCamera: () => set({ isAnimatingCamera: false }),
  finishIntro: () => set({ appPhase: 'explore', liveMessage: copy.live.intro }),
  setQuality: (quality: QualityTier) => set({ quality }),
  setReducedMotion: (reducedMotion: boolean) => set({ reducedMotion }),
  setLiveMessage: (liveMessage: string) => set({ liveMessage }),
}))

/** Qualità e reduced-motion si leggono una volta, prima del primo render. */
export function initClientPreferences(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const lowPower = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4

  useAppStore.setState({
    reducedMotion: reduced,
    quality: coarse || lowPower || reduced ? 'low' : 'high',
    appPhase: reduced ? 'explore' : 'intro',
  })
}
