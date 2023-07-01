<template>
  <el-select v-model="wallpaperType" placeholder="Тип фона">
    <el-option label="Видео" value="video" />
    <el-option label="Картинка" value="image" />
    <el-option label="Цвет" value="color" />
  </el-select>

  <div class="uploader" v-if="['video', 'image'].includes(wallpaperType!)">
    <div class="icon">
      <Upload />
      <input type="file" @change="uploadFile" ref="fileRef" />
    </div>
  </div>

  <div v-if="wallpaperType == 'color'" class="color-settings">
    <SettingsExtendedColorPicker
        v-model="settings.wallpaperSrc"
        title="Выберите цвет"
      />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'
import { useSettingsPopupStore } from '~/stores/popups/settingsPopup'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps<{ mobile: boolean }>()
const settingsPopupStore = useSettingsPopupStore()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const fileRef = ref<InstanceType<typeof HTMLInputElement> | null>(null)

async function uploadFile() {
  if (fileRef.value?.files == null) return
  const file = fileRef.value.files[0]

  const form = new FormData()
  form.append('file', file)
  fileRef.value.value = ''

  const cacheHash = await $fetch(
    '/api/upload/' + wallpaperType.value + (props.mobile ? 'Mobile' : ''),
    { method: 'post', body: form }
  )

  if (wallpaperSrc.value)
    wallpaperSrc.value =
      wallpaperSrc.value?.split('?cacheHash')[0] + '?cacheHash' + cacheHash

  await settingsStore.applySettings()
  settingsPopupStore.hide()
}

const wallpaperType = computed({
  get() {
    return props.mobile
      ? settings.value?.mobileWallpaperType
      : settings.value?.wallpaperType
  },
  set(value) {
    props.mobile
      ? (settings.value!.mobileWallpaperType = value ?? 'video')
      : (settings.value!.wallpaperType = value ?? 'video')
  },
})

const wallpaperSrc = computed({
  get() {
    return props.mobile
      ? settings.value?.mobileWallpaperSrc
      : settings.value?.wallpaperSrc
  },
  set(value) {
    props.mobile
      ? (settings.value!.mobileWallpaperSrc = value ?? '')
      : (settings.value!.wallpaperSrc = value ?? '')
  },
})
</script>

<style lang="scss" scoped>
.color-settings {
  margin-top: 25px;
}

.uploader {
  margin-top: 25px;
  display: flex;
  justify-content: center;

  .icon {
    width: 32px;
    height: 32px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    position: relative;

    input,
    svg {
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
</style>
