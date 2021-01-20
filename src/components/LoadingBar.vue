<template>
  <div class='progress'>
    <div
      class='progress-bar progress-bar-striped progress-bar-animated'
      :style='{width: percentageText}'
    >
      <span class='font-monospace'>{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingBar',
  data() {
    return {
      currentStep: 0
    }
  },
  props: {
    progress: {
      type: Number,
      default: 100
    },
    text: {
      type: String,
      default: 'LOADING...'
    }
  },
  computed: {
    percentageText() {
      if (!this.progress) return '100%'

      return this.progress + '%'
    }
  }
}
</script>

<style scoped>

.progress {
  border-radius: 0
}

</style>