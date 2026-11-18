import { signalPaths } from '../../config/devices'
import { palette } from '../../config/theme'
import { selectLinkStatus } from '../../store/selectors'
import type { LinkId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'
import { WaveRibbon } from '../materials/waveMaterial'

interface SignalLinkProps {
  id: Extract<LinkId, 'wifi' | 'cellular'>
}

/**
 * Wi-Fi: il nastro si dissolve prima del frigo.
 * Cellulare: stesso canale visivo del backup, dal gateway allo smartphone.
 */
export function SignalLink({ id }: SignalLinkProps) {
  const points = id === 'wifi' ? signalPaths.wifi : signalPaths.cellular

  return (
    <WaveRibbon
      points={points}
      radius={id === 'wifi' ? 0.009 : 0.008}
      endFade={id === 'wifi' ? 0.55 : 0.9}
      speed={id === 'wifi' ? 0.65 : 1.05}
      intensity={id === 'wifi' ? 1.7 : 2.3}
      colorOf={() => {
        if (id === 'wifi') return palette.wifi
        const phase = useAppStore.getState().alarmPhase
        if (phase === 'sms' || phase === 'call') return palette.alarm
        if (phase === 'drifting') return palette.amber
        return palette.oob
      }}
      visibleOf={() => selectLinkStatus(useAppStore.getState(), id) !== 'down'}
    />
  )
}
