<template>
  <div id="link-toolbar">
    <div
      class="toolbar"
      :style="{ pointerEvents: link ? 'initial' : 'none' }"
      :class="{ hide: !link }"
    >
      <div class="action" v-for="action in actions" :key="action.id">
        <ElIcon :class="action.class">
          <component :is="action.icon" @click="action.func" />
        </ElIcon>
      </div>
    </div>

    <div
      class="background"
      v-if="link"
      @click="close"
      @contextmenu.prevent="close"
      @keydown.esc="close"
    />
  </div>
</template>

<script setup lang="ts">
import type Link from '@/interfaces/Link'
import { arrayMoveMutable } from 'array-move'
import { storeToRefs } from 'pinia'
import { useLinksStore } from '@/stores/links'
import { useConfirmPopupStore } from '~/stores/popups/confirmPopup'
import { useAddPopupStore } from '~/stores/popups/addPopup'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'
import { ArrowLeft, Close, EditPen, ArrowRight } from '@element-plus/icons-vue'
import { getRequestErrorMessage } from '~/utils/requestError'
const { t } = useI18n()
const props = defineProps<{ link: Link | null }>()
const { link } = toRefs(props)
const emit = defineEmits(['close'])

const confirmPopupStore = useConfirmPopupStore()
const alertPopupStore = useAlertPopupStore()
const addPopupStore = useAddPopupStore()
const linkStore = useLinksStore()
const { links } = storeToRefs(linkStore)

const moveOffset = ref(0)
const moveTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function close() {
  if (moveTimer.value) return
  emit('close')
}
function move(direction: 'left' | 'right') {
  const directionOffset = direction == 'right' ? +1 : -1
  moveOffset.value += directionOffset
  const index = links.value.findIndex(l => l.id == link.value?.id)
  arrayMoveMutable(links.value, index, index + directionOffset)

  if (moveTimer.value) {
    clearTimeout(moveTimer.value)
    moveTimer.value = null
  }
  moveTimer.value = setTimeout(async () => {
    moveTimer.value = null

    if (!moveOffset.value) return
    const offset = moveOffset.value
    moveOffset.value = 0
    try {
      await $fetch('/api/links/move', {
        method: 'POST',
        body: { id: link.value?.id, offset },
      })
    } catch (error) {
      alertPopupStore.show(
        { content: getRequestErrorMessage(error, t('unexpectedError')) },
        t
      )
    } finally {
      await linkStore.loadLinks()
    }
  }, 500)
}

const actions = [
  {
    id: 'left',
    icon: ArrowLeft,
    func: () => move('left'),
  },
  {
    id: 'delete',
    class: 'red',
    icon: Close,
    func: async () => {
      confirmPopupStore.show(
        {
          content: t('deleteLinkConfirm', [link.value!.title]),
          confirm: async () => {
            close()
            try {
              await $fetch('/api/links/delete', {
                method: 'POST',
                body: { id: link.value?.id },
              })
              await linkStore.loadLinks()
            } catch (error) {
              alertPopupStore.show(
                {
                  content: getRequestErrorMessage(error, t('unexpectedError')),
                },
                t
              )
            }
          },
        },
        t
      )
    },
  },
  {
    id: 'edit',
    icon: EditPen,
    func: () => {
      close()
      addPopupStore.show({ ...link.value! })
    },
  },
  {
    id: 'right',
    icon: ArrowRight,
    func: () => move('right'),
  },
]
</script>

<style lang="scss">
#link-toolbar {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > * {
    pointer-events: initial;
  }

  > .toolbar {
    position: absolute;
    background-color: white;
    left: 50%;
    border-radius: 8px;
    box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s all;
    bottom: 25px;

    @media (max-width: 800px) {
      bottom: initial;
      top: 25px;
    }

    opacity: 1;
    transform: translateX(-50%) translateY(0);
    &.hide {
      opacity: 0;
      transform: translateX(-50%) translateY(-50px);
    }

    > .action {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 7px 5px;
      font-size: 24px;
      cursor: pointer;
      transition: 0.2s all;

      &:hover {
        transform: scale(1.3);
      }

      > * {
        color: #909399;
      }
      > .red {
        color: #f56c6c;
      }
    }
  }

  > .background {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
</style>
