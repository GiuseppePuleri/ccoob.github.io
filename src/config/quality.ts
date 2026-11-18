import type { QualitySettings, QualityTier } from '../store/types'

export const qualitySettings: Record<QualityTier, QualitySettings> = {
  high: {
    dpr: [1, 2],
    multisampling: 4,
    bloom: true,
    depthOfField: true,
  },
  low: {
    dpr: [1, 1.25],
    multisampling: 0,
    bloom: true,
    depthOfField: false,
  },
}
