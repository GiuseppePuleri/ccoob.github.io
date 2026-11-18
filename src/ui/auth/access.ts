const STORAGE_KEY = 'ccoob-access'

export function isAccessGranted(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function grantAccess(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // sessionStorage può essere bloccato: la sessione resta solo in memoria.
  }
}

export function checkAccessPassword(value: string): boolean {
  const expected = import.meta.env.VITE_ACCESS_PASSWORD
  if (typeof expected !== 'string' || expected.length === 0) return false
  return value === expected
}
