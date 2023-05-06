import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'normalize.css';
import 'ant-design-vue/dist/antd.css';
import VueRouter from 'vue-router';
import { getRoutesFromConfig } from '@/config/app.utils';
import './init-components';
import { fetchCurrentUser } from '@/services/user';

async function main() {
  const { user } = await fetchCurrentUser();

  Vue.prototype.GLOBAL = {
    user,
  };

  Vue.config.productionTip = false;

  Vue.use(Antd);
  Vue.use(VueRouter);
  const router = new VueRouter({
    mode: 'history',
    routes: getRoutesFromConfig(),
  });

  new Vue({
    render: h => h(App),
    router,
  }).$mount('#app');
}

main();
