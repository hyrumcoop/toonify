<template>
  <div>
    <h1>Toonify</h1>
    <input type='file' accept='image/png, image/jpeg' ref='uploadInput' @change='uploadImage' />

    <br>

    <img :src='uploadImageUrl' height='300' />
    <img :src='resultImageUrl' height='450' />
    <canvas ref='uploadCanvas' class='hiddenCanvas' />
    <canvas ref='resultCanvas' class='hiddenCanvas' />
  </div>
</template>

<script>
import cv from '../services/cv.worker'

export default {
  name: 'Toonify',
  data() {
    return {
      uploadImageUrl: '',
      uploadImageData: null,

      resultImageUrl: '',
      resultImageData: null
    }
  },
  async mounted() {
    await cv.load()
    console.log('OpenCV loaded')
  },
  methods: {
    uploadImage(e) {
      const image = e.target.files[0]
      const reader = new FileReader()

      reader.onload = evt => {
        const img = new Image

        img.onload = () => {
          this.uploadImageData = this.getImageData(img)
          this.toonify()
        }

        this.uploadImageUrl = evt.target.result
        img.src = evt.target.result
      }

      reader.readAsDataURL(image)
    },

    async toonify() {
      const result = await cv.toonify(this.uploadImageData)

      const first = await result.next()
      console.log(first)
      const second = await result.next()
      console.log(second)
      const third = await result.next()
      console.log(third)

      this.resultImageData = third.value
      this.resultImageUrl = this.getImageDataUrl(this.resultImageData)
    },

    getImageData(img) {
      const canvas = this.$refs.uploadCanvas
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      return ctx.getImageData(0, 0, img.width, img.height)
    },

    getImageDataUrl(imageData) {
      const canvas = this.$refs.resultCanvas
      canvas.width = imageData.width
      canvas.height = imageData.height

      const ctx = canvas.getContext('2d')
      ctx.putImageData(imageData, 0, 0)

      return canvas.toDataURL('image/jpeg')
    }
  }
}
</script>

<style scoped>

.hiddenCanvas {
  display: none;
}

</style>