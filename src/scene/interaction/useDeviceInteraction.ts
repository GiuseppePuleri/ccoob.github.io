import { useCallback, useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { presetFor } from '../../config/devices'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

/**
 * A frigo aperto la lamiera è trasparente e il sensore si vede attraverso:
 * il clic deve arrivare al sensore, non fermarsi sulla parete che gli sta davanti.
 */
function aimsAtSensorInside(event: ThreeEvent<MouseEvent>): boolean {
  const { selectedDevice } = useAppStore.getState()
  if (selectedDevice !== 'fridge' && selectedDevice !== 'sensor') return false
  return event.intersections.some((hit) => hit.eventObject.userData.device === 'sensor')
}

export function useDeviceInteraction(id: DeviceId) {
  const selectDevice = useAppStore((state) => state.selectDevice)
  const hoverDevice = useAppStore((state) => state.hoverDevice)
  const moveCamera = useAppStore((state) => state.moveCamera)
  const userData = useMemo(() => ({ device: id }), [id])

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (id === 'fridge' && aimsAtSensorInside(event)) return
      event.stopPropagation()
      const current = useAppStore.getState().selectedDevice
      if (current === id) {
        selectDevice(null)
        return
      }
      const preset = presetFor(id)
      selectDevice(id)
      moveCamera(preset.position, preset.target)
    },
    [id, moveCamera, selectDevice],
  )

  const onPointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      hoverDevice(id)
      document.body.style.cursor = 'pointer'
    },
    [id, hoverDevice],
  )

  const onPointerOut = useCallback(() => {
    if (useAppStore.getState().hoveredDevice === id) hoverDevice(null)
    document.body.style.cursor = ''
  }, [id, hoverDevice])

  return { userData, onClick, onPointerOver, onPointerOut }
}
