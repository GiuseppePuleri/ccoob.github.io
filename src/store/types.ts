export type DeviceId = 'fridge' | 'sensor' | 'gateway' | 'smartphone'
export type LinkId = 'lora' | 'cellular'
/** `standby`: il canale è pronto ma non sta trasmettendo. */
export type LinkStatus = 'active' | 'alert' | 'standby'
/** L'escalation è email, poi SMS, poi chiamata vocale. */
export type AlarmPhase = 'idle' | 'drifting' | 'email' | 'sms' | 'call' | 'acknowledged'
export type AppPhase = 'intro' | 'explore'
export type QualityTier = 'low' | 'high'

export interface SimulationState {
  /** `idle` è il funzionamento normale. */
  alarmPhase: AlarmPhase
  /** Arrotondata a 0,1 °C. Il director la aggiorna a circa 4 Hz. */
  temperatureC: number
}

export interface SimulationActions {
  triggerExcursion: () => void
  acknowledgeAlarm: () => void
  reset: () => void
  /** Riservati al director: i componenti non li chiamano. */
  setAlarmPhase: (phase: AlarmPhase) => void
  setTemperature: (celsius: number) => void
}

export interface UiState {
  appPhase: AppPhase
  /** Dispositivo con il pop-up aperto. */
  selectedDevice: DeviceId | null
  hoveredDevice: DeviceId | null
  /** Destinazione dell'ultimo comando di camera. */
  targetPosition: [number, number, number]
  /** Punto osservato dalla camera e da OrbitControls durante la transizione. */
  lookAtTarget: [number, number, number]
  /** `true` solo finché il controller sta raggiungendo la destinazione. */
  isAnimatingCamera: boolean
  quality: QualityTier
  reducedMotion: boolean
  /** Testo per la regione aria-live. */
  liveMessage: string
}

export interface UiActions {
  selectDevice: (id: DeviceId | null) => void
  hoverDevice: (id: DeviceId | null) => void
  moveCamera: (
    targetPosition: [number, number, number],
    lookAtTarget: [number, number, number],
  ) => void
  releaseCamera: () => void
  finishIntro: () => void
  setQuality: (tier: QualityTier) => void
  setReducedMotion: (value: boolean) => void
  setLiveMessage: (message: string) => void
}

export type AppState = SimulationState & UiState
export type AppStore = AppState & SimulationActions & UiActions

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
}

export interface DeviceConfig {
  id: DeviceId
  modelUrl: string
  /** Anello di selezione, sopra il dispositivo. */
  hotspotAnchor: [number, number, number]
  /** Punto sul corpo del dispositivo da cui parte la linea guida del pop-up. */
  calloutAnchor: [number, number, number]
  cameraPreset: CameraPreset
}

export interface DeviceContent {
  title: string
  tagline: string
  body: string
}

export interface TimelineStep {
  atMs: number
  phase: AlarmPhase
}

export interface ThermalConfig {
  nominalC: number
  minC: number
  maxC: number
  excursionPeakC: number
}

export interface QualitySettings {
  dpr: [number, number]
  multisampling: number
  bloom: boolean
  depthOfField: boolean
}
