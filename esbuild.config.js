// const { sassPlugin } = require('esbuild-sass-plugin'); // Optional, only if SCSS is needed.

const runtimeDir = process.env.XDG_RUNTIME_DIR;

require('esbuild').build({
    entryPoints: ['app.ts'],           // Entry TypeScript file.
    outfile: runtimeDir + '/shell-v2-bundle.js',              // Output JavaScript file name.
    bundle: true,                     // Enable bundling.
    format: 'esm',                    // ES Module format for Gjs compatibility.
    platform: 'neutral',              // Required for Gjs.
    target: ['es2022'],               // Target modern ECMAScript version.
    sourcemap: 'inline',              // Include inline source maps for debugging.
    loader: {
        //'.css': 'text',               // Inline CSS as text.
        //'.scss': 'text',              // Inline SCSS as text (requires sassPlugin).
        //'.blp': 'text',               // Inline `.blp` files as text (custom handling).

        // '.js': 'default', // GitHubBot says this might be useful
    },
    external: [
        'console',                    // Externalize Gjs-specific modules.
        'system',
        'cairo',
        'gettext',
        'file://*',
        'gi://*',
        'resource://*',
    ],
    plugins: [
        //sassPlugin()                  // Optional, for SCSS support.
        // Add additional plugins for custom loaders if needed.
    ],
    define: {
        SRC: JSON.stringify('./'),    // Define global constants.
    },
    absWorkingDir: process.cwd(),     // Set the working directory.
    mainFields: ['main', 'module']
}).catch(() => process.exit(1));