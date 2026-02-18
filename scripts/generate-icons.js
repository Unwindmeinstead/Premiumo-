// Generate P+ app icons (home screen / share) - tuned to fill iOS icon mask:
// green background, white P (big) and + (slightly bigger)
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const GREEN = '#16a34a' // Tailwind green-600

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
  <rect width="192" height="192" rx="24" fill="${GREEN}"/>
  <text x="92" y="110" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="88" font-weight="900" fill="#ffffff" text-anchor="end" dominant-baseline="middle">P</text>
  <text x="100" y="98" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff" text-anchor="start" dominant-baseline="middle">+</text>
</svg>`

  // iOS prefers 180x180 apple-touch-icon for Add to Home Screen
  const svg180 = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="22" fill="${GREEN}"/>
  <text x="86" y="103" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="end" dominant-baseline="middle">P</text>
  <text x="94" y="92" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="start" dominant-baseline="middle">+</text>
</svg>`

  const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="${GREEN}"/>
  <text x="246" y="292" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="236" font-weight="900" fill="#ffffff" text-anchor="end" dominant-baseline="middle">P</text>
  <text x="266" y="260" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="92" font-weight="700" fill="#ffffff" text-anchor="start" dominant-baseline="middle">+</text>
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

  console.log('Generated public/icon-192.png, public/icon-512.png, and public/apple-touch-icon.png (iOS-tuned P+ logo)')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
