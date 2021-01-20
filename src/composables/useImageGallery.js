import { ref, computed } from 'vue'
import useImageDataConverter from './useImageDataConverter'

const useImageGallery = () => {
  const { toDataUrl } = useImageDataConverter()

  const gallery = ref([])
  const selected = ref(0)
  const autoSelect = ref(true) // automatically select images once loaded?
  const loading = ref(false)

  const clear = () => {
    gallery.value = []
    selected.value = 0
    autoSelect.value = true
    loading.value = false
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
    loading.value = true

    // TODO: this is ugly; try iterating generator using a for-loop
    const iterate = async () => {
      const image = await generator.next()
      if (image.done) return

      push(image.value)
      await iterate()
    }
    
    await iterate()

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

  return {
    gallery,
    selectedImage: selected,
    autoSelectImage: autoSelect,
    loadingGallery: loading,

    clearGallery: clear,
    pushImage: push,
    generateGallery: generate,
    selectImage: select,

    isGalleryEmpty: isEmpty,
    currentImage: current
  }
}

export default useImageGallery