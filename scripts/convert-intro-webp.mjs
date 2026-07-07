import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const introDir   = join(__dirname, '..', 'public', 'intro');

const jpgFiles = readdirSync(introDir).filter(
  (f) => extname(f).toLowerCase() === '.jpg'
);

if (jpgFiles.length === 0) {
  console.log('No .jpg files found in public/intro — nothing to convert.');
  process.exit(0);
}

for (const file of jpgFiles) {
  const src  = join(introDir, file);
  const dest = join(introDir, basename(file, '.jpg') + '.webp');
  await sharp(src).webp({ quality: 80 }).toFile(dest);
  console.log(`Converted: ${file} → ${basename(dest)}`);
}

console.log(`Done. Converted ${jpgFiles.length} file(s).`);
