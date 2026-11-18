import { excursionMarks, thermal } from '../config/scenarios'
import { copy } from '../content/it'
import { isEscalating } from '../store/selectors'
import { useAppStore } from '../store/useAppStore'
import { recoveryDone, temperatureAlong, temperatureRecover } from './temperatureModel'

/**
 * Il director possiede i timer. I componenti non schedulano nulla:
 * leggono solo la fase e la temperatura.
 *
 * `generation` invalida il loop precedente quando parte un nuovo comando.
 */
type SimulationApi = {
  excursion: () => void
  acknowledge: () => void
  reset: () => void
}

export const simulation: SimulationApi = {
  excursion: () => {},
  acknowledge: () => {},
  reset: () => {},
}

let generation = 0
let started = false

function publishTemperature(celsius: number): void {
  useAppStore.getState().setTemperature(celsius)
}

function runExcursion(): void {
  const id = ++generation
  const startedAt = performance.now()
  let lastPublish = 0

  useAppStore.getState().setAlarmPhase('drifting')
  useAppStore.getState().setLiveMessage(copy.live.drifting)
  publishTemperature(thermal.nominalC)

  const step = (now: number): void => {
    if (id !== generation) return
    const state = useAppStore.getState()
    if (state.alarmPhase === 'acknowledged' || state.alarmPhase === 'idle') return

    const elapsed = (now - startedAt) / 1000
    const temperature = temperatureAlong(elapsed)

    if (now - lastPublish >= 250 || elapsed >= excursionMarks.peakAtSec) {
      publishTemperature(temperature)
      lastPublish = now
    }

    if (state.alarmPhase === 'drifting' && temperature >= thermal.maxC) {
      state.setAlarmPhase('email')
      state.setLiveMessage(copy.live.email)
    } else if (state.alarmPhase === 'email' && elapsed >= excursionMarks.smsAtSec) {
      state.setAlarmPhase('sms')
      state.setLiveMessage(copy.live.sms)
    } else if (state.alarmPhase === 'sms' && elapsed >= excursionMarks.callAtSec) {
      state.setAlarmPhase('call')
      state.setLiveMessage(copy.live.call)
    }

    if (elapsed < excursionMarks.peakAtSec) requestAnimationFrame(step)
    else publishTemperature(thermal.excursionPeakC)
  }

  requestAnimationFrame(step)
}

function runAcknowledge(): void {
  const state = useAppStore.getState()
  if (!isEscalating(state.alarmPhase)) return

  const id = ++generation
  const from = state.temperatureC
  const startedAt = performance.now()
  let lastPublish = 0

  state.setAlarmPhase('acknowledged')
  state.setLiveMessage(copy.live.acknowledged)

  const step = (now: number): void => {
    if (id !== generation) return
    const elapsed = (now - startedAt) / 1000
    if (now - lastPublish >= 250) {
      publishTemperature(temperatureRecover(from, elapsed))
      lastPublish = now
    }
    if (!recoveryDone(elapsed)) {
      requestAnimationFrame(step)
      return
    }
    publishTemperature(thermal.nominalC)
    useAppStore.getState().setAlarmPhase('idle')
  }

  requestAnimationFrame(step)
}

function runReset(): void {
  generation += 1
  useAppStore.setState({
    alarmPhase: 'idle',
    temperatureC: thermal.nominalC,
    selectedDevice: null,
    liveMessage: copy.live.reset,
  })
}

export function startDirector(): void {
  if (started) return
  started = true
  simulation.excursion = runExcursion
  simulation.acknowledge = runAcknowledge
  simulation.reset = runReset
}
