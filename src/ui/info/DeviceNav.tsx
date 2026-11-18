import { copy, deviceCopy } from '../../content/it'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

const order: DeviceId[] = ['fridge', 'sensor', 'gateway', 'router', 'smartphone']

export function DeviceNav() {
  const selected = useAppStore((state) => state.selectedDevice)
  const selectDevice = useAppStore((state) => state.selectDevice)

  return (
    <nav className="xo-devices" aria-label={copy.devicesNav}>
      {order.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={selected === id}
          onClick={() => selectDevice(selected === id ? null : id)}
        >
          {deviceCopy[id].title}
        </button>
      ))}
    </nav>
  )
}
