import { useCallback } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

export function useDeviceInteraction(id: DeviceId) {
  const selectDevice = useAppStore((state) => state.selectDevice)
  const hoverDevice = useAppStore((state) => state.hoverDevice)

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      const current = useAppStore.getState().selectedDevice
      selectDevice(current === id ? null : id)
    },
    [id, selectDevice],
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

  return { onClick, onPointerOver, onPointerOut }
}
