import Vue from 'vue'
import App from './App.vue'

const isDev = process.env.NODE_ENV == 'development'

import 'element-ui/lib/theme-chalk/index.css'
import { Button, Input, Icon } from 'element-ui'
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Icon.name, Icon)

import VueEvents from 'vue-events'
Vue.use(VueEvents)

import WindowEvents from '@/mixins/WindowEvents'
Vue.mixin(WindowEvents)

import axios from 'axios'
Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: isDev ? 'http://192.168.0.200:4554/' : '/',
    })
  },
})

import store from './store'
Vue.use({
  install(Vue) {
    Vue.prototype.$store = new Vue(store)
  },
})

Vue.mixin({
  computed: {
    $full() {
      return this.$store.isFull
    },
  },
})

new Vue({
  render: h => h(App),
}).$mount('#app')
