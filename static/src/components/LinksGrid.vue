<template>
  <div
    id="links"
    ref="root"
    :style="{
      alignItems: $full ? 'center' : 'flex-end',
      maxWidth: $full ? '50%' : 'initial',
      mobile: !$full,
    }"
  >
    <div
      class="grid"
      ref="grid"
      :style="{
        'grid-template-columns': `repeat(${columnsCount}, 1fr)`,
        width: `${spacePerLinks}px`,
      }"
    >
      <div
        class="link"
        :class="{ active: currentLink && currentLink.id == link.id }"
        :style="{ width: linkWidth + 'px' }"
        v-for="link in [...$store.links, addLink]"
        :key="link.url"
        @click="click(link)"
        @contextmenu.prevent="edit(link)"
      >
        <i v-if="link.meta == 'add'" class="el-icon-plus" />
        <div
          class="image"
          :style="{ backgroundImage: `url(${link.icon})` }"
          v-else
        />
        <div class="title">{{ link.title }}</div>
      </div>
    </div>
    <LinkToolbar :link="currentLink" @close="currentLink = null" />
  </div>
</template>

<script>
import LinkToolbar from '@/components/LinkToolbar.vue'
export default {
  components: { LinkToolbar },
  data() {
    return {
      gap: 15,
      linkWidth: 48,
      columnsCount: 0,
      spacePerLinks: 0,
      currentLink: null,
      window,
    }
  },
  mounted() {
    this.recalcuate()
  },
  methods: {
    recalcuate() {
      const { linkWidth, gap } = this
      const fullWidth = this.$refs.root.getBoundingClientRect().width
      const linksCount = this.$store.links.length + 1

      const spacePerLink = linkWidth + gap * 2
      let columnsCount = Math.round(fullWidth / spacePerLink)
      if (columnsCount > linksCount) columnsCount = linksCount

      this.columnsCount = columnsCount
      this.spacePerLinks =
        spacePerLink * (linksCount > columnsCount ? columnsCount : linksCount)

      this.$nextTick(() => this.$emit('recalculate'))
    },
    click(link) {
      if (link.url) window.location.replace(link.url)
      if (link.meta == 'add') this.$emit('add')
    },
    edit(link) {
      if (link.meta) return
      this.currentLink = link
    },
    _resize() {
      this.recalcuate()
    },
  },
  watch: {
    '$store.links.length': {
      handler() {
        this.$nextTick(() => this.recalcuate())
      },
    },
  },
  computed: {
    addLink() {
      return { title: 'Новая ссылка', meta: 'add' }
    },
  },
}
</script>

<style lang="scss">
#links {
  width: 100%;
  display: flex;
  justify-content: center;

  > .grid {
    box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    padding: 15px;
    display: grid;

    > .link {
      font-size: 15px;
      padding: 5px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: 0.2s all;
      border: solid 1px transparent;

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

      > .el-icon-plus {
        font-size: 24px;
      }
    }
  }
}
</style>
