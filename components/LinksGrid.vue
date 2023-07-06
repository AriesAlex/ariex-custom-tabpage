<template>
  <div
    id="links"
    ref="root"
    :style="{
      '--background-color': settings.dockPanelColor,
      '--text-color': settings.dockPanelTextColor,
      '--columns-count': columnsCount,
      '--space-per-links': isFull ? '' : spacePerLinks + 'px',
    }"
  >
    <div class="grid" ref="grid">
      <a
        class="link"
        :class="{ active: currentLink && currentLink.id == link.id }"
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
import { useLinksStore } from '@/stores/links'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { Plus } from '@element-plus/icons-vue'
import Link from '@/interfaces/Link'
import { useDebounceFn } from '@vueuse/shared'
const { t } = useI18n()

const emit = defineEmits(['recalculate', 'add'])

const isFull = useIsFull()

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const linkStore = useLinksStore()
const { links } = storeToRefs(linkStore)

const gap = ref(15)
const linkWidth = ref(58)
const columnsCount = ref(0)
const spacePerLinks = ref(0)
const currentLink = ref<Link | null>(null)

const addLink: ComputedRef<Link> = computed(() => ({
  title: t('newLink'),
  meta: 'add',
}))

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
  if (process.server) return
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
const debouncedRecalculate = useDebounceFn(recalcuate)
useWindowEvent(
  'resize',
  () => {
    recalcuate()
    debouncedRecalculate()
  },
  true
)
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
  max-width: 1200px;
  padding: 0 30px;

  @media (max-width: 800px) {
    align-items: flex-end;
    max-width: initial;
  }

  > .grid {
    background: var(--background-color);
    background-size: cover;
    background-position: center;
    box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
    border-radius: 8px;
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(var(--columns-count), 1fr);
    width: var(--space-per-links);

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
      color: var(--text-color);

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
        overflow-wrap: anywhere;
        text-wrap: balance;
      }

      > .el-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
