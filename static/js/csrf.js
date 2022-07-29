window.onload = function () {
  const cookies = cookieParser(document.cookie)
  if (!cookies['CSRF-TOKEN'] && this.$nuxt) {
    this.$nuxt.$axios.$get('/')
  }
}

function cookieParser (cookies) {
  return cookies.split(';').map(function (c) {
    return c.trim().split('=').map(decodeURIComponent)
  }).reduce(function (a, b) {
    try {
      a[b[0]] = JSON.parse(b[1])
    } catch (e) {
      a[b[0]] = b[1]
    }
    return a
  }, {})
}
