<template>
  <div>
    <app-logo :isFolded="isFolded"></app-logo>
    <a-menu
      :selectedKeys="selectedKeys"
      class="menu"
      mode="inline"
      theme="dark"
      :inlineCollapsed="isFolded"
    >
      <template v-for="(item, index) in menu">
        <a-menu-item v-if="!item.subItems" :key="index">
          <router-link :to="item.path">
            <menu-content :icon="item.icon" :name="item.name"></menu-content>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else>
          <span slot="title">
            <menu-content :icon="item.icon" :name="item.name"></menu-content>
          </span>
          <a-menu-item v-for="subItem in item.subItems" :key="index">
            <router-link :to="subItem.path">
              <menu-content :icon="subItem.icon" :name="subItem.name"></menu-content>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue/types/options';
import { Menu } from './types';
import MenuContent from './MenuContent.vue';
import AppLogo from './AppLogo.vue';

export default Vue.extend({
  components: {
    MenuContent,
    AppLogo,
  },
  props: {
    menu: {
      type: Array as Prop<Menu>,
    },
    isFolded: {
      type: Boolean,
    },
  },
  computed: {
    selectedKeys: {
      get() {
        if (this.$route.path.includes('sign-in')) {
          return [1];
        } else if (this.$route.path.includes('invitation')) {
          return [2];
        } else if (this.$route.path.includes('lottery')) {
          return [3];
        } else if (this.$route.path.includes('withdraw')) {
          return [4];
        } else {
          return [0];
        }
      },
    },
  },
});
</script>

<style lang="less" scoped>
.menu {
  border: none;
}
</style>
