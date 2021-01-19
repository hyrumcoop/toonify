const quantizeValue = (val, a) => {
  return Math.floor(val / a) * a
}

const quantizeColors = (img, a) => {
  const result = img.clone()
  const { rows, cols } = result

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pixel = result.ucharPtr(y, x)

      pixel[0] = quantizeValue(pixel[0], a)
      pixel[1] = quantizeValue(pixel[1], a)
      pixel[2] = quantizeValue(pixel[2], a)
    }
  }

  return result
}

const toonifyEdges = img => {
  const blurred = new cv.Mat()
  const edges = new cv.Mat()
  const dilated = new cv.Mat()

  const structEl = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(2, 2)) // TODO: try different shapes

  cv.medianBlur(img, blurred, 7)
  cv.Canny(blurred, edges, 5, 60)
  cv.dilate(edges, dilated, structEl)

  return dilated
}

const toonifyColors = img => {
  let prevMat = img.clone()
  cv.cvtColor(prevMat, prevMat, cv.COLOR_BGRA2BGR)

  for (let i = 0; i < 14; i++) {
    const mat = new cv.Mat()
    cv.bilateralFilter(prevMat, mat, 9, 75, 75)

    prevMat = mat
  }

  const result = quantizeColors(prevMat, 24)

  return result
}

const toonifyCombine = (edgeImg, colorImg, borderColor = [0, 0, 0]) => {
  const result = colorImg.clone()
  const { rows, cols } = result

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const edgePix = edgeImg.ucharPtr(y, x)

      if (edgePix[0] > 0 || edgePix[1] > 0 || edgePix[2] > 0) {
        const colorPix = result.ucharPtr(y, x)

        colorPix[0] = borderColor[0]
        colorPix[1] = borderColor[1]
        colorPix[2] = borderColor[2]
      }
    }
  }

  return result
}

const toonify = async payload => {
  const img = cv.matFromImageData(payload)

  const edgeImg = toonifyEdges(img)
  const colorImg = toonifyColors(img)
  const combined = toonifyCombine(edgeImg, colorImg)

  return imageDataFromMat(combined)
}

const imageDataFromMat = mat => {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat()
  const depth = mat.type() % 8
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
  mat.convertTo(img, cv.CV_8U, scale, shift)

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
      break
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
      break
    case cv.CV_8UC4:
      break
    default:
      throw new Error(
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
      )
  }

  const clampedArray = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  )

  img.delete()
  return clampedArray
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