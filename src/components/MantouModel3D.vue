<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AnimatedMantouSlot from '@/components/AnimatedMantouSlot.vue'
import FullscreenMantouPreview from '@/components/FullscreenMantouPreview.vue'
import type { DrawResultItem } from '@/types/mantou'

const props = defineProps<{
  items: DrawResultItem[]
}>()

const elapsedMs = ref(0)
const nowMs = ref(0)
const introStartedAt = ref<number | null>(null)
const loadedSlotKeys = ref<Set<string>>(new Set())
const activePreviewItem = ref<DrawResultItem | null>(null)
let rafId = 0

const stageDuration = 1700
const introDuration = 1050

const orderedItems = computed(() => {
  const normalItems = props.items.filter((item) => !item.fixed)
  const whiteItem = props.items.find((item) => item.fixed)
  return (whiteItem ? [...normalItems, whiteItem] : normalItems).slice(0, 3)
})

const introEndAtMs = computed(() => {
  if (!orderedItems.value.length) return 0
  return (orderedItems.value.length - 1) * stageDuration + introDuration
})

const finalShowcase = computed(() => elapsedMs.value >= introEndAtMs.value)

watch(
  () => props.items,
  () => {
    loadedSlotKeys.value = new Set()
    introStartedAt.value = null
    elapsedMs.value = 0
    activePreviewItem.value = null
  },
  { immediate: true },
)

onMounted(() => {
  const tick = (now: number) => {
    nowMs.value = now
    if (activePreviewItem.value) {
      rafId = requestAnimationFrame(tick)
      return
    }
    elapsedMs.value = introStartedAt.value == null ? 0 : now - introStartedAt.value
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

function onSlotLoaded(key: string): void {
  loadedSlotKeys.value.add(key)
  if (
    introStartedAt.value == null &&
    orderedItems.value.length > 0 &&
    loadedSlotKeys.value.size >= orderedItems.value.length
  ) {
    introStartedAt.value = nowMs.value || performance.now()
  }
}

function openPreview(item: DrawResultItem): void {
  if (!finalShowcase.value) return
  activePreviewItem.value = item
}

function closePreview(): void {
  activePreviewItem.value = null
}
</script>

<template>
  <div class="model-row borderless-canvas">
    <AnimatedMantouSlot
      v-for="(item, index) in orderedItems"
      :key="`${item.id}-${index}`"
      :item="item"
      :index="index"
      :elapsed-ms="elapsedMs"
      :stage-duration="stageDuration"
      :intro-duration="introDuration"
      :final-showcase="finalShowcase"
      :ready="introStartedAt !== null"
      @loaded="onSlotLoaded"
      @preview="openPreview"
    />
  </div>

  <FullscreenMantouPreview
    v-if="activePreviewItem"
    :item="activePreviewItem"
    @close="closePreview"
  />
</template>
