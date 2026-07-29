<template>
  <div id="alert-popup">
    <PopupBase :title="settings.title!" :show="active" @close="hide">
      <div class="alert-content">{{ settings.content }}</div>
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'

const alertPopupStore = useAlertPopupStore()
const { active, settings } = storeToRefs(alertPopupStore)
const { hide } = alertPopupStore
</script>

<style scoped>
.alert-content {
  white-space: pre-line;
}
</style>
