<template>
  <div>
    <generic-menu :menu="menu"></generic-menu>
    <div data-testid="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import GenericMenu from '../../GenericMenu.vue';
export default Vue.extend({
  components: {
    GenericMenu,
  },
  props: ['menu'],
});
</script>
