import { v4 } from 'uuid'
import fs, { StatWatcher } from 'fs-extra'
import { watch, ref, Ref, WatchStopHandle } from 'vue'
import Link from '~/interfaces/Link'
import Settings from '~/interfaces/Settings'
import deepmerge from 'deepmerge'
import getDefaultSettings from '~/shared/DefaultSettings'
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
      this.write(defaultValue)
    this.value = ref(this.read())

    this.valueWatcher = watch(
      this.value,
      () => {
        this.write(this.value.value)
      },
      { deep: true }
    )

    this.fileWatcher = fs.watchFile(this.filename, () => {
      try {
        this.value.value = this.read()
      } catch (e) {}
    })

    this.value.value = mergeObjects([this.defaultValue, this.value.value])
  }

  read() {
    return fs.readJSONSync(this.filename)
  }

  write(value: T) {
    const json = `${JSON.stringify(value, null, 2)}\n`
    fs.ensureFileSync(this.filename)

    const fd = fs.openSync(this.filename, 'r+')
    try {
      fs.writeFileSync(fd, json)
      fs.ftruncateSync(fd, Buffer.byteLength(json))
      fs.fsyncSync(fd)
    } finally {
      fs.closeSync(fd)
    }
  }
}

export const settingsStorage = new Storage<Settings>(
  'settings.json',
  getDefaultSettings()
)

export const linksStorage = new Storage<Link[]>('links.json', [])
linksStorage.value.value
  .filter(l => !l.id)
  .forEach(l => {
    l.id = v4()
  })
