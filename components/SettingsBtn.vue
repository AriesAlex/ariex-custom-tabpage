<template>
  <div
    class="settings-btn"
    @click="settingsPopupStore.show()"
    :class="{ hide: !props.show }"
  >
    <ElIcon>
      <Setting />
    </ElIcon>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import { useSettingsPopupStore } from '~/stores/popups/settingsPopup'
const settingsPopupStore = useSettingsPopupStore()
const props = defineProps<{ show: boolean }>()
</script>

<style lang="scss" scoped>
.settings-btn {
  position: absolute;
  right: 25px;
  top: 25px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  transition: 0.25s all;

  &:hover {
    transform: scale(1.1);
  }

  &.hide {
    top: -25px;
    transform: scale(0);
  }
}
</style>
