import { palette } from '../../config/theme'
import { isEscalating } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'

/** Colore del canale di backup: accento a riposo, ambra in deriva, rosso in allarme. */
export function oobSignalColor(): string {
  const phase = useAppStore.getState().alarmPhase
  if (isEscalating(phase)) return palette.alarm
  if (phase === 'drifting') return palette.amber
  return palette.oob
}
