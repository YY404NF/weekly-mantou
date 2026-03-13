const fallbackModelUrl = '/models/mantou/老面馒头.glb'

export function getFallbackModelUrl(): string {
  return fallbackModelUrl
}

export async function resolveModelUrl(url: string): Promise<string> {
  if (!url) return fallbackModelUrl
  return url
}
