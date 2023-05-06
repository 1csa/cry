<template>
  <a-modal
    v-model:visible="visible"
    title="打印条形码"
    width="400px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-row :gutter="[20, 20]">
      <a-col><span class="modal-h1">条形码:</span></a-col>
      <a-col>
        {{ goodsInfo.sku }}
      </a-col>
    </a-row>
    <a-row :gutter="[20, 20]">
      <a-col><span class="modal-h1">打印数量:</span></a-col>
      <a-col>
        <a-input-number v-model:value="printNum" :min="1" />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message, Modal } from 'ant-design-vue';

const props = defineProps({
  goodsInfo: {
    type: Object,
    default: '',
  },
  visible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['success', 'cancel', 'update:visible']);

const printNum = ref(1);

const handleSubmit = () => {
  message.warning('功能开发中!');
  onModalClose();
  // emit('success');
};

// 弹窗关闭
const onModalClose = () => {
  printNum.value = 1;
  emit('update:visible', false);
};
</script>

<style lang="less" scoped>
.ant-row {
  margin-bottom: 10px;
}
</style>
