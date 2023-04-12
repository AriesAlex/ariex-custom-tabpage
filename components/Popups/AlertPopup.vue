<template>
  <div id="alert-popup">
    <PopupBase :title="settings.title" :show="active" @close="hide">
      <div v-html="formattedContent" />
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertPopupStore } from '~/stores/alertPopup'

const alertPopupStore = useAlertPopupStore()
const { active, settings } = storeToRefs(alertPopupStore)
const { hide } = alertPopupStore

const formattedContent = computed(() =>
  settings.value.content
    .replace(/\r\n/g, '<br>')
    .replace(/\r\n/g, '<br>')
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '<br>')
)
</script>
