import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import Clipboard from './plugins/clipboard';
import DownloadFile from './plugins/DownloadFile';
import 'ant-design-vue/dist/antd.css';
import router from '@/router/index';
import permission from '@/router/permission';
import { setupStore } from './store';
import './global.less';

(async () => {
  const app = createApp(App);
  setupStore(app);
  permission();
  app.use(Antd).use(router).use(Clipboard).use(DownloadFile).mount('#app');
})();
