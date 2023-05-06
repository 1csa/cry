<template>
  <div id="app">
    <page></page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from './components/Page/index.vue';
import { fetchCurrentUser } from './services/user';

async function isUserLogged(): Promise<boolean> {
  return (await fetchCurrentUser()).status === 'success';
}

function redirectToLogin() {
  const loginUrl = '//pandora.yidian-inc.com/tools/admin/login';
  const cbUrl = location.href;
  location.href = `${loginUrl}?callback=${cbUrl}`;
}

@Component({
  components: {
    Page,
  },
  async mounted() {
    if (!(await isUserLogged())) {
      redirectToLogin();
    }
  },
})
export default class App extends Vue {}
</script>

<style></style>
