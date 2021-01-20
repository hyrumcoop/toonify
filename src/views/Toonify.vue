<template>
  <div class='d-flex flex-column vh-100'>
    <navbar />

    <image-viewer
      :image='currentImage'
      @upload='uploadImage'
    />

    <image-history
      :images='gallery'
      :selected='selectedImage'
      :generating='loadingGallery'
      @select='i => selectImage(i)'
    />
  </div>
</template>

<script>
import cv from '../services/cv.worker'

import useImageGallery from '@/composables/useImageGallery'
import useImageDataConverter from '@/composables/useImageDataConverter'

import Navbar from '@/components/Navbar'
import ImageViewer from '@/components/ImageViewer'
import ImageHistory from '@/components/ImageHistory'

export default {
  name: 'Toonify',
  components: {
    Navbar,
    ImageViewer,
    ImageHistory
  },
  setup() {
    return {
      ...useImageDataConverter(),
      ...useImageGallery()
    }
  },
  async mounted() {
    await cv.load()
    console.log('OpenCV loaded')
  },
  methods: {
    async uploadImage(img) {
      // clear gallery, push uploaded image, and run toonify filter
      this.clearGallery()

      this.pushImage({
        type: 'original', // TODO: gallery image type enums?
        url: img.src,
        tooltip: 'Original Image' // TODO: if using a gallery enum, this is redundant and is based on type
      })

      const imageData = this.toImageData(img)
      this.generateGallery(await cv.toonify(imageData))
    }
  }
}
</script>

<style scoped>

</style>