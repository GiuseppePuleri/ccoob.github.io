import { loraPath } from '../../config/devices'
import { PulseRings } from './PulseRings'
import { oobSignalColor } from './signalColor'

/**
 * Onde LoRa: partono dal sensore, escono dalla porta e si dissolvono sull'antenna del gateway.
 * È l'unica trasmissione animata della scena.
 */
export function LoraWaves() {
  return <PulseRings points={loraPath} colorOf={oobSignalColor} />
}
