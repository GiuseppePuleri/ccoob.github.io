import type { LinkId, LinkStatus, SimulationState } from './types'

/**
 * I collegamenti non sono memorizzati: nascono dallo stato di rete e dall'allarme.
 * Wi-Fi e OOB sono indipendenti, così il blackout non spegne il backup.
 */
export function selectLinkStatus(state: SimulationState, id: LinkId): LinkStatus {
  if (id === 'wifi') return state.itNetwork === 'offline' ? 'down' : 'active'

  const alerting =
    state.alarmPhase === 'drifting' ||
    state.alarmPhase === 'sms' ||
    state.alarmPhase === 'call'

  return alerting ? 'alert' : 'active'
}
