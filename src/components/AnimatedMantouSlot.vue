<script setup lang="ts">
import { computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import MantouModel from '@/components/MantouModel.vue'
import type { DrawResultItem } from '@/types/mantou'

const props = defineProps<{
  item: DrawResultItem
  index: number
  elapsedMs: number
  stageDuration: number
  introDuration: number
  finalShowcase: boolean
  ready: boolean
}>()

const emit = defineEmits<{
  loaded: [key: string]
  preview: [item: DrawResultItem]
}>()

const delayMs = computed(() => props.index * props.stageDuration)
const slotKey = computed(() => `${props.item.id}-${props.index}`)

function clamp01(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  const x = t - 1
  return 1 + c3 * x * x * x + c1 * x * x
}

const progress = computed(() => {
  if (!props.ready) return 0
  const raw = (props.elapsedMs - delayMs.value) / props.introDuration
  return clamp01(raw)
})

const groupRotation = computed<[number, number, number]>(() => {
  const introSpin = -(1 - progress.value) * Math.PI * 7.5
  const idleSpin = Math.max(0, props.elapsedMs - delayMs.value) * 0.00115
  return [0, introSpin + idleSpin, 0]
})

const groupScale = computed<[number, number, number]>(() => {
  const targetScale = 4.4
  const s = Math.max(0.001, easeOutBack(progress.value) * targetScale)
  return [s, s, s]
})

const groupY = computed(() => {
  const hover = Math.sin((props.elapsedMs + props.index * 200) * 0.004) * 0.035
  const lift = (1 - progress.value) * 0.85
  return hover + lift
})

const slotOpacity = computed(() => progress.value)
const canPreview = computed(() => props.finalShowcase && slotOpacity.value > 0.95)

function handlePreviewClick(event: MouseEvent): void {
  if (!canPreview.value) return
  emit('preview', props.item)
}
</script>

<template>
  <div class="slot-wrap">
    <button
      class="slot-canvas"
      :style="{ opacity: slotOpacity }"
      :disabled="!canPreview"
      @click="handlePreviewClick"
    >
      <TresCanvas :clear-color="'#00000000'" :alpha="true">
        <TresPerspectiveCamera :position="[0, 0.2, 2.35]" />
        <TresAmbientLight :intensity="1.45" />
        <TresDirectionalLight :position="[2.2, 4.5, 4.5]" :intensity="1.9" />

        <TresGroup
          :position="[0, groupY, 0]"
          :rotation="groupRotation"
          :scale="groupScale"
        >
          <MantouModel
            :model-url="item.modelUrl"
            :scale="1"
            @loaded="emit('loaded', slotKey)"
          />
        </TresGroup>
      </TresCanvas>
    </button>
    <p class="slot-name" :style="{ opacity: slotOpacity }">{{ item.name }}</p>
    <p class="slot-count" :style="{ opacity: slotOpacity }">{{ item.quantity }}个</p>
  </div>
</template>
