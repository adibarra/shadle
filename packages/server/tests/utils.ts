import config from '@shadle/config'

export function skipIfCI(): { skip: true } | false {
  if (config.IS_CI) {
    return { skip: true }
  }
  return false
}
