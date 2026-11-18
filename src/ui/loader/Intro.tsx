import { copy } from '../../content/it'
import { useAppStore } from '../../store/useAppStore'

export function Intro({ onEnter }: { onEnter: () => void }) {
  const open = useAppStore((state) => state.appPhase !== 'explore')

  return (
    <div className="xo-intro" data-open={open} aria-hidden={!open}>
      <div>
        <p className="xo-kicker">{copy.brand}</p>
        <h1>{copy.tagline}</h1>
        <button type="button" onClick={onEnter}>
          {copy.enter}
        </button>
      </div>
    </div>
  )
}
