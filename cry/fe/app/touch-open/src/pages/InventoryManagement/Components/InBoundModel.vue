<!-- 入库弹窗 -->
<template>
  <a-modal :visible="true" :closable="false" width="400px" :destroyOnClose="true" @ok="handleSubmit"
    @cancel="onModalClose" okText="入库">
    <div class="tip">
      请确认商品无误，商品码完整后入库
    </div>
    <!-- <div class="opation-wrapper mt50">
      <a-button @click="onModalClose">取消</a-button>
      <a-button class="copy-btn" @click="handleCopy">复制商品编码</a-button>
      <a-button type="primary" @click="handleSubmit">入库</a-button>
    </div> -->
  </a-modal>
</template>

<script lang="ts" setup>
import type { ListOptionType } from '@/services/inwarehouse';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { confirmInboundRequest } from '@/services/inwarehouse';
import { copyText } from '@/plugins/clipboard';

interface Props {
  info: ListOptionType;
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'cancel']);

const handleSubmit = async () => {
  try {
    Modal.confirm({
      title: '您是否已经完成打印？',
      icon: createVNode(ExclamationCircleOutlined),
      onOk: async () => {
        const params = {
          id: props.info.id,
          status: '20',
        };
        await confirmInboundRequest(params);
        message.success('入库成功!');
        emit('success');
        onModalClose();
      },
      onCancel() {
        return new Promise((resolve, reject) => {
          resolve('close')
        })
      }
    });
  } catch (error: any) {
    message.warning(error.msg)
  }
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};

// 复制商品编码
const handleCopy = () => {
  copyText(props.info.bar_code).then(() => {
    message.success('已复制到您的剪切板!');
  }).catch(() => {
    message.error('复制失败')
  })
}
</script>

<style lang="less" scoped>
.tip {
  font-size: 18px;
  text-align: center;
}
</style>
