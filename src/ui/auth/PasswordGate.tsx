import { useState, type FormEvent } from 'react'
import { copy } from '../../content/it'
import { checkAccessPassword, grantAccess } from './access'

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checkAccessPassword(password)) {
      setError(true)
      return
    }
    grantAccess()
    setError(false)
    onUnlock()
  }

  return (
    <div className="xo-gate" role="dialog" aria-modal="true" aria-labelledby="xo-gate-title">
      <form className="xo-gate-panel" onSubmit={handleSubmit}>
        <p className="xo-kicker">{copy.brand}</p>
        <h1 id="xo-gate-title">{copy.gate.title}</h1>
        <p className="xo-gate-lead">{copy.gate.lead}</p>
        <label className="xo-gate-field" htmlFor="xo-gate-password">
          <span>{copy.gate.passwordLabel}</span>
          <input
            id="xo-gate-password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (error) setError(false)
            }}
            aria-invalid={error}
            aria-describedby={error ? 'xo-gate-error' : undefined}
          />
        </label>
        {error ? (
          <p id="xo-gate-error" className="xo-gate-error" role="alert">
            {copy.gate.error}
          </p>
        ) : null}
        <button type="submit">{copy.gate.submit}</button>
      </form>
    </div>
  )
}
