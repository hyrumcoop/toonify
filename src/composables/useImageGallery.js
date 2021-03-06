import { ref, computed } from 'vue'
import useImageDataConverter from './useImageDataConverter'

const useImageGallery = () => {
  const { toDataUrl } = useImageDataConverter()

  const gallery = ref([])
  const selected = ref(0)
  const autoSelect = ref(true) // automatically select images once loaded?
  const loading = ref(false)
  const step = ref(null)

  let job = 0 // ID of current job; helps avoid complications when starting/stopping filter

  const clear = () => {
    gallery.value = []
    selected.value = 0
    autoSelect.value = true
    loading.value = false
    step.value = false
    job++
  }

  const process = ({type, tooltip, data, url}) => {
    if (data && !url) {
      url = toDataUrl(data)
    }

    return {type, tooltip, url}
  }

  const push = image => {
    gallery.value.push(process(image))

    if (autoSelect.value) {
      selected.value = gallery.value.length - 1
    }
  }

  const generate = async generator => {
    step.value = {text: 'PROCESSING EDGES...', progress: 10} // TODO: this is hacky; it should come from the toonify worker method
    loading.value = true

    const thisJob = job
   
    // TODO: this is ugly; try iterating generator using a for-loop
    const iterate = async () => {
      const res = await generator.next()
      if (res.done) return true
      if (job != thisJob) return false // indicates that this iteration is no longer working on the current job; this job has been stopped

      push(res.value)
      step.value = res.value.step

      return await iterate()
    }
    
    const finished = await iterate()

    if (finished) {
      job++
      loading.value = false
      step.value = {
        text: 'COMPLETE',
        progress: 100
      }
    }
  }

  const stop = () => {
    job++
    loading.value = false
  }

  const select = index => {
    if (index < 0 && index >= gallery.value.length) throw Error(`Image index ${index} is out of bounds.`)

    autoSelect.value = false
    selected.value = index
  }

  const isEmpty = computed(() => {
    return !gallery.value || gallery.value.length == 0
  })

  const current = computed(() => {
    return gallery.value[selected.value]
  })

  const stepText = computed(() => {
    return step.value ? step.value.text : 'LOADING...'
  })

  const stepProgress = computed(() => {
    return step.value ? step.value.progress : 50
  })

  return {
    gallery,
    selectedImage: selected,
    autoSelectImage: autoSelect,
    loadingGallery: loading,
    step,

    clearGallery: clear,
    pushImage: push,
    generateGallery: generate,
    stopGenerating: stop,
    selectImage: select,

    isGalleryEmpty: isEmpty,
    currentImage: current,
    stepText,
    stepProgress
  }
}

export default useImageGallery