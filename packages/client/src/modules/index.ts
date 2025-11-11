// module loader for react app
import type { UserModule } from '~/types'

const modules = import.meta.glob('./*.ts', { eager: true })

export async function loadModules() {
  const modulePromises: Promise<void>[] = []

  for (const path in modules) {
    const module = modules[path] as { install?: UserModule }
    if (module.install) {
      const promise = Promise.resolve(module.install())
      modulePromises.push(promise)
    }
  }

  await Promise.all(modulePromises)
}
