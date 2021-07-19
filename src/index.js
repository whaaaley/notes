
import { readFileSync } from 'fs'
import { html } from '@onclick/superstatic'

const { body, link, meta, noscript, script, style, title, div } = html

const styles = process.env.APP_PROD === true
  ? style(readFileSync('./public/main.css', 'utf8'))
  : link({ rel: 'stylesheet', href: '/main.css' })

const scripts = process.env.APP_PROD === true
  ? script(readFileSync('./public/app.js', 'utf8'))
  : script({ src: '/app.js', defer: true })

const PreloadFont = props => {
  return link({
    rel: 'preload',
    href: props.href,
    as: 'font',
    type: 'font/woff2',
    crossorigin: true
  })
}

const render = props => {
  return html.html({ lang: 'en' }, [
    meta({ charset: 'utf-8' }),
    title(props.title),
    meta({ name: 'author', content: props.author }),
    meta({ name: 'description', content: props.description }),
    meta({ name: 'viewport', content: props.viewport }),
    link({ rel: 'icon', href: '/cache/favicon.svg' }),
    PreloadFont({ href: '/fonts/Inter-3.18/Inter-roman.var.woff2' }),
    PreloadFont({ href: '/fonts/Inter-3.18/Inter-italic.var.woff2' }),
    PreloadFont({ href: '/fonts/SourceCodePro-1.018/SourceCodePro-roman.var.otf' }),
    PreloadFont({ href: '/fonts/SourceCodePro-1.018/SourceCodePro-italic.var.otf' }),
    styles,
    body([
      noscript('Please enable JavaScript and try again.'),
      div({ id: 'app' }),
      scripts
    ])
  ])
}

const options = {
  title: 'Onclick Notes',
  author: 'Dustin Dowell',
  description: '',
  viewport: 'width=device-width,maximum-scale=5'
}

process.stdout.write('<!DOCTYPE html>' + render(options))
