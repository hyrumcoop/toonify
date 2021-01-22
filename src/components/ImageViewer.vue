<template>
  <div class='image-viewer h-100'>
    <div class='image-container' ref='imageContainer' v-if='!!image'>
      <div class='image-inner-container'>
        <img
          class='image'
          :src='imageUrl'
          crossOrigin='Anonymous'
        />

        <div class='image-overlay'>
          <a class='btn btn-light btn-lg' :href='imageUrl' download>
            <i class="bi bi-file-earmark-arrow-down-fill"></i>
          </a>
        </div>
      </div>
    </div>

    <div class='upload-container d-flex' v-if='!image'>
      <input
        class='d-none'
        type='file'
        accept='image/png, image/jpeg'
        ref='uploadInput'
        @change='uploadImage'
      />

      <div class='upload-options shadow rounded'>
        <button
          class='d-block w-100 btn btn-primary font-monospace fw-bold'
          @click='$refs.uploadInput.click()'
        >UPLOAD IMAGE</button>

        <div class='btn-divider font-monospace'><span>OR</span></div>

        <button
          class='d-block w-100 btn btn-secondary font-monospace fw-bold'
          @click='$refs.modal.show()'
        >
          LOAD URL
        </button>
      </div>
    </div>

    <image-url-modal ref='modal' @upload='loadUrl($event)' />
  </div>
</template>

<script>
import useImageUpload from '@/composables/useImageUpload'
import ImageUrlModal from './ImageUrlModal'

export default {
  name: 'ImageViewer',
  components: {
    ImageUrlModal
  },
  props: ['image'],
  setup() {
    return useImageUpload()
  },
  computed: {
    imageUrl() {
      return this.image && this.image.url
    }
  }
}
</script>

<style scoped>

.image-container {
  height: 100%;
  padding: 30px;
}

.image-inner-container {
  display: flex;

  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;

  cursor: pointer;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;

  transition: filter 0.4s ease;
}

.image-inner-container:hover .image {
  filter: brightness(0.5);
}

.image-overlay {
  position: fixed;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.image-inner-container:hover .image-overlay {
  opacity: 1;
}

.upload-container {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  background-color:#eee;
}

.upload-options {
  width: 300px;
  padding: 20px 20px;
  background-color: white;
}

.btn-divider {
  width: 100%; 
  text-align: center;
  border-bottom: 1px solid #212121;
  color: #212121;
  line-height: 0.1em;
  margin: 20px 0px;
  opacity: 0.4
} 

.btn-divider span { 
  background:#fff; 
  padding:0 10px; 
}

</style>