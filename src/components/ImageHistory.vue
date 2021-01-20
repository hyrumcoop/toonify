<template>
  <div class='image-history-bar'>
    <div class='images d-flex flex-row' v-if='hasImages'>
      <a
        href='#'
        class='preview-image'
        v-for='(image, i) in images'
        :key='i'
        @click='selectImage(i)'
        :class='{active: isSelected(i)}'
      >
        <img
          :src='image.url'
          :alt='image.tooltip' />
      </a>

      <a
        href='#'
        class='preview-image loading-image'
        v-if='generating'
      >
        <div class='loading-spinner-box'>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Transparent image is used to make the spinner box the same size as the other images -->
        <img
            :src='firstImage.url'
            :alt='firstImage.tooltip' />
      </a>
    </div>

    <div class='no-images' v-else>
      <p class='m-0'>No images.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageHistory',
  props: {
    images: Array,
    selected: {
      type: Number,
      default: 0
    },
    generating: Boolean
  },
  methods: {
    selectImage(index) {
      this.$emit('select', index)
    },

    isSelected(index) {
      return index == this.selected
    }
  },
  computed: {
    hasImages() {
      return !!this.images && this.images.length > 0
    },

    firstImage() {
      return this.hasImages ? this.images[0] : null
    }
  }
}
</script>

<style scoped>

.image-history-bar {
  display:flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 90px;
  background-color: #212121;
  color: white;
}

.images {
  height: 100%;
  padding: 10px;
}

.preview-image {
  height: 100%;
  margin: 0px 5px;
}

.preview-image img {
  height: 100%;
  filter: brightness(75%);

  transition: filter 0.15s ease;
}

.preview-image.active img {
  filter: none;
}

.preview-image img:hover {
  filter: none
}

.loading-image {
  background-color: #666;
  color: #212121;

  transition: background-color 0.15s ease;
}

.loading-image:hover {
  background-color: #555;
}

.loading-spinner-box {
  display: flex;

  width: 100%;
  height: 100%;

  align-items: center;
  justify-content: center;
}

.loading-image img {
  opacity: 0;
}

</style>