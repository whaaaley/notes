
import pako from 'pako'

const toBuffer = data => {
  const result = []

  for (let i = 0; i < data.length; i++) {
    result.push(data.charCodeAt(i))
  }

  return new Uint8Array(result)
}

export const zip = data => {
  data = pako.deflate(data) // String => Uint8Array
  data = String.fromCharCode.apply(null, data) // Uint8Array => String

  return window.btoa(data) // Uint8Array => base64
}

export const unzip = data => {
  data = window.atob(data) // base64 => String
  data = toBuffer(data) // String => Uint8Array
  data = pako.inflate(data) // Uint8Array => Uint8Array

  return String.fromCharCode.apply(null, data) // Uint8Array => String
}
