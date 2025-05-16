const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['frontend/main.ts'],
    outfile: 'wwwroot/dist/main.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    target: ['es6']
}).catch((e) => {
    console.error("❌ esbuild failed:", e);
    process.exit(1);
});