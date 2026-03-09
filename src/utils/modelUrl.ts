const availabilityCache = new Map<string, boolean>()
const fallbackModelUrl = '/models/mantou/老面馒头.glb'
let probeAbortController: AbortController | null = null

export function getFallbackModelUrl(): string {
  return fallbackModelUrl
}

export async function resolveModelUrl(url: string): Promise<string> {
  if (!url || url === fallbackModelUrl) return fallbackModelUrl

  const cached = availabilityCache.get(url)
  if (cached != null) {
    return cached ? url : fallbackModelUrl
  }

  probeAbortController?.abort()
  probeAbortController = new AbortController()

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: probeAbortController.signal,
    })
    availabilityCache.set(url, response.ok)
    return response.ok ? url : fallbackModelUrl
  } catch {
    if (probeAbortController.signal.aborted) {
      return fallbackModelUrl
    }
    availabilityCache.set(url, false)
    return fallbackModelUrl
  }
}
