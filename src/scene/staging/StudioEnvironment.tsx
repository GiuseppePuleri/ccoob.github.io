import { Environment } from '@react-three/drei'

/** Rotazione dell'HDRI attorno all'asse verticale: porta le vetrate nei riflessi della scocca. */
const ROTATION: [number, number, number] = [0, Math.PI, 0]

/**
 * HDRI di magazzino: luce ambientale e riflessi sull'acciaio.
 * Lo sfondo è la stessa mappa, sfocata, così non resta un grigio piatto.
 * Il preset è servito dagli asset di drei (nessun file locale).
 */
export function StudioEnvironment() {
  return (
    <Environment
      preset="warehouse"
      background
      backgroundBlurriness={0.62}
      backgroundIntensity={0.22}
      environmentIntensity={0.55}
      backgroundRotation={ROTATION}
      environmentRotation={ROTATION}
    />
  )
}
