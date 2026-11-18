import { copy } from '../../content/it'

export function WebglFallback() {
  return (
    <div className="xo-fallback">
      <p className="xo-kicker">{copy.brand}</p>
      <h1>{copy.fallbackTitle}</h1>
      <p>{copy.fallbackBody}</p>
    </div>
  )
}
