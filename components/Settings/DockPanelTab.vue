<template>
  <el-tab-pane :label="$t('dockPanel')" class="dockPanel-pane">
    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.dockPanelColor"
        :title="$t('chooseDockPanelColor')"
      />
    </el-card>

    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.dockPanelTextColor"
        :title="$t('chooseDockPanelTextColor')"
        :show-hint="false"
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
