import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import plugin from './plugin'
Vue.use(plugin)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//全局注册表格组件
import AppTable from "./components/AppTable"
Vue.component("AppTable", AppTable)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
