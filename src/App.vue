<script setup lang="ts">
import { computed, ref } from 'vue'
import mantouConfig from './config/mantou.json'
import DrawView from './views/DrawView.vue'
import ResultView from './views/ResultView.vue'
import type { DrawResult, DrawResultBase, MantouItem } from './types/mantou'

const mantouList = mantouConfig as MantouItem[]

const currentView = ref('draw')
const drawResult = ref<DrawResult | null>(null)
const error = ref('')
const copyTip = ref('')

const defaultMantou = computed(() => mantouList.find((item) => item.fixed))
const randomPool = computed(() => mantouList.filter((item) => !item.fixed && item.purchasable))

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function joinMantouPhrases(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  if (parts.length === 2) return `${parts[0]}和${parts[1]}`
  return `${parts.slice(0, -1).join('、')}和${parts.at(-1)}`
}

function createShareText(result: DrawResultBase): string {
  const detailText = joinMantouPhrases(result.items.map((item) => `${item.quantity}个${item.name}`))
  return `我抽到了${detailText}。`
}

function runDraw() {
  error.value = ''
  copyTip.value = ''

  if (!defaultMantou.value?.purchasable) {
    error.value = '老面馒头为固定项，请保持可购买状态。'
    return
  }

  if (randomPool.value.length < 2) {
    error.value = '至少需要 2 种可购买馒头用于抽奖。'
    return
  }

  const totalExtra = randomInt(10, 30)
  const firstIndex = randomInt(0, randomPool.value.length - 1)
  let secondIndex = randomInt(0, randomPool.value.length - 1)
  while (secondIndex === firstIndex) {
    secondIndex = randomInt(0, randomPool.value.length - 1)
  }

  const randomMantouA = randomPool.value[firstIndex]
  const randomMantouB = randomPool.value[secondIndex]

  if (!randomMantouA || !randomMantouB || !defaultMantou.value) {
    error.value = '奖池配置异常，请检查 mantou.json。'
    return
  }

  const countA = randomInt(1, totalExtra - 1)
  const countB = totalExtra - countA

  const items = [
    {
      id: defaultMantou.value.id,
      name: defaultMantou.value.name,
      price: defaultMantou.value.price,
      quantity: 10,
      subtotal: 10 * defaultMantou.value.price,
      modelUrl: defaultMantou.value.modelUrl,
      fixed: true,
    },
    {
      id: randomMantouA.id,
      name: randomMantouA.name,
      price: randomMantouA.price,
      quantity: countA,
      subtotal: countA * randomMantouA.price,
      modelUrl: randomMantouA.modelUrl,
      fixed: false,
    },
    {
      id: randomMantouB.id,
      name: randomMantouB.name,
      price: randomMantouB.price,
      quantity: countB,
      subtotal: countB * randomMantouB.price,
      modelUrl: randomMantouB.modelUrl,
      fixed: false,
    },
  ]

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = items.reduce((sum, item) => sum + item.subtotal, 0)

  drawResult.value = {
    items,
    totalCount,
    totalCost,
    shareText: createShareText({ items, totalCount, totalCost }),
  }
  currentView.value = 'result'
}

async function copyResult() {
  if (!drawResult.value) return

  const text = drawResult.value.shareText
  copyTip.value = ''

  try {
    await navigator.clipboard.writeText(text)
    copyTip.value = '抽奖结果已复制，可粘贴发送给朋友。'
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()

    const copied = document.execCommand('copy')
    document.body.removeChild(textArea)
    copyTip.value = copied
      ? '抽奖结果已复制，可粘贴发送给朋友。'
      : '自动复制失败，请手动长按复制或截图发送。'
  }
}

function backToDraw() {
  currentView.value = 'draw'
  copyTip.value = ''
}
</script>

<template>
  <main class="app-shell">
    <section class="phone-card">
      <header class="card-header">
        <div class="header-title-row">
          <h1>馒头抽奖器 🥟</h1>
          <a
            class="github-link"
            href="https://github.com/YY404NF/Weekly-Mantou"
            target="_blank"
            rel="noreferrer"
            aria-label="查看 GitHub 仓库"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12c0 5.084 3.292 9.398 7.86 10.92 0.575 0.106 0.785-0.25 0.785-0.555 0-0.274-0.01-1-0.016-1.962-3.198 0.695-3.873-1.541-3.873-1.541-0.523-1.328-1.277-1.682-1.277-1.682-1.044-0.714 0.079-0.699 0.079-0.699 1.154 0.081 1.761 1.186 1.761 1.186 1.026 1.758 2.692 1.25 3.348 0.955 0.104-0.743 0.401-1.25 0.729-1.537-2.553-0.29-5.238-1.276-5.238-5.68 0-1.255 0.448-2.281 1.183-3.086-0.119-0.29-0.513-1.46 0.112-3.044 0 0 0.965-0.309 3.162 1.179A10.99 10.99 0 0 1 12 6.063c0.976 0.005 1.959 0.132 2.878 0.387 2.195-1.488 3.158-1.179 3.158-1.179 0.627 1.584 0.233 2.754 0.115 3.044 0.737 0.805 1.181 1.831 1.181 3.086 0 4.415-2.689 5.386-5.252 5.671 0.412 0.355 0.779 1.055 0.779 2.126 0 1.535-0.014 2.773-0.014 3.15 0 0.308 0.207 0.667 0.791 0.553C20.211 21.395 23.5 17.082 23.5 12 23.5 5.648 18.352 0.5 12 0.5z"
              />
            </svg>
          </a>
        </div>
        <p>选择困难症也要买馒头！✨</p>
      </header>

      <DrawView
        v-if="currentView === 'draw'"
        :mantou-list="mantouList"
        :error="error"
        @draw="runDraw"
      />

      <ResultView
        v-else-if="drawResult"
        :draw-result="drawResult"
        :copy-tip="copyTip"
        @copy="copyResult"
        @redraw="backToDraw"
      />
    </section>
  </main>
</template>
