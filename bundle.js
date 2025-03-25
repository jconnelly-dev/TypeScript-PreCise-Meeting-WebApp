const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['frontend/main.ts'],
    bundle: true,
    minify: true,
    outfile: 'wwwroot/dist/main.min.js',
    format: 'esm',
    sourcemap: false,
    target: ['es6']
}).catch((e) => {
    console.error("❌ esbuild failed:", e);
    process.exit(1);
});