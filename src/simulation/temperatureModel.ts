import { thermal, excursionMarks } from '../config/scenarios'

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

/**
 * 0–4 s: dalla nominale alla soglia (parte l'escalation).
 * 4–12 s: dalla soglia al picco dimostrativo.
 */
export function temperatureAlong(elapsedSec: number): number {
  const { nominalC, maxC, excursionPeakC } = thermal
  if (elapsedSec <= 0) return nominalC
  if (elapsedSec < excursionMarks.emailAtSec) {
    return lerp(nominalC, maxC, elapsedSec / excursionMarks.emailAtSec)
  }
  const span = excursionMarks.peakAtSec - excursionMarks.emailAtSec
  const t = Math.min(1, (elapsedSec - excursionMarks.emailAtSec) / span)
  return lerp(maxC, excursionPeakC, t)
}

export function temperatureRecover(from: number, elapsedSec: number): number {
  const t = Math.min(1, elapsedSec / excursionMarks.recoverSec)
  const eased = 1 - (1 - t) ** 3
  return lerp(from, thermal.nominalC, eased)
}

export function recoveryDone(elapsedSec: number): boolean {
  return elapsedSec >= excursionMarks.recoverSec
}
