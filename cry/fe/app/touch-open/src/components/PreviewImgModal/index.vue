<template>
  <div v-if="src">
    <img :src="src" alt="缩略图" class="cover-img-wrap" :class="size" @click="handlePreview" />
    <a-modal v-model:visible="previewInfo.visible" :footer="null" @cancel="handleCancel">
      <img
        v-if="previewInfo.previewImage"
        alt="img"
        class="preview-image"
        :src="previewInfo.previewImage"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
interface Props {
  src: string;
  size?: string;
}
const props = defineProps<Props>();

const previewInfo = reactive({
  visible: false,
  previewImage: '',
});
const handlePreview = () => {
  previewInfo.visible = true;
  previewInfo.previewImage = props.src || '';
};
const handleCancel = () => {
  previewInfo.visible = false;
};
</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
  max-height: 60px;
  object-fit: contain;
  &.small {
    width: 50px;
    max-height: 60px;
  }
  &.middle {
    width: 150px;
    max-height: 150px;
  }
  &.large {
    width: 200px;
    max-height: 200px;
  }
}

.preview-image {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>
