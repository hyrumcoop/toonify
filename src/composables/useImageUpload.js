const useImageUpload = () => {
  const uploadImage = function(e) {
    const image = e.target.files[0]
    const reader = new FileReader()

    reader.onload = evt => {
      this.loadUrl(evt.target.result)
    }

    reader.readAsDataURL(image)
  }

  // emits uploaded Image object as `upload` event
  const loadUrl = function(url) {
    const image = new Image
    image.crossOrigin = 'Anonymous'
    image.src = url

    image.onload = () => {
      this.$emit('upload', image)
    }
  }

  return {
    uploadImage,
    loadUrl
  }
}

export default useImageUpload