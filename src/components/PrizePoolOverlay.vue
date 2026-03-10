<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PoolMantouCard from '@/components/PoolMantouCard.vue'
import type { MantouItem } from '@/types/mantou'

defineProps<{
  items: MantouItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

const entered = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    entered.value = true
  })
})

function closeOverlay(): void {
  entered.value = false
  window.setTimeout(() => emit('close'), 240)
}
</script>

<template>
  <div class="pool-overlay" :class="{ 'is-visible': entered }">
    <section class="pool-panel" :class="{ 'is-visible': entered }">
      <div class="pool-panel-head">
        <h2>奖池内容</h2>
      </div>

      <div class="pool-grid">
        <PoolMantouCard
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
        />
      </div>
    </section>

    <button class="pool-close-btn" :class="{ 'is-visible': entered }" @click="closeOverlay">关闭奖池</button>
  </div>
</template>
