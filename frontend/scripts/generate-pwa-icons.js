const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/Base.jpg');
const outputDir = path.join(__dirname, '../public');

async function resizeImage(size) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    try {
        await sharp(sourceImage)
            .resize(size, size)
            .toFile(outputPath);
        console.log(`Created ${outputPath}`);
    } catch (err) {
        console.error(`Error creating ${size}x${size} icon:`, err);
    }
}

async function main() {
    if (!fs.existsSync(sourceImage)) {
        console.error('Source image not found:', sourceImage);
        return;
    }

    await resizeImage(192);
    await resizeImage(512);
}

main();
