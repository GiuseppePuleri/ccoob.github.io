import type { AlarmPhase, LinkId, LinkStatus, SimulationState } from './types'

/** Email, SMS o chiamata: l'allarme è arrivato allo smartphone. */
export function isEscalating(phase: AlarmPhase): boolean {
  return phase === 'email' || phase === 'sms' || phase === 'call'
}

/** Dalla deriva in poi, finché nessuno conferma. */
export function isAlerting(phase: AlarmPhase): boolean {
  return phase === 'drifting' || isEscalating(phase)
}

/**
 * I collegamenti non sono memorizzati: nascono dalla fase d'allarme.
 * LoRa trasmette sempre. Il cellulare resta pronto e si attiva solo per consegnare l'allarme.
 */
export function selectLinkStatus(state: SimulationState, id: LinkId): LinkStatus {
  if (isAlerting(state.alarmPhase)) return 'alert'
  return id === 'cellular' ? 'standby' : 'active'
}
