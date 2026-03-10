<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import type { WebGLRenderer } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useTres } from '@tresjs/core'
import { loadCachedGLTF } from '@/utils/gltfModelCache'
import { getFallbackModelUrl, resolveModelUrl } from '@/utils/modelUrl'

const props = defineProps<{
  modelUrl: string
  scale?: number
}>()

const emit = defineEmits<{
  loaded: []
}>()

const fallbackModelUrl = getFallbackModelUrl()
const gltf = shallowRef<GLTF | null>(null)
const loadedOnce = shallowRef(false)
const { renderer } = useTres()
let loadToken = 0

async function loadModel(url: string): Promise<void> {
  const currentToken = ++loadToken
  loadedOnce.value = false
  gltf.value = null

  const nextUrl = await resolveModelUrl(url || fallbackModelUrl)
  if (currentToken !== loadToken) return

  try {
    gltf.value = await loadCachedGLTF(nextUrl, renderer as WebGLRenderer)
  } catch {
    if (nextUrl === fallbackModelUrl || currentToken !== loadToken) return

    gltf.value = await loadCachedGLTF(fallbackModelUrl, renderer as WebGLRenderer)
  }

  if (currentToken === loadToken && gltf.value?.scene && !loadedOnce.value) {
    loadedOnce.value = true
    emit('loaded')
  }
}

watch(
  () => props.modelUrl,
  (url) => {
    void loadModel(url)
  },
  { immediate: true },
)
</script>

<template>
  <primitive
    v-if="gltf?.scene"
    :object="gltf.scene"
    :scale="props.scale ?? 0.8"
  />
</template>
