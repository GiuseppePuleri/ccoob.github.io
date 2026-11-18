import { thermal } from '../../config/scenarios'
import { copy } from '../../content/it'
import { selectLinkStatus } from '../../store/selectors'
import type { LinkId, LinkStatus } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

const links: LinkId[] = ['lora', 'cellular']

export function StatusHud() {
  const temperature = useAppStore((state) => state.temperatureC)
  const lora = useAppStore((state) => selectLinkStatus(state, 'lora'))
  const cellular = useAppStore((state) => selectLinkStatus(state, 'cellular'))
  const status: Record<LinkId, LinkStatus> = { lora, cellular }
  const hot = temperature > thermal.maxC

  return (
    <>
      <header className="xo-hud">
        <p className="xo-kicker">{copy.brand}</p>
        <p className={`xo-temp${hot ? ' is-hot' : ''}`}>
          <span>{copy.tempLabel}</span>
          {temperature.toFixed(1)} °C
        </p>
      </header>
      <ul className="xo-links" aria-label="Collegamenti">
        {links.map((id) => (
          <li key={id} data-status={status[id]}>
            <span>{copy.links[id]}</span>
            {copy.linkState[status[id]]}
          </li>
        ))}
      </ul>
    </>
  )
}
