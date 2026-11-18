/**
 * Comprime i GLB grezzi di assets-src/ in public/models/.
 * Draco agisce sulla geometria. Senza file in ingresso non fa nulla.
 */
import { spawn } from 'node:child_process'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'assets-src')
const targetDir = path.join(root, 'public', 'models')

await mkdir(sourceDir, { recursive: true })
await mkdir(targetDir, { recursive: true })

const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.glb') || file.endsWith('.gltf'))

if (files.length === 0) {
  console.log('Nessun modello in assets-src/. Esporta i .glb da Blender e rilancia npm run optimize.')
  process.exit(0)
}

for (const file of files) {
  const input = path.join(sourceDir, file)
  const output = path.join(targetDir, file.replace(/\.gltf$/, '.glb'))
  await new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['--yes', '@gltf-transform/cli', 'optimize', input, output, '--compress', 'draco'],
      { stdio: 'inherit' },
    )
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`optimize ${file} uscito con ${code}`))))
  })
}
