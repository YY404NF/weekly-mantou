<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import MantouModel from '@/components/MantouModel.vue'
import type { DrawResultItem } from '@/types/mantou'

defineProps<{
  item: DrawResultItem
}>()

const emit = defineEmits<{
  close: []
}>()

const entered = ref(false)
const modelReady = ref(false)
const hugeAngle = Math.PI * 1000

onMounted(() => {
  requestAnimationFrame(() => {
    entered.value = true
  })
})

function handleModelLoaded(): void {
  modelReady.value = true
}

function closePreview(): void {
  entered.value = false
  window.setTimeout(() => emit('close'), 260)
}
</script>

<template>
  <div class="preview-overlay" :class="{ 'is-visible': entered }">
    <div class="preview-canvas" :class="{ 'is-visible': entered, 'model-ready': modelReady }">
      <TresCanvas :clear-color="'#00000000'" :alpha="true">
        <TresPerspectiveCamera :position="[0, 0.3, 3.6]" />
        <OrbitControls
          :enable-pan="false"
          :min-distance="2.4"
          :max-distance="10.5"
          :min-polar-angle="-hugeAngle"
          :max-polar-angle="hugeAngle"
          :min-azimuth-angle="-hugeAngle"
          :max-azimuth-angle="hugeAngle"
        />
        <TresAmbientLight :intensity="1.5" />
        <TresDirectionalLight :position="[3, 5, 4.5]" :intensity="2" />

        <TresGroup :scale="[4.8, 4.8, 4.8]" :rotation="[0, 0.4, 0]">
          <MantouModel :model-url="item.modelUrl" :scale="1" @loaded="handleModelLoaded" />
        </TresGroup>
      </TresCanvas>
    </div>

    <button class="preview-close-btn" :class="{ 'is-visible': entered }" @click="closePreview">关闭预览</button>
  </div>
</template>
