<template>
  <div class='image-viewer flex-grow-1'>
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
          data-bs-toggle='modal'
          data-bs-target='#urlModal'
        >
          LOAD URL
        </button>
      </div>

      <div class='modal fade' id='urlModal' ref='modal'>
        <div class='modal-dialog modal-dialog-centered'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>Load Image by URL</h5>
              <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div class='modal-body'>
              <form>
                <div>
                  <label for='image-url' class='col-form-label'>Image URL</label>
                  <input type='text' class='form-control' id='image-url' v-model='urlInput'>
                  <p class='text-danger mt-2 mb-0'>{{ error }}</p>
                </div>
              </form>
            </div>
            <div class='modal-footer'>
              <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button type='button' class='btn btn-primary' @click='modalUpload'>Upload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'ImageViewer',
  props: ['image'],
  data() {
    return {
      urlInput: '',
      error: null
    }
  },
  methods: {
    // emits uploaded Image object as `upload` event
    uploadImage(e) {
      const image = e.target.files[0]
      const reader = new FileReader()

      reader.onload = evt => {
        this.loadUrl(evt.target.result)
      }

      reader.readAsDataURL(image)
    },

    modalUpload() {
      try {
        new URL(this.urlInput)
      } catch(e) {
        this.error = 'Invalid URL.'
        return
      }

      $(this.$refs.modal).modal('hide')
      this.error = null
      this.loadUrl(this.urlInput)
    },

    loadUrl(url) {
      const image = new Image
      image.crossOrigin = 'Anonymous'
      image.src = url

      image.onload = () => {
        this.$emit('upload', image)
      }
    }
  },
  computed: {
    imageUrl() {
      return this.image && this.image.url
    }
  }
}
</script>

<style scoped>

.image-viewer {
  height: 20px; /* TODO: children overflow this component if no height is set, even though height is overridden by flex-grow */
}

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