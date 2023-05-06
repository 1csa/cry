<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useConfigStore } from '@/store/moudles/config'
const userStore = useConfigStore()
userStore.fetchCityList()
const locale = zhCN;

</script>

<style></style>
