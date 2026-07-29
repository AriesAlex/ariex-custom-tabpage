<template>
  <el-select v-model="wallpaperType" :placeholder="$t('wallpaperType')">
    <el-option :label="$t('video')" value="video" />
    <el-option :label="$t('picture')" value="image" />
    <el-option :label="$t('color')" value="color" />
  </el-select>

  <div class="uploader" v-if="['video', 'image'].includes(wallpaperType)">
    <div class="icon">
      <Upload />
      <input
        ref="fileRef"
        type="file"
        :accept="wallpaperType === 'image' ? 'image/*' : 'video/*'"
        :disabled="uploading"
        @change="uploadFile"
      />
    </div>
  </div>

  <div v-if="wallpaperType == 'color'" class="color-settings">
    <SettingsExtendedColorPicker
      v-model="wallpaperSrc"
      :title="$t('chooseColor')"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'
import { useSettingsPopupStore } from '~/stores/popups/settingsPopup'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'
import { Upload } from '@element-plus/icons-vue'
import type { WallpaperType } from '~/interfaces/Settings'
import { getRequestErrorMessage } from '~/utils/requestError'

const props = defineProps<{ mobile: boolean }>()
const { t } = useI18n()
const alertPopupStore = useAlertPopupStore()
const settingsPopupStore = useSettingsPopupStore()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const fileRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

async function uploadFile() {
  if (!fileRef.value?.files?.length || uploading.value) return
  const file = fileRef.value.files[0]
  fileRef.value.value = ''
  uploading.value = true

  try {
    const form = new FormData()
    form.append('file', file)
    const cacheHash = await $fetch(
      '/api/upload/' + wallpaperType.value + (props.mobile ? 'Mobile' : ''),
      { method: 'post', body: form }
    )
    wallpaperSrc.value =
      wallpaperSrc.value.split('?cacheHash')[0] + '?cacheHash' + cacheHash
    await settingsStore.applySettings()
    settingsPopupStore.hide()
  } catch (error) {
    alertPopupStore.show(
      { content: getRequestErrorMessage(error, t('unexpectedError')) },
      t
    )
  } finally {
    uploading.value = false
  }
}

const wallpaperType = computed<WallpaperType>({
  get() {
    return props.mobile
      ? settings.value.mobileWallpaperType
      : settings.value.wallpaperType
  },
  set(value: WallpaperType) {
    props.mobile
      ? (settings.value.mobileWallpaperType = value)
      : (settings.value.wallpaperType = value)
  },
})

const wallpaperSrc = computed<string>({
  get() {
    return props.mobile
      ? settings.value.mobileWallpaperSrc
      : settings.value.wallpaperSrc
  },
  set(value: string) {
    props.mobile
      ? (settings.value.mobileWallpaperSrc = value)
      : (settings.value.wallpaperSrc = value)
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
