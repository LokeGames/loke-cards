#!/usr/bin/env node
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const iconDir = join(__dirname, '..', 'public', 'icons');
const svgPath = join(iconDir, 'icon.svg');

// Ensure icons directory exists
mkdirSync(iconDir, { recursive: true });

// Read SVG
const svg = readFileSync(svgPath);

// Generate PNG icons
for (const size of sizes) {
  const outputPath = join(iconDir, `icon-${size}.png`);

  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`✓ Generated ${size}x${size} icon`);
}

console.log('✓ All PWA icons generated successfully!');
