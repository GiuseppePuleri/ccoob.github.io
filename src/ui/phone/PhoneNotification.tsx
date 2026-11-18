import { copy } from '../../content/it'
import { useAppStore } from '../../store/useAppStore'

export function PhoneNotification() {
  const phase = useAppStore((state) => state.alarmPhase)
  const acknowledge = useAppStore((state) => state.acknowledgeAlarm)
  const visible = phase === 'sms' || phase === 'call'
  if (!visible) return null

  return (
    <aside className="xo-phone" aria-label={phase === 'call' ? copy.callTitle : copy.smsTitle}>
      <p className="xo-kicker">{phase === 'call' ? copy.callTitle : copy.smsTitle}</p>
      <p>{phase === 'call' ? copy.callBody : copy.smsBody}</p>
      <button type="button" onClick={acknowledge}>
        {copy.confirm}
      </button>
    </aside>
  )
}
