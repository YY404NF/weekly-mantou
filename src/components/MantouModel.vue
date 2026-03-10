<script setup lang="ts">
import { useLoader, useTres } from '@tresjs/core'
import { ref, watch } from 'vue'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { getFallbackModelUrl, resolveModelUrl } from '@/utils/modelUrl'

const dracoDecoderPath = '/draco/gltf/'
const ktx2TranscoderPath = '/basis/'

let sharedDracoLoader: DRACOLoader | null = null
let sharedKTX2Loader: KTX2Loader | null = null

function getDracoLoader(): DRACOLoader {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader()
    sharedDracoLoader.setDecoderPath(dracoDecoderPath)
  }

  return sharedDracoLoader
}

function getKTX2Loader(renderer: ReturnType<typeof useTres>['renderer']): KTX2Loader {
  if (!sharedKTX2Loader) {
    sharedKTX2Loader = new KTX2Loader()
    sharedKTX2Loader.setTranscoderPath(ktx2TranscoderPath)
    sharedKTX2Loader.detectSupport(renderer)
  }

  return sharedKTX2Loader
}

const props = defineProps<{
  modelUrl: string
  scale?: number
}>()

const emit = defineEmits<{
  loaded: []
}>()

const fallbackModelUrl = getFallbackModelUrl()
const resolvedModelUrl = ref(fallbackModelUrl)
const loadedOnce = ref(false)
const { renderer } = useTres()

const { state: gltf, error } = useLoader<GLTF>(GLTFLoader, resolvedModelUrl, {
  extensions: (loader) => {
    loader.setDRACOLoader(getDracoLoader())
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.setKTX2Loader(getKTX2Loader(renderer))
  },
})

watch(
  () => props.modelUrl,
  async (url) => {
    loadedOnce.value = false
    resolvedModelUrl.value = await resolveModelUrl(url || fallbackModelUrl)
  },
  { immediate: true },
)

watch(
  () => error.value,
  async (loadError) => {
    if (!loadError || resolvedModelUrl.value === fallbackModelUrl) return
    resolvedModelUrl.value = await resolveModelUrl(fallbackModelUrl)
  },
)

watch(
  () => gltf.value?.scene,
  (scene) => {
    if (!loadedOnce.value && scene) {
      loadedOnce.value = true
      emit('loaded')
    }
  },
)
</script>

<template>
  <primitive
    v-if="gltf?.scene"
    :object="gltf.scene"
    :scale="props.scale ?? 0.8"
  />
</template>
