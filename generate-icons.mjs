import sharp from 'sharp'
import { mkdirSync } from 'fs'

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="102" fill="#09090b"/>
  <circle cx="256" cy="256" r="180" fill="#7c3aed"/>
  <polyline points="160,256 220,320 352,192" 
    stroke="white" stroke-width="40" 
    stroke-linecap="round" stroke-linejoin="round" 
    fill="none"/>
</svg>`

const buf = Buffer.from(svg)

await sharp(buf).resize(192).png().toFile('public/pwa-192x192.png')
await sharp(buf).resize(512).png().toFile('public/pwa-512x512.png')
await sharp(buf).resize(180).png().toFile('public/apple-touch-icon.png')
await sharp(buf).resize(32).png().toFile('public/favicon.png')

console.log('Icons generated!')