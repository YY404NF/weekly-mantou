import type { WebGLRenderer } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const dracoDecoderPath = '/draco/gltf/'
const ktx2TranscoderPath = '/basis/'

const gltfPromiseCache = new Map<string, Promise<GLTF>>()

let sharedLoader: GLTFLoader | null = null
let sharedKTX2Loader: KTX2Loader | null = null

function ensureLoader(renderer: WebGLRenderer): GLTFLoader {
  if (!sharedLoader) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(dracoDecoderPath)

    sharedKTX2Loader = new KTX2Loader()
    sharedKTX2Loader.setTranscoderPath(ktx2TranscoderPath)
    sharedKTX2Loader.detectSupport(renderer)

    sharedLoader = new GLTFLoader()
    sharedLoader.setDRACOLoader(dracoLoader)
    sharedLoader.setKTX2Loader(sharedKTX2Loader)
    sharedLoader.setMeshoptDecoder(MeshoptDecoder)
  }

  return sharedLoader
}

export async function loadCachedGLTF(url: string, renderer: WebGLRenderer): Promise<GLTF> {
  const loader = ensureLoader(renderer)

  let pending = gltfPromiseCache.get(url)
  if (!pending) {
    pending = loader.loadAsync(url)
    gltfPromiseCache.set(url, pending)
  }

  try {
    const gltf = await pending
    return {
      ...gltf,
      scene: clone(gltf.scene),
    }
  } catch (error) {
    gltfPromiseCache.delete(url)
    throw error
  }
}
