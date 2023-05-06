<template>
 <a-dropdown>
    <div class="user-info" @click.prevent>
      <a-avatar :src="avatar || STATE.DEFAULT_AVATAR" :alt="`${name}'s avatar`"></a-avatar>
      <span class="user-name">{{ name|| '吴慧敏' }}</span>
    </div>
    <template #overlay>
      <a-menu>
      <a-menu-item key="0">
        <MailOutlined />
        <span>{{ emailAddr }}</span>
      </a-menu-item>
      <a-menu-item key="1">
        <RollbackOutlined />
        <span><a class="link" href="/">返回pandora工具平台</a></span>
      </a-menu-item>
    </a-menu>
    </template>

  </a-dropdown>

</template>

<script lang="ts" setup>
 import {reactive} from 'vue'
 import {
  MailOutlined,
  RollbackOutlined
} from '@ant-design/icons-vue';
import appConfig from '@/config/app.config';
const props = defineProps({
  name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    emailAddr: {
      type: String,
    },
})

const STATE = reactive({
  DEFAULT_AVATAR: appConfig.miscellaneous.defaultAvatar,
})

</script>

<style lang='less' scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 12px;
}


</style>
