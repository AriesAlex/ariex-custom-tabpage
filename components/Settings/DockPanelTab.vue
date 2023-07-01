<template>
  <el-tab-pane label="Док-панель" class="dockPanel-pane">
    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.dockPanelColor"
        title="Выберите цвет панели"
      />
    </el-card>

    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.dockPanelTextColor"
        title="Выберите цвет текста"
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
