
onmessage = async function (e) {
  const { msg, payload } = e.data

  if (msg == 'load') {
    self.importScripts('./opencv.js')
    self.cv = await cv()
    postMessage({msg})
  }
}