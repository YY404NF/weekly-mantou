<script setup lang="ts">
import { ref, watch } from 'vue'
import MantouModel3D from '@/components/MantouModel3D.vue'
import type { DrawResult } from '@/types/mantou'

const props = defineProps<{
  drawResult: DrawResult
  copyTip: string
}>()

defineEmits<{
  copy: []
  redraw: []
}>()

const modelsReady = ref(false)
const summaryReady = ref(false)

watch(
  () => props.drawResult,
  () => {
    modelsReady.value = false
    summaryReady.value = false
  },
  { immediate: true },
)
</script>

<template>
  <section class="card-body">
    <h2>抽奖结果 🎉</h2>

    <MantouModel3D
      :items="drawResult.items"
      @ready="modelsReady = $event"
      @showcase-ready="summaryReady = $event"
    />

    <div v-if="summaryReady" class="result-summary">
      <p>总个数：{{ drawResult.totalCount }} 个</p>
    </div>

    <button v-if="modelsReady" class="primary-btn" @click="$emit('copy')">复制抽奖结果 📋</button>
    <p v-if="modelsReady && copyTip" class="tip">{{ copyTip }}</p>

    <button v-if="modelsReady" class="ghost-btn" @click="$emit('redraw')">重新抽奖 🔄</button>
  </section>
</template>
