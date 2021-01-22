<template>
  <div class='sidebar d-flex flex-column shadow-sm'>
    <h5 class='sidebar-heading'>FILTER CONFIG</h5>

    <div class='config-group'>
      <label for='edges-input' class='form-label fw-bold'>EDGES</label>
      <input
        type='range'
        class='form-range'
        min='0'
        max='5'
        id='edges-input'
        :disabled='running'
        :value='modelValue.edges'
        @input='updateConfig($event, "edges")'
      >
    </div>

    <div class='config-group'>
      <label for='blur-input' class='form-label fw-bold'>BLUR</label>
      <input
        type='range'
        class='form-range'
        min='0'
        max='5'
        id='blur-input'
        :disabled='running'
        :value='modelValue.blur'
        @input='updateConfig($event, "blur")'
      >
    </div>

    <div class='config-group'>
      <label for='quantization-input' class='form-label fw-bold'>QUANTIZATION</label>
      <input
        type='range'
        class='form-range'
        min='0'
        max='5'
        id='quantization-input'
        :disabled='running'
        :value='modelValue.quantization'
        @input='updateConfig($event, "quantization")'
      >
    </div>

    <div class='config-group mb-0'>
      <button
        class='btn w-100 fw-bold'
        :class='{"btn-primary": !running, "btn-secondary": running}'
        @click='$emit(running ? "stop" : "start")'
      >{{ running ? 'STOP' : 'FILTER' }}</button>
    </div>

    <div v-if='!running'>
      <hr>

      <div class='config-group'>
        <button class='btn btn-primary w-100 fw-bold' @click='$refs.uploadInput.click()'>UPLOAD IMAGE</button>
      </div>

      <div class='config-group'>
        <button class='btn btn-secondary w-100 fw-bold' @click='$refs.modal.show()'>LOAD URL</button>
      </div>
    </div>

    <input
      class='d-none'
      type='file'
      accept='image/png, image/jpeg'
      ref='uploadInput'
      @change='uploadImage'
    />

    <image-url-modal ref='modal' @upload='loadUrl($event)' />
  </div>
</template>

<script>
import useImageUpload from '@/composables/useImageUpload'
import ImageUrlModal from './ImageUrlModal'

export default {
  name: 'FilterConfig',
  components: {
    ImageUrlModal
  },
  props: {
    running: Boolean,
    modelValue: {
      type: Object,
      default: () => ({
        edges: 3,
        blur: 3,
        quantization: 3
      })
    }
  },
  setup() {
    return useImageUpload()
  },
  methods: {
    updateConfig(e, prop) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [prop]: e.target.value
      })
    }
  }
}
</script>

<style scoped>

.sidebar {
  width: 200px;
  min-width: 200px;
  height: 100%;

  border-left: 1px solid #ccc;
}

.sidebar-heading {
  margin-top: 8px;
  padding: 0px 8px;
}

.config-group {
  margin-bottom: 8px;
  padding: 0px 8px;

  font-size: 14px;
}

.config-group label {
  margin: 0px;
}

.config-group button {
  font-size: inherit;
}

</style>