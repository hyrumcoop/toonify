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
  const toonifyEdges = (img, threshold) => {
    const blurred = new cv.Mat()
    const edges = new cv.Mat()
    const dilated = new cv.Mat()
  
    const structEl = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(2, 2)) // TODO: try different shapes
  
    cv.medianBlur(img, blurred, 7)
    cv.Canny(blurred, edges, 5, threshold)
    cv.dilate(edges, dilated, structEl)
  
    return dilated
  }
  
  // TODO: use generator
  const toonifyColors = (img, blur, quantization) => {
    let prevMat = img.clone()
    cv.cvtColor(prevMat, prevMat, cv.COLOR_BGRA2BGR)
  
    for (let i = 0; i < blur; i++) {
      const mat = new cv.Mat()
      cv.bilateralFilter(prevMat, mat, 9, 75, 75)
  
      prevMat = mat
    }
  
    const result = quantizeColors(prevMat, quantization)
  
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
    const img = cv.matFromImageData(payload.data)
    let { edges, blur, quantization } = payload.config || {edges: 440, blur: 14, quantization: 24}

    edges = 500 - edges // 500 is the max limit for our config; more edges means lower threshold

    const edgeImg = toonifyEdges(img, edges)
    yield {
      type: 'edges',
      data: _helpers.imageDataFromMat(edgeImg),
      tooltip: 'Toonify Edges',
      step: {
        text: 'TOONIFYING COLORS...',
        progress: 30
      }
    }

    const colorImg = toonifyColors(img, blur, quantization)
    yield {
      type: 'colors',
      data: _helpers.imageDataFromMat(colorImg),
      tooltip: 'Toonify Colors',
      step: {
        text: 'COMBINING EDGES WITH COLORS...',
        progress: 90
      }
    }

    const combined = toonifyCombine(edgeImg, colorImg)
    yield {
      type: 'combined',
      data: _helpers.imageDataFromMat(combined),
      tooltip: 'Combined Colors and Edges'
    }
  }

  return payload => proxy(toonifyFilter(payload)) // generators don't work without comlink proxy
}

export default toonify