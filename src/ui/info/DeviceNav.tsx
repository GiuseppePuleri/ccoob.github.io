import { presetFor } from '../../config/devices'
import { copy, deviceCopy } from '../../content/it'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

const order: DeviceId[] = ['fridge', 'sensor', 'gateway', 'smartphone']

export function DeviceNav() {
  const selected = useAppStore((state) => state.selectedDevice)
  const selectDevice = useAppStore((state) => state.selectDevice)
  const moveCamera = useAppStore((state) => state.moveCamera)

  const choose = (id: DeviceId): void => {
    if (selected === id) {
      selectDevice(null)
      return
    }
    const preset = presetFor(id)
    selectDevice(id)
    moveCamera(preset.position, preset.target)
  }

  return (
    <nav className="xo-devices" aria-label={copy.devicesNav}>
      {order.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={selected === id}
          onClick={() => choose(id)}
        >
          {deviceCopy[id].title}
        </button>
      ))}
    </nav>
  )
}
