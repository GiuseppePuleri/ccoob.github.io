import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { UnsignedByteType } from 'three'

/**
 * Buffer a 8 bit e senza MSAA sul composer: i target a 16 bit
 * e il multisampling del pass lasciano il fotogramma nero su diversi WebGL.
 * Il bloom resta selettivo perché solo onde, LED e schermo arrivano al bianco.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0} frameBufferType={UnsignedByteType} enableNormalPass={false}>
      <Bloom intensity={0.42} luminanceThreshold={0.96} luminanceSmoothing={0.04} mipmapBlur radius={0.45} />
    </EffectComposer>
  )
}
