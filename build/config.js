
const production = process.env.NODE_ENV === 'production'
const currentDirectory = process.cwd()

exports.esbuild = {
  bundle: true,
  entryPoints: ['src/app.js'],
  nodePaths: ['src', 'src/modules'],
  sourcemap: true,
  write: false,
  define: {
    'process.env.APP_PROD': production,
    'process.env.FF_STATIC_RENDER': false
  }
}

exports.esbuild_static = {
  bundle: true,
  nodePaths: ['src', 'src/modules'],
  platform: 'node',
  write: false,
  define: {
    'process.env.APP_PROD': production,
    'process.env.FF_STATIC_RENDER': true
  }
}

exports.typescript = {
  compilerOptions: {
    allowJs: true,
    lib: ['DOM', 'ES2015'],
    target: 'ES5'
  }
}

exports.uglify = {
  toplevel: true,
  compress: {
    drop_console: true,
    passes: 3
  },
  mangle: {
    toplevel: true
  }
}

exports.sass = {
  includePaths: ['node_modules'],
  sourceMap: currentDirectory + '/src',
  sourceMapContents: true,
  sourceMapEmbed: true
}

exports.cleancss = {
  level: 2
}
