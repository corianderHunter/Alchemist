import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import './router/guards'
import store from './store'
import ElementUI from 'element-ui';
import echarts from 'echarts';

import '@/assets/style/normalize.scss';
import '@/assets/style/element-cover.scss';
import '@/assets/style/main.scss';
import '@/assets/iconfont/iconfont.css';
import fetch from './helper/fetch'
import { buildApis } from './apis'
import { fetchConfig } from './apis/config'
import { ABANDON_MARK } from './helper/fetch/fetchDebounce'


Vue.use(ElementUI)

const apis = buildApis(fetchConfig, fetch);
Vue.prototype.$api = apis;

const $eventBus = new Vue();
Vue.prototype.$eventBus = $eventBus;

Vue.prototype.$echarts = echarts;

Vue.config.errorHandler = function (error: any) {
  if (error?.mark === ABANDON_MARK) {
    console.log(`请求：${error?.url} 过渡调用,已丢弃。`)
  }
  console.error(error)
}

new Vue({
  router,
  store,
  render: h => h(App),

}).$mount('#app')
