import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

function webpConvert(): Plugin {
  return {
    name: 'webp-convert',
    apply: 'build',
    async closeBundle() {
      const distAssets = path.resolve('dist/assets')

      let files: string[]
      try {
        files = await fs.readdir(distAssets)
      } catch {
        return
      }

      const imageFiles = files.filter(f => /\.(png|jpe?g)$/i.test(f))
      if (imageFiles.length === 0) return

      await Promise.all(
        imageFiles.map(async file => {
          const srcPath = path.join(distAssets, file)
          const webpName = file.replace(/\.(png|jpe?g)$/i, '.webp')
          const destPath = path.join(distAssets, webpName)

          await sharp(srcPath).webp({ quality: 80 }).toFile(destPath)
          await fs.unlink(srcPath)
        })
      )

      // JS/CSSファイル内の参照を .webp に書き換え
      const allFiles = await fs.readdir(distAssets)
      const textFiles = allFiles.filter(f => /\.(js|css)$/.test(f))

      await Promise.all(
        textFiles.map(async file => {
          const filePath = path.join(distAssets, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const updated = content.replace(/\.(png|jpe?g)(?=[^a-zA-Z]|$)/gi, '.webp')
          if (updated !== content) await fs.writeFile(filePath, updated)
        })
      )

      console.log(`✓ Converted ${imageFiles.length} images to WebP`)
    },
  }
}

export default defineConfig({
  plugins: [react(), webpConvert()],
  base: '/',
  test: {
    environment: 'node',
  },
})
