<template>
  <div class="popup-base" :class="{ show }">
    <div class="blackout" @click="close" />

    <div class="popup">
      <div class="header">
        <div class="title oneline">{{ title }}</div>
        <div class="close" @click="close">
          <i class="el-icon-close" />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['show', 'title'],
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
.popup-base {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  z-index: 2;
  pointer-events: none;
  &.show {
    pointer-events: initial;
    > .blackout {
      opacity: 1;
    }
    > .popup {
      transform: scaleX(1);
      box-shadow: 0 5px 15px 0px rgba(100, 100, 100, 0.5);
    }
  }
  > .blackout {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    transition: 0.25 all;
    opacity: 0;
  }
  > .popup {
    background-color: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 5px 15px 0px rgba(100, 100, 100, 0);
    display: flex;
    flex-direction: column;
    font-weight: 300;
    font-size: 15px;
    transition: 0.25s all;
    transform: scaleX(0);
    > .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      > .title {
        font-size: 17px;
      }
      > .close {
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        cursor: pointer;
        margin-left: 15px;
        font-size: 18px;
      }
    }
  }
}
</style>
