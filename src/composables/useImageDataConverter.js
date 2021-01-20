const useImageDataConverter = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const toImageData = function(img) {
    const { width, height } = img

    canvas.width = width
    canvas.height = height

    ctx.drawImage(img, 0, 0)
    return ctx.getImageData(0, 0, img.width, img.height)
  }

  const toDataUrl = function(imageData) {
    const { width, height } = imageData

    canvas.width = width
    canvas.height = height

    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL('image/jpeg')
  }

  return {
    toImageData,
    toDataUrl
  }
}

export default useImageDataConverter