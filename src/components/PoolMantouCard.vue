<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import MantouModel from '@/components/MantouModel.vue'
import type { MantouItem } from '@/types/mantou'

const props = defineProps<{
  item: MantouItem
  index: number
}>()

const elapsedMs = ref(0)
const loaded = ref(false)
let rafId = 0
let startedAt = 0

const modelRotation = computed<[number, number, number]>(() => [0, props.index * 0.42 + elapsedMs.value * 0.00045, 0])
const modelY = computed(() => Math.sin(elapsedMs.value * 0.0022 + props.index * 0.6) * 0.04)
const cardVisible = computed(() => loaded.value)

function formatPrice(value: number): string {
  return `¥${value.toFixed(2)}`
}

function handleLoaded(): void {
  loaded.value = true
}

onMounted(() => {
  startedAt = performance.now()
  const tick = (now: number) => {
    elapsedMs.value = now - startedAt
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <article class="pool-card" :class="{ 'is-visible': cardVisible }">
    <div class="pool-card-canvas">
      <TresCanvas :clear-color="'#00000000'" :alpha="true">
        <TresPerspectiveCamera :position="[0, 0.08, 2.35]" />
        <TresAmbientLight :intensity="1.55" />
        <TresDirectionalLight :position="[2.4, 4.4, 4.2]" :intensity="1.9" />

        <TresGroup
          :position="[0, modelY, 0]"
          :rotation="modelRotation"
          :scale="[3.4, 3.4, 3.4]"
        >
          <MantouModel :model-url="item.modelUrl" :scale="1" @loaded="handleLoaded" />
        </TresGroup>
      </TresCanvas>
    </div>

    <div class="pool-card-meta">
      <p class="pool-card-name">{{ item.name }}</p>
      <p class="pool-card-price">{{ formatPrice(item.price) }} / 个</p>
    </div>
  </article>
</template>
