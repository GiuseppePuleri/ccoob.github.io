import { Environment, Lightformer } from '@react-three/drei'

/**
 * Studio virtuale, senza HDRI esterna.
 * Un metallo senza ambiente resta nero: queste luci sono il riflesso del frigo.
 * `frames={1}` calcola la mappa una volta sola.
 */
export function StudioEnvironment() {
  return (
    <Environment frames={1} resolution={256} environmentIntensity={1.05}>
      <Lightformer intensity={5} position={[1.4, 3.4, 2.6]} scale={[5, 2.2, 1]} color="#ffffff" />
      <Lightformer intensity={2.2} position={[-3.2, 2, 2.2]} scale={[2, 3, 1]} color="#d7ebff" />
      <Lightformer intensity={1.6} position={[3.4, 1.5, 1]} scale={[1.4, 2.8, 1]} color="#ffd8c4" />
    </Environment>
  )
}
