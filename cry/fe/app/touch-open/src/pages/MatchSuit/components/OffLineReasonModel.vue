<!-- 下架原因弹窗 -->
<template>
  <a-modal
    :visible="true"
    :closable="false"
    width="500px"
    :destroyOnClose="true"
    okText="下架"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form layout="vertical" hideRequiredMark>
      <a-form-item label="请填写下架原因" v-bind="validateInfos.reason">
        <a-textarea v-model:value.trim="modelRef.reason" placeholder="请输入下架原因" :rows="6" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { message, Form } from 'ant-design-vue';
import { shiftSuit } from '@/services/matchSuit';
import { shiftShopSuit } from '@/services/shop';

interface Props {
  ids: string[] | [];
  shopId?: number;
}

interface FormState {
  reason: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'cancel']);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
});

const modelRef = reactive<FormState>({
  reason: '',
});

const rulesRef = computed(() => ({
  reason: [
    {
      required: true,
      message: '请输入下架原因!',
    },
  ],
}));

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleSubmit = async () => {
  try {
    await validate();
    if (props.shopId) {
      // 门店下架
      const params = {
        suit_list: props.ids,
        op_type: 2,
        reason: modelRef.reason,
        shop_id: props.shopId,
      };
      await shiftShopSuit(params);
    } else {
      const params = {
        ids: props.ids,
        action: 'off',
        reason: modelRef.reason,
      };
      await shiftSuit(params);
    }
    message.success('下架成功!');
    emit('success');
    onModalClose();
  } catch (error) {
    console.log('error', error);
  }
};

const onModalClose = () => {
  resetFields();
  emit('cancel');
};
</script>
