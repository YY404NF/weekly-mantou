<script setup lang="ts">
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
</script>

<template>
  <section class="card-body">
    <h2>抽奖结果</h2>

    <MantouModel3D :items="drawResult.items" />

    <div class="result-summary">
      <p>总个数：{{ drawResult.totalCount }} 个</p>
    </div>

    <button class="primary-btn" @click="$emit('copy')">复制抽奖结果</button>
    <p v-if="copyTip" class="tip">{{ copyTip }}</p>

    <button class="ghost-btn" @click="$emit('redraw')">重新抽奖</button>
  </section>
</template>
