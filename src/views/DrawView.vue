<script setup lang="ts">
import { ref } from 'vue'
import PrizePoolOverlay from '@/components/PrizePoolOverlay.vue'
import type { MantouItem } from '@/types/mantou'

defineProps<{
  mantouList: MantouItem[]
  error: string
}>()

defineEmits<{
  draw: []
}>()

const showPool = ref(false)
</script>

<template>
  <section class="card-body">
    <h2>抽奖规则 🎲</h2>
    <p class="rule">固定 10 个老面馒头 + 2 种随机馒头共 10~30 个</p>

    <button class="primary-btn" @click="$emit('draw')">开始抽奖 ✨</button>

    <button class="ghost-btn" @click="showPool = true">奖池内容 👀</button>

    <p v-if="error" class="error">{{ error }}</p>
  </section>

  <PrizePoolOverlay v-if="showPool" :items="mantouList" @close="showPool = false" />
</template>
