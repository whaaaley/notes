
const production = process.env.NODE_ENV === 'production'

module.exports = {
  esbuild: {
    js: {
      bundle: true,
      write: false,
      define: {
        PROD: production,
        STATIC: false
      }
    },
    html: {
      bundle: true,
      platform: 'node',
      write: false,
      define: {
        PROD: production,
        STATIC: true
      }
    }
  },
  typescript: {
    compilerOptions: {
      allowJs: true,
      lib: ['DOM', 'ES2015'],
      target: 'ES5'
    }
  },
  uglify: {
    toplevel: true,
    compress: {
      drop_console: true,
      passes: 3
    },
    mangle: {
      toplevel: true
    }
  },
  sass: {
    includePaths: ['node_modules']
  },
  cleancss: {
    level: 2
  }
}
