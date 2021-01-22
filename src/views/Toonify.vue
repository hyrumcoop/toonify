<template>
  <div class='d-flex flex-column vh-100'>
    <navbar />

    <div class='d-flex flex-grow-1 flex-row' style='height: 10px'>
      <image-viewer
        class='flex-grow-1'
        :image='currentImage'
        @upload='uploadImage'
      />

      <filter-config
        :running='loadingGallery'
        v-model='filterConfig'
        v-if='!!currentImage'
        @upload='uploadImage'
        @start='startFilter'
        @stop='stopGenerating'
      />
    </div>

    <loading-bar
      v-if='loadingGallery'
      :text='stepText'
      :progress='stepProgress'
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
import FilterConfig from '@/components/FilterConfig'
import LoadingBar from '@/components/LoadingBar'
import ImageHistory from '@/components/ImageHistory'

export default {
  name: 'Toonify',
  components: {
    Navbar,
    ImageViewer,
    FilterConfig,
    LoadingBar,
    ImageHistory
  },
  setup() {
    return {
      ...useImageDataConverter(),
      ...useImageGallery()
    }
  },
  data() {
    return {
      filterConfig: {
        edges: 440,
        blur: 14,
        quantization: 24
      },
      firstStart: true,
      uploadedImage: null,
      uploadedImageData: null
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

      this.uploadedImage = img
      this.uploadedImageData = this.toImageData(img)
      
      if (this.firstStart) {
        this.firstStart = false
        this.startFilter()
      }
    },

    async startFilter() {
      if (this.loadingGallery) return

      this.clearGallery()

      this.pushImage({
        type: 'original', // TODO: gallery image type enums?
        url: this.uploadedImage.src,
        tooltip: 'Original Image' // TODO: if using a gallery enum, this is redundant and is based on type
      })

      const config = Object.assign({}, this.filterConfig) // convert Proxy to object
      const payload = {data: this.uploadedImageData, config}
      await this.generateGallery(await cv.toonify(payload))
    }
  }
}
</script>

<style scoped>

</style>