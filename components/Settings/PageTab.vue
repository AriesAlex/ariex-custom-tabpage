<template>
  <el-tab-pane :label="$t('page')" class="dockPanel-pane">
    <el-card class="color-card" shadow="never">
      <SettingsExtendedColorPicker
        v-model="settings.pageBackgroundColor"
        :title="$t('choosePageBackgroundColor')"
        :description="$t('pageBackgroundColorHint')"
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
