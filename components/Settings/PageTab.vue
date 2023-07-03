<template>
  <el-tab-pane label="Страница" class="dockPanel-pane">
    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.pageBackgroundColor"
        title="Выберите цвет фона страницы"
        description="При заходе на сайт фон не сразу загружается, поэтому можно дополнительно задать фон страницы во время загрузки"
      />
    </el-card>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
</script>

<style lang="scss">
.dockPanel-pane {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
</style>
