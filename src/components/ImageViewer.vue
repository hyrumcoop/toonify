<template>
  <div class='image-viewer flex-grow-1'>
    <div class='image-container' ref='imageContainer' v-if='!!image'>
      <img
        class='image'
        :src='imageSrc'
      />
    </div>

    <div class='upload-container' v-if='!image'>
      <input type='file' accept='image/png, image/jpeg' ref='uploadInput' @change='uploadImage' />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    image: Image
  },
  methods: {
    // emits uploaded Image object as `upload` event
    uploadImage(e) {
      const image = e.target.files[0]
      const reader = new FileReader()

      reader.onload = evt => {
        const img = new Image

        img.onload = () => {
          this.$emit('upload', img)
        }

        img.src = evt.target.result
      }

      reader.readAsDataURL(image)
    }
  },
  computed: {
    imageSrc() {
      return this.image && this.image.src
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

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>