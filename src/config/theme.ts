export const palette = {
  bg: '#07090d',
  steel: '#d5dbe2',
  steelDeep: '#8e99a6',
  rubber: '#16191e',
  plastic: '#e6e1d6',
  plasticCool: '#d7dee6',
  vial: '#d5efe6',
  oob: '#6ef3df',
  alarm: '#ff4d5e',
  amber: '#ffb15a',
  ledOn: '#3df08c',
  ink: '#e7edf2',
} as const

export type PaletteName = keyof typeof palette
