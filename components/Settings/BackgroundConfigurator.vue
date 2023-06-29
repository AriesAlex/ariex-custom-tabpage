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
    <div class="picker">
      <el-color-picker v-model="wallpaperSrc" size="large" />
      <div>Выберите цвет</div>
    </div>
    <el-input v-model="wallpaperSrc" placeholder="Или введите вручную" />
    <div class="hint">
      Поддерживаются css-свойства. Например
      <a target="_blank" href="https://cssgradient.io">linear-gradient</a> и url
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps<{ mobile: boolean }>()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const fileRef = ref<InstanceType<typeof HTMLInputElement> | null>(null)

async function uploadFile() {
  if (fileRef.value?.files == null) return
  const file = fileRef.value.files[0]

  const form = new FormData()
  form.append('file', file)

  await $fetch(
    '/api/upload/' + wallpaperType.value + (props.mobile ? 'Mobile' : ''),
    { method: 'post', body: form }
  )
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

  > .picker {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }

  > .hint {
    margin-top: 5px;
    margin-left: 5px;
    max-width: 220px;
    font-size: 13px;
    opacity: 0.8;
  }
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
