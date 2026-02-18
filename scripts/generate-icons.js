// Generate P+ app icons (white card, black text) - matches sidebar P+ button
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

async function generate() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.log('Run: npm install --save-dev sharp')
    console.log('Then run this script again to generate icon-192.png and icon-512.png')
    process.exit(1)
  }

  const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="24" fill="#ffffff"/>
  <text x="96" y="118" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="#000000" text-anchor="middle">P+</text>
</svg>`
  const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#ffffff"/>
  <text x="256" y="318" font-family="Arial,sans-serif" font-size="192" font-weight="bold" fill="#000000" text-anchor="middle">P+</text>
</svg>`

  await sharp(Buffer.from(svg512))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
  await sharp(Buffer.from(svg192))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
  console.log('Generated public/icon-192.png and public/icon-512.png (white card, black P+)')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
