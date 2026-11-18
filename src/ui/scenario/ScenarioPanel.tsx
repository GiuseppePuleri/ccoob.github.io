import { copy } from '../../content/it'
import { useAppStore } from '../../store/useAppStore'

export function ScenarioPanel() {
  const alarming = useAppStore((state) => state.alarmPhase !== 'idle' && state.alarmPhase !== 'acknowledged')
  const triggerExcursion = useAppStore((state) => state.triggerExcursion)
  const reset = useAppStore((state) => state.reset)

  return (
    <div className="xo-scenarios" role="group" aria-label="Scenari">
      <button type="button" className="xo-heat" aria-pressed={alarming} onClick={triggerExcursion}>
        {alarming ? copy.excursionActive : copy.excursion}
      </button>
      <button type="button" className="xo-quiet" onClick={reset}>
        {copy.reset}
      </button>
    </div>
  )
}
