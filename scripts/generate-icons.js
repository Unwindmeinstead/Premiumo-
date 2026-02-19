// Add-to-home icon: white background, giant dark green P
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const BLACK = '#000000'

async function generate() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.log('Run: npm install --save-dev sharp')
    process.exit(1)
  }

  // White background, black P filling the entire icon surface (max size)
  const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#ffffff"/>
  <text x="96" y="96" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="185" font-weight="800" fill="${BLACK}" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`

  const svg180 = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#ffffff"/>
  <text x="90" y="90" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="172" font-weight="800" fill="${BLACK}" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`

  const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#ffffff"/>
  <text x="256" y="256" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="495" font-weight="800" fill="${BLACK}" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`

  await sharp(Buffer.from(svg512))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
  await sharp(Buffer.from(svg192))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
  await sharp(Buffer.from(svg180))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  console.log('Generated icons: black P full-size on white')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
