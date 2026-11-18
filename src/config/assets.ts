/** URL sotto `public/`, con il `base` di GitHub Pages già applicato. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
