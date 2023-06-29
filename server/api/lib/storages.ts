import { v4 } from 'uuid'
import fs, { StatWatcher } from 'fs-extra'
import { watch, ref, Ref, WatchStopHandle } from 'vue'
import Link from '~/interfaces/Link'
import Settings from '~/interfaces/Settings'
import deepmerge from 'deepmerge'
const { all: mergeObjects } = deepmerge

class Storage<T> {
  filename: string
  value: Ref<T>
  defaultValue: T
  fileWatcher: StatWatcher
  valueWatcher: WatchStopHandle

  constructor(filename: string, defaultValue: T) {
    this.filename = filename
    this.defaultValue = defaultValue

    if (!fs.existsSync(filename))
      fs.writeJSONSync(this.filename, defaultValue, { spaces: 2 })
    this.value = ref(fs.readJSONSync(filename))

    this.valueWatcher = watch(
      this.value,
      () => {
        fs.writeJSONSync(this.filename, this.value.value, { spaces: 2 })
      },
      { deep: true }
    )

    this.fileWatcher = fs.watchFile(this.filename, () => {
      try {
        this.value.value = fs.readJSONSync(this.filename)
      } catch (e) {}
    })

    this.value.value = mergeObjects([this.defaultValue, this.value.value])
  }
}

export const settingsStorage = new Storage<Settings>('settings.json', {
  wallpaperType: 'video',
  wallpaperSrc: 'api/static/video',
  mobileWallpaperType: 'video',
  mobileWallpaperSrc: 'api/static/video_mobile',
  wallpaperDarkening: true,
})

export const linksStorage = new Storage<Link[]>('links.json', [])
linksStorage.value.value
  .filter(l => !l.id)
  .forEach(l => {
    l.id = v4()
  })
