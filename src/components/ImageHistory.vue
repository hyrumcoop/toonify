<template>
  <div class='image-history-bar'>
    <div class='images' v-if='hasImages'>
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
    }
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

</style>