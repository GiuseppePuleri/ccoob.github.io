import { copy } from '../../content/it'
import { useAppStore } from '../../store/useAppStore'

export function ScenarioPanel() {
  const offline = useAppStore((state) => state.itNetwork === 'offline')
  const alarming = useAppStore((state) => state.alarmPhase !== 'idle' && state.alarmPhase !== 'acknowledged')
  const triggerBlackout = useAppStore((state) => state.triggerBlackout)
  const restoreNetwork = useAppStore((state) => state.restoreNetwork)
  const triggerExcursion = useAppStore((state) => state.triggerExcursion)
  const reset = useAppStore((state) => state.reset)

  return (
    <div className="xo-scenarios" role="group" aria-label="Scenari">
      <button type="button" className="xo-attack" aria-pressed={offline} onClick={() => (offline ? restoreNetwork() : triggerBlackout())}>
        {offline ? copy.attackActive : copy.attack}
      </button>
      <button type="button" className="xo-heat" aria-pressed={alarming} onClick={triggerExcursion}>
        {alarming ? copy.excursionActive : copy.excursion}
      </button>
      <button type="button" className="xo-quiet" onClick={reset}>
        {copy.reset}
      </button>
    </div>
  )
}
