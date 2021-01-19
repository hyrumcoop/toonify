import { proxy } from 'comlink'
import helpers from './helpers'

const toonify = cv => { // TODO: research dependency injection?
  const _helpers = new helpers(cv)

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
  
  // TODO: use generator
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
  
  // TODO: use generator
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
  
  // the actual toonify function that is returned
  const toonifyFilter = function* (payload) {
    const img = cv.matFromImageData(payload)

    const edgeImg = toonifyEdges(img)
    yield _helpers.imageDataFromMat(edgeImg)

    const colorImg = toonifyColors(img)
    yield _helpers.imageDataFromMat(colorImg)

    const combined = toonifyCombine(edgeImg, colorImg)
    yield _helpers.imageDataFromMat(combined)
  }

  return payload => proxy(toonifyFilter(payload)) // generators don't work without comlink proxy
}

export default toonify