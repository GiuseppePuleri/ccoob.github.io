import type { ThermalConfig, TimelineStep } from '../store/types'

/** Valori illustrativi: il racconto dura circa dodici secondi. */
export const thermal: ThermalConfig = {
  nominalC: 5,
  minC: 2,
  maxC: 8,
  excursionPeakC: 12,
}

/**
 * 0s deriva, 4s la temperatura tocca la soglia e parte l'email,
 * 6s senza conferma parte l'SMS, 8s la chiamata vocale, 12s si raggiunge il picco.
 */
export const excursionMarks = {
  emailAtSec: 4,
  smsAtSec: 6,
  callAtSec: 8,
  peakAtSec: 12,
  recoverSec: 3,
} as const

export const timeline: TimelineStep[] = [
  { atMs: 0, phase: 'drifting' },
  { atMs: excursionMarks.emailAtSec * 1000, phase: 'email' },
  { atMs: excursionMarks.smsAtSec * 1000, phase: 'sms' },
  { atMs: excursionMarks.callAtSec * 1000, phase: 'call' },
]
