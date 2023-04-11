import { v4 } from 'uuid'
import fs from 'fs-extra'
import Link from '~/interfaces/Link'
import { watch, ref, Ref } from 'vue'

class Storage {
  filename = 'links.json'
  links: Ref<Link[]>

  constructor() {
    if (!fs.existsSync(this.filename)) fs.writeFileSync(this.filename, '[]')
    this.links = ref(fs.readJSONSync(this.filename))

    watch(
      this.links,
      () => {
        fs.writeJSONSync(this.filename, this.links.value, { spaces: 2 })
      },
      { deep: true }
    )

    this.generateIdForLinksWithoutIt()
  }

  generateIdForLinksWithoutIt() {
    this.links.value
      .filter(l => !l.id)
      .forEach(l => {
        l.id = v4()
      })
  }
}
export default new Storage().links
