<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos'
import { ref, watch } from 'vue'
import { getFallbackModelUrl, resolveModelUrl } from '@/utils/modelUrl'

const props = defineProps<{
  modelUrl: string
  scale?: number
}>()

const emit = defineEmits<{
  loaded: []
}>()

const modelRef = ref<{ instance?: unknown } | null>(null)
const loadedOnce = ref(false)
const fallbackModelUrl = getFallbackModelUrl()
const resolvedModelUrl = ref(fallbackModelUrl)

watch(
  () => props.modelUrl,
  async (url) => {
    loadedOnce.value = false
    resolvedModelUrl.value = await resolveModelUrl(url || fallbackModelUrl)
  },
  { immediate: true },
)

watch(
  () => modelRef.value?.instance,
  (instance) => {
    if (!loadedOnce.value && instance) {
      loadedOnce.value = true
      emit('loaded')
    }
  },
)

</script>

<template>
  <GLTFModel
    ref="modelRef"
    :path="resolvedModelUrl"
    :scale="props.scale ?? 0.8"
  />
</template>
