import { copy } from '../../content/it'
import { useAppStore } from '../../store/useAppStore'

const steps = ['email', 'sms', 'call'] as const

/** Scheda dell'escalation: stessi tre passi dello schermo dello smartphone, con la conferma. */
export function PhoneNotification() {
  const phase = useAppStore((state) => state.alarmPhase)
  const acknowledge = useAppStore((state) => state.acknowledgeAlarm)
  const current = steps.findIndex((step) => step === phase)
  if (current < 0) return null

  return (
    <aside className="xo-phone" aria-label={copy.escalationTitle}>
      <p className="xo-kicker">{copy.escalationTitle}</p>
      <ol className="xo-steps">
        {steps.map((step, index) => (
          <li
            key={step}
            data-state={index < current ? 'done' : index === current ? 'current' : 'next'}
            aria-current={index === current ? 'step' : undefined}
          >
            {copy.escalation[step].label}
          </li>
        ))}
      </ol>
      <p>{copy.escalation[steps[current]].body}</p>
      <button type="button" onClick={acknowledge}>
        {copy.confirm}
      </button>
    </aside>
  )
}
