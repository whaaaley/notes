
/**
 * Ensure that gtm.js never affects load time performance.
 * @function gtm
 */

export const gtm = data => {
  if (PROD === true) {
    window.addEventListener('load', () => {
      const script = document.createElement('script')

      script.async = true
      script.defer = true

      script.id = 'gtm'
      script.src = 'https://googletagmanager.com/gtm.js?id=' + data.id

      document.body.appendChild(script)
    })
  }
}
