// Generate P+ app icons - matches sidebar logo: green background, white P (big) and + (small)
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
  <text x="78" y="122" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="68" font-weight="800" fill="#ffffff" text-anchor="middle">P</text>
  <text x="118" y="118" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="24" font-weight="600" fill="#ffffff" text-anchor="middle">+</text>
</svg>`
  const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="${GREEN}"/>
  <text x="208" y="324" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="182" font-weight="800" fill="#ffffff" text-anchor="middle">P</text>
  <text x="314" y="314" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="64" font-weight="600" fill="#ffffff" text-anchor="middle">+</text>
</svg>`

  await sharp(Buffer.from(svg512))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
  await sharp(Buffer.from(svg192))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
  console.log('Generated public/icon-192.png and public/icon-512.png (green P+ logo, matches sidebar)')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
