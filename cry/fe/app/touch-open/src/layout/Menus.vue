<template>
  <!-- 如果存在子路由 -->
  <template v-if="route?.children">
    <a-sub-menu :key="route.name" :title="route.meta?.title || '未命名'">
      <template #icon>
        <component :is="route.meta?.icon"></component>
      </template>
      <template v-for="children of route.children">
        <template v-if="!(children.meta?.isMenu === false)">
          <!-- 递归 -->
          <Menus :route="children" />
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="route?.name">
      <template #icon>
        <component :is="route?.meta?.icon"></component>
      </template>
      <span class="nav-text"> {{ route?.meta?.title || '未命名' }} </span>
    </a-menu-item>
  </template>
</template>
<script lang="ts">
import { toRefs, defineComponent, PropType } from 'vue';
import {
  SkinOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  GiftOutlined,
  ToolOutlined,
  ShoppingOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { RouteRecordRaw } from 'vue-router';

interface RouteMenusProps {
  route: RouteRecordRaw;
}
export default defineComponent({
  components: {
    SkinOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined,
    GiftOutlined,
    ToolOutlined,
    ShoppingOutlined,
    ShopOutlined,
    UserOutlined,
  },
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw>,
      value: {},
    },
  },

  setup(props) {
    // 暴露给模板和 API 钩子的其他选项
    return {
      ...toRefs(props),
    };
  },
});
</script>
