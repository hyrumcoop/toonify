
const toonify = async payload => {
  return payload // TODO: implement toonify algorithm
}

onmessage = async function (e) {
  const { msg, payload } = e.data

  if (msg == 'load') {
    self.importScripts('./opencv.js')
    self.cv = await cv()
    postMessage({msg})
  } else if (msg == 'toonify') {
    postMessage({msg: 'toonify', payload: await toonify(payload)})
  }
}