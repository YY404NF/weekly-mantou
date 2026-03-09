export interface MantouItem {
  id: number
  name: string
  price: number
  purchasable: boolean
  fixed: boolean
  modelUrl: string
}

export interface DrawResultItem {
  id: number
  name: string
  price: number
  quantity: number
  subtotal: number
  modelUrl: string
  fixed: boolean
}

export interface DrawResult {
  items: DrawResultItem[]
  totalCount: number
  totalCost: number
  shareText: string
}

export type DrawResultBase = Omit<DrawResult, 'shareText'>
