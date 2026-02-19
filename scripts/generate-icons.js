// Add-to-home icon: white background, giant dark green P
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const DARK_GREEN = '#166534' // dark green

async function generate() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.log('Run: npm install --save-dev sharp')
    process.exit(1)
  }

  // Rounded square, bold italic P, smaller + at lower right (like reference logo)
  const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="42" ry="42" fill="#ffffff"/>
  <text x="78" y="118" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="118" font-weight="900" font-style="italic" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">P</text>
  <text x="138" y="132" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="48" font-weight="800" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">+</text>
</svg>`

  const svg180 = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="40" ry="40" fill="#ffffff"/>
  <text x="72" y="110" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="110" font-weight="900" font-style="italic" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">P</text>
  <text x="128" y="123" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="44" font-weight="800" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">+</text>
</svg>`

  const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="110" ry="110" fill="#ffffff"/>
  <text x="208" y="308" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="316" font-weight="900" font-style="italic" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">P</text>
  <text x="368" y="352" font-family="system-ui, -apple-system, Arial, sans-serif" font-size="128" font-weight="800" fill="${DARK_GREEN}" text-anchor="middle" dominant-baseline="middle">+</text>
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

  console.log('Generated icons: P+ logo (rounded square, italic P, + lower right), dark green on white')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
