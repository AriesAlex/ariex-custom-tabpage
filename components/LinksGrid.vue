<template>
  <div id="links" ref="root">
    <div
      class="grid"
      ref="grid"
      :style="{
        'grid-template-columns': `repeat(${columnsCount}, 1fr)`,
        width: `${spacePerLinks}px`,
      }"
    >
      <a
        class="link"
        :class="{ active: currentLink && currentLink.id == link.id }"
        :style="{ width: linkWidth + 'px' }"
        v-for="link in [...links, addLink]"
        :key="link.url"
        :href="link.url"
        @click="click(link, $event)"
        @contextmenu.prevent="edit(link)"
      >
        <ElIcon v-if="link.meta == 'add'"><Plus /></ElIcon>
        <div
          class="image"
          :style="{ backgroundImage: `url(${link.icon})` }"
          v-else
        />
        <div class="title">{{ link.title }}</div>
      </a>
    </div>
    <LinkToolbar :link="currentLink" @close="currentLink = null" />
  </div>
</template>

<script setup lang="ts">
import { useLinkStore } from '@/stores/link'
import { storeToRefs } from 'pinia'
import { Plus } from '@element-plus/icons-vue'
import Link from '@/interfaces/Link'
import { useDebounceFn, useThrottleFn } from '@vueuse/shared'

const emit = defineEmits(['recalculate', 'add'])

const linkStore = useLinkStore()
const { links } = storeToRefs(linkStore)

const gap = ref(15)
const linkWidth = ref(48)
const columnsCount = ref(0)
const spacePerLinks = ref(0)
const currentLink = ref<Link | null>(null)

const addLink: Link = { title: 'Новая ссылка', meta: 'add' }

const root = ref<InstanceType<typeof HTMLElement> | null>(null)

function click(link: Link, e: MouseEvent) {
  if (e.button == 2) return
  if (link.url) {
    window.location.replace(link.url)
    e.preventDefault()
  }
  if (link.meta == 'add') emit('add')
}

function edit(link: Link) {
  if (link.meta) return
  currentLink.value = link
}

function updateCookie(fullWidth: number) {
  useCookie('lastFullWidth', {
    maxAge: Number.MAX_SAFE_INTEGER,
  }).value = String(fullWidth)
}
const updateCookieDebounced = useDebounceFn(updateCookie)
async function recalcuate() {
  let fullWidth = 800

  if (!root.value && useCookie('lastFullWidth').value)
    fullWidth = Number(useCookie('lastFullWidth').value)

  if (root.value) fullWidth = root.value.getBoundingClientRect().width

  updateCookieDebounced(fullWidth)

  const linksCount = links.value.length + 1
  const spacePerLink = linkWidth.value + gap.value * 2
  let newColumnsCount = Math.round(fullWidth / spacePerLink)
  if (newColumnsCount > linksCount) newColumnsCount = linksCount

  columnsCount.value = newColumnsCount
  spacePerLinks.value =
    spacePerLink * (linksCount > newColumnsCount ? newColumnsCount : linksCount)

  emit('recalculate')
}
useWindowEvent('resize', recalcuate, true)
recalcuate()
watch(
  () => links.value.length,
  () => nextTick(() => recalcuate())
)
</script>

<style lang="scss" scoped>
#links {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50%;

  @media (max-width: 800px) {
    align-items: flex-end;
    max-width: initial;
  }

  > .grid {
    box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    padding: 15px;
    display: grid;

    > .link {
      display: block;
      font-size: 15px;
      padding: 5px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: 0.2s all;
      border: solid 1px transparent;
      text-decoration: none;
      color: black;

      &:active {
        transform: scale(1.1);
      }

      &.active {
        border: solid 1px #ccc;
      }

      > .image {
        margin-bottom: 5px;
        width: 32px;
        height: 32px;
        background-size: cover;
        background-position: center;
      }

      > .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      > .el-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
