const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['scripts/Main.ts'],
    bundle: true,
    minify: true,
    outfile: 'wwwroot/dist/Main.min.js',
    format: 'esm',
    sourcemap: false,
    target: ['es2015'],
}).catch(() => process.exit(1));
