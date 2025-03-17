const fs = require('fs');
const terser = require('terser');
const path = require('path');

// Define the directory where your TypeScript output files are stored.
const outputDir = path.resolve(__dirname, 'wwwroot/dist'); // or wherever your JS is built

// Function to minify the JS files.
const minifyJS = async () => {
    const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.js'));

    for (const file of files) {
        const filePath = path.join(outputDir, file);
        const code = fs.readFileSync(filePath, 'utf-8');

        const result = await terser.minify(code);

        if (result.error) {
            console.error('Minification failed for:', file);
            console.error(result.error);
        } else {
            fs.writeFileSync(filePath.replace('.js', '.min.js'), result.code);
            console.log(`Minified: ${file}`);
        }
    }
};

minifyJS().catch(console.error);