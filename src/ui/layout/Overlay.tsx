import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { StatusHud } from '../hud/StatusHud'
import { DeviceNav } from '../info/DeviceNav'
import { PhoneNotification } from '../phone/PhoneNotification'
import { ScenarioPanel } from '../scenario/ScenarioPanel'

export function Overlay() {
  const liveMessage = useAppStore((state) => state.liveMessage)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') useAppStore.getState().selectDevice(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="xo-overlay">
        <StatusHud />
        <DeviceNav />
        <PhoneNotification />
        <ScenarioPanel />
      </div>
      <p className="xo-live" aria-live="assertive">
        {liveMessage}
      </p>
    </>
  )
}
