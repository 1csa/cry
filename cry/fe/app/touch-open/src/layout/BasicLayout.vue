<template>
  <a-layout class="layout-wrap">
    <a-layout-sider
      class="sider-container"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <router-link class="app-logo" to="/">
        <img class="logo" :src="STATE.logo" fit="cover" />
        <h1 class="title" v-if="!collapsed">{{ STATE.title }}</h1>
      </router-link>
      <a-menu
        :selectedKeys="STATE.selectedKeys"
        v-model:openKeys="STATE.openKeys"
        theme="dark"
        mode="inline"
        @select="handleSelectMenu"
        @click="handleClickMenu"
      >
        <template v-for="route of routerList">
          <Menus :route="route" v-if="route.path !== '/'" />
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout class="right-container" :style="{ marginLeft: collapsed ? '80px' : '200px' }">
      <a-layout-header
        class="header-container"
        :class="{ 'header-container__collapsed': collapsed }"
      >
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-alert :message="alertValue.message" :type="alertValue.type" closable />
        <user :name="STATE.name" :avatar="STATE.avatar" :emailAddr="STATE.emailAddr" />
      </a-layout-header>
      <a-layout-content id="content-container">
        <a-breadcrumb :routes="breadcrumb" style="margin-bottom: 10px">
          <template #itemRender="{ route, paths, routes }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.name }}
            </span>
            <router-link v-else :to="route.path">
              {{ route.name }}
            </router-link>
          </template>
        </a-breadcrumb>
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.meta.path" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute, type RouteRecordName, type RouteRecordRaw } from 'vue-router';
import appConfig from '../config/app.config';
import User from './User.vue';
import Menus from './Menus.vue';
import { useUserStore } from '@/store/moudles/user';
import { useKeepAliveStore } from '@/store/moudles/keepAlive';
import useReloadPage from '@/composables/useReloadPage';
useReloadPage();

type Key = string;

interface SelectEventHandler {
  key: Key;
  selectedKeys: Key[];
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const keepAliveStore = useKeepAliveStore();
const env = import.meta.env.VITE_APP_ENV;
const collapsed = ref<boolean>(false);

interface StateType {
  title: string;
  logo: string | undefined;
  selectedKeys: (RouteRecordName | null | undefined)[];
  openKeys: string[];
  name: string;
  avatar: string;
  emailAddr: string;
}
const STATE = reactive<StateType>({
  title: appConfig.appName,
  logo: appConfig.logo,
  selectedKeys: [''],
  openKeys: [],
  name: '',
  avatar: '',
  emailAddr: '',
});
const routerList = router.options.routes;
const cacheList = computed(() => {
  // return getRouteList(routerList)
  //   .filter((item: { meta: { notCache: any } }) => !(item.meta && item.meta.notCache))
  //   .map((item: { name: any }) => item.name);
  return keepAliveStore.getCaches.join(',');
});

const breadcrumb = computed(() => {
  const arr: any[] = [];
  route.matched.map((_route) => {
    arr.push({
      name: _route.meta.title,
      path: _route.path,
    });
  });
  return arr;
});

const alertValue = computed(() => {
  const envMap = {
    dev: '开发',
    test: '测试',
    pretest: '预发',
    prod: '正式',
  };
  let val = {
    message: `当前环境为${envMap[env as keyof typeof envMap]}环境${
      env === 'prod' || env === 'pretest' ? '，请谨慎操作' : ''
    }`,
    type: env === 'prod' || env === 'pretest' ? 'warning' : 'success',
  };
  return val;
});

const handleSelectMenu = ({ selectedKeys }: SelectEventHandler) => {
  STATE.selectedKeys = selectedKeys;
};

const handleClickMenu = ({ key }: { key: Key }) => {
  router.push({ name: key });
};

onMounted(async () => {
  STATE.selectedKeys = [route.name];
  STATE.openKeys = [route.path.split('/')[1]];
  const { name, avatar, email } = userStore.userInfo;
  STATE.name = name;
  STATE.avatar = avatar;
  STATE.emailAddr = email;
});
</script>
<style lang="less" scoped>
.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;
  height: 64px;
}

.logo {
  width: 30px;
  height: 30px;
}

.title {
  display: inline-block;
  font-size: 16px;
  margin-left: 12px;
  color: #ffffff;
  margin-bottom: 0;
}

.trigger {
  font-size: 18px;
}
</style>
