<template>
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
          <button type='button' class='btn btn-primary' @click='uploadImage'>Upload</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'ImageUrlModal',
  data() {
    return {
      urlInput: '',
      error: null
    }
  },
  methods: {
    uploadImage() {
      try {
        new URL(this.urlInput)
      } catch(e) {
        this.error = 'Invalid URL.'
        return
      }

      this.error = null
      this.hide()
      this.$emit('upload', this.urlInput)
    },
    
    show() {
      $(this.$refs.modal).modal('show')
    },

    hide() {
      $(this.$refs.modal).modal('hide')
    }
  }
}
</script>

<style scoped>

</style>