<template>
  <div id="add-popup" @keydown.enter="add" @keydown.esc="hide">
    <PopupBase
      :title="settings.link.id ? $t('editLink') : $t('newLink')"
      :show="active"
      @close="hide"
    >
      <ElInput
        class="input"
        v-model="settings.link.title"
        ref="titleInputRef"
        :placeholder="$t('title')"
      />
      <ElInput
        :placeholder="$t('link')"
        v-model="settings.link.url"
        class="input"
        @input="fetchIcon"
      />

      <div class="icon-wrapper">
        <div class="icon">
          <img
            v-if="settings.link.icon"
            :src="settings.link.icon"
            width="32"
            height="32"
          />
          <input type="file" name="image" @change="upload" ref="fileRef" />
        </div>
      </div>

      <ElButton type="primary" class="button" @click="add">{{
        settings.link.id ? $t('edit') : $t('add')
      }}</ElButton>
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { Buffer } from 'buffer'
import { storeToRefs } from 'pinia'
import { useAddPopupStore, DEFAULT_ICON } from '~/stores/popups/addPopup'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'
import { useLinksStore } from '@/stores/links'
import { ElInput as ElInputComponent } from 'element-plus'
const { t } = useI18n()

const alertPopupStore = useAlertPopupStore()
const addPopupStore = useAddPopupStore()
const linkStore = useLinksStore()
const { active, settings } = storeToRefs(addPopupStore)
const { hide } = addPopupStore

const titleInputRef = ref<InstanceType<typeof ElInputComponent> | null>(null)
const fileRef = ref<InstanceType<typeof HTMLInputElement> | null>(null)

function add() {
  hide()
  $fetch('/api/links/add', { method: 'POST', body: settings.value.link })
    .catch(err => {
      alertPopupStore.show(
        {
          content: err.data.message,
        },
        t
      )
    })
    .finally(() => linkStore.loadLinks())
}

function fetchIcon() {
  if (settings.value.customIconApplied) return

  if (settings.value.getIconTimer) {
    clearTimeout(settings.value.getIconTimer)
    settings.value.getIconTimer = null
  }

  settings.value.getIconTimer = setTimeout(async () => {
    if (!settings.value.link.url) return

    const url = settings.value.link.url.startsWith('http')
      ? settings.value.link.url
      : 'https://' + settings.value.link.url
    const urlHostname = new URL(url).hostname

    const iconData = await $fetch<string>(
      'https://icon.horse/icon/' + urlHostname,
      {
        responseType: 'arrayBuffer',
      }
    )
    settings.value.link.icon = await resizeImage(iconData, 64, 64)
  }, 500)
}

function upload() {
  if (fileRef.value?.files == null) return
  const file = fileRef.value.files[0]

  if (file.size / 1024 > 500)
    return alertPopupStore.show(
      {
        content: t('fileLimitExceed'),
      },
      t
    )

  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    if (reader.result != null) {
      settings.value.link.icon = reader.result as string
      settings.value.customIconApplied = true
    }
  }
  reader.onerror = () => {
    settings.value.link.icon = DEFAULT_ICON
  }
}

function resizeImage(imgData: string, width: number, height: number) {
  return new Promise<string>(resolve => {
    const img = new Image()
    img.onload = function () {
      const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d')

      canvas.width = width
      canvas.height = height

      ctx!.drawImage(this as CanvasImageSource, 0, 0, width, height)
      resolve(canvas.toDataURL())
    }
    img.src =
      'data:image/png;base64,' +
      Buffer.from(imgData, 'binary').toString('base64')
  })
}

watch(active, active => {
  if (active) titleInputRef.value?.input?.focus()
})
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
