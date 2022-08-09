<template>
  <div id="add-popup" @keydown.enter="add" @keydown.esc="show = false">
    <PopupBase
      :title="link.id ? 'Изменить ссылку' : 'Новая ссылка'"
      :show="show"
      @close="show = false"
    >
      <el-input
        class="input"
        v-model="link.title"
        ref="titleInput"
        placeholder="Заголовок"
      />
      <el-input
        placeholder="Ссылка"
        v-model="link.url"
        class="input"
        @input="fetchIcon"
      />

      <div class="icon-wrapper">
        <div class="icon">
          <img v-if="link.icon" :src="link.icon" width="32" height="32" />
          <input type="file" name="image" @change="upload" ref="file" />
        </div>
      </div>

      <el-button type="primary" class="button" @click="add">{{
        link.id ? 'Изменить' : 'Добавить'
      }}</el-button>
    </PopupBase>
  </div>
</template>

<script>
const DEFAULT_ICON = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAaBJREFUWEftlksuRUEQhr87YAeIR6yAFTDBiLEpQwMb8BgIMWAFxJRFMDHDCgzMxXMJEiG/dEurdN86N1e7kdwzOjmnT/1f/VV9ulr0+Gr1WJ8+QOrAILAPrACjlUrzCJwBO8CbNFKAQ2CjkrANK60tC/AAjAEzwE0lEMW+AuTEuAX4CKK1G/OHTir22wBLwElIag04D/d/BnAPTARR3U/+e4DhkMFrwwZdNCW46MaBIeASGADmgaeGELllHfeAMpf4VIh2CywAJSc8pzoCSMUlrEsgJYi4XutKkI0Bou3TwB0wB7wHN+KztBzpegHom1y5GgHYzNNscu8kGMvkOeUCjJhgOSu90ligNIYLoAza1Tl2ttecJRddgFg/1fzZ2W62T2zNc+91EH2fQ7mzwNtmlinNdB04NgusE3E7f2nnANQDTf92aTmWgaOCY7ZcbR2odRzbbVp0oBaAspYTL14P1ASQdnEXxJFsFrju4rBp92kcyaT1NSuk2R4Am5WEbVhpbVsAjeV7wGoYTmuwKPNTYDc3ltcQdGPWbrg+gOvAJ17NfyGYRfQdAAAAAElFTkSuQmCC`
import PopupBase from '@/components/Popups/PopupBase'
import { Buffer } from 'buffer'

export default {
  components: { PopupBase },
  data() {
    return {
      show: false,
      link: {
        id: null,
        title: '',
        url: '',
        icon: DEFAULT_ICON,
      },
      getIconTimer: null,
      customIconApplied: false,
    }
  },
  created() {
    this.$events.on('show-add', link => {
      this.link = link ?? { id: null, title: '', url: '', icon: DEFAULT_ICON }
      this.show = true
      this.customIconApplied = false
      this.$store.getLinks()
    })
  },
  methods: {
    add() {
      this.show = false
      this.$api
        .post('api/add', this.link)
        .catch(err => {
          this.$events.emit('show-alert', err.response?.data ?? err.message)
        })
        .finally(this.$store.getLinks)
    },
    fetchIcon() {
      if (this.customIconApplied) return

      if (this.getIconTimer) {
        clearInterval(this.getIconTimer)
        this.getIconTimer = null
      }

      this.getIconTimer = setInterval(() => {
        clearInterval(this.getIconTimer)
        this.getIconTimer = null

        if (!this.link.url) return
        this.$api
          .get('https://icon.horse/icon/' + this.link.url, {
            responseType: 'arraybuffer',
          })
          .then(async ({ data }) => {
            this.link.icon = await this.resizeImage(data, 64, 64)
          })
      }, 500)
    },
    upload() {
      let file = this.$refs.file.files[0]

      if (file.size / 1024 > 500)
        return this.$events.emit(
          'show-alert',
          'Максимальный размер файла - 500кб'
        )

      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.link.icon = reader.result
        this.customIconApplied = true
      }
      reader.onerror = () => {
        this.link.icon = DEFAULT_ICON
      }
    },
    resizeImage(imgData, width, height) {
      return new Promise(resolve => {
        var img = new Image()
        img.onload = function () {
          var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d')

          canvas.width = width
          canvas.height = height

          ctx.drawImage(this, 0, 0, width, height)
          resolve(canvas.toDataURL())
        }
        img.src =
          'data:image/png;base64,' +
          Buffer.from(imgData, 'binary').toString('base64')
      })
    },
  },
  watch: {
    show(active) {
      if (active) this.$refs.titleInput.focus()
    },
  },
}
</script>

<style lang="scss">
#add-popup {
  .input {
    margin-bottom: 10px;
  }
  .button {
    margin-top: 15px;
    font-size: 16px;
  }
  .icon-wrapper {
    display: flex;
    justify-content: center;

    .icon {
      width: 32px;
      height: 32px;
      box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
      position: relative;

      input,
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      input {
        opacity: 0;
        cursor: pointer;

        &::-webkit-file-upload-button {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
