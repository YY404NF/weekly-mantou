<script setup lang="ts">
import { ref } from 'vue'
import type { MantouItem } from '@/types/mantou'

defineProps<{
  mantouList: MantouItem[]
  error: string
}>()

defineEmits<{
  draw: []
}>()

const showPool = ref(false)

function formatPrice(value: number): string {
  return `￥${value.toFixed(2)}`
}
</script>

<template>
  <section class="card-body">
    <h2>抽奖规则</h2>
    <p class="rule">固定 10 个老面馒头 + 2 种随机馒头共 10~30 个</p>

    <button class="primary-btn" @click="$emit('draw')">开始抽奖</button>

    <button class="ghost-btn" @click="showPool = !showPool">
      {{ showPool ? '收起奖池内容' : '奖池内容' }}
    </button>

    <ul v-if="showPool" class="mantou-list">
      <li v-for="item in mantouList" :key="item.id" class="mantou-item">
        <div>
          <strong>{{ item.name }}</strong>
          <p>{{ formatPrice(item.price) }} / 个</p>
        </div>
        <span class="tag">{{ item.fixed ? '固定' : item.purchasable ? '参与抽奖' : '不参与' }}</span>
      </li>
    </ul>

    <p v-if="error" class="error">{{ error }}</p>

  </section>
</template>
