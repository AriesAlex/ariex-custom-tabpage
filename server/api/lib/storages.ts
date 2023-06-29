import { v4 } from 'uuid'
import fs from 'fs-extra'
import { watch, ref, Ref } from 'vue'
import Link from '~/interfaces/Link'
import Settings from '~/interfaces/Settings'
import deepmerge from 'deepmerge'
const { all: mergeObjects } = deepmerge

class Storage<T> {
  filename: string
  value: Ref<T>
  defaultValue: T

  constructor(filename: string, defaultValue: T) {
    this.filename = filename
    this.defaultValue = defaultValue

    if (!fs.existsSync(filename))
      fs.writeJSONSync(this.filename, defaultValue, { spaces: 2 })
    this.value = ref(fs.readJSONSync(filename))

    watch(
      this.value,
      () => {
        fs.writeJSONSync(this.filename, this.value.value, { spaces: 2 })
      },
      { deep: true }
    )

    this.value.value = mergeObjects([this.defaultValue, this.value.value])
  }
}

export const settingsStorage = new Storage<Settings>('settings.json', {
  wallpaperType: 'video',
  wallpaperSrc: 'video.mp4',
  mobileWallpaperType: 'video',
  mobileWallpaperSrc: 'video_mobile.mp4',
})

export const linksStorage = new Storage<Link[]>('links.json', [])
linksStorage.value.value
  .filter(l => !l.id)
  .forEach(l => {
    l.id = v4()
  })
