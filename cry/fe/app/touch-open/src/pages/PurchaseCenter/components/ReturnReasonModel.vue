<!-- 下架原因弹窗 -->
<template>
  <a-modal
    :visible="true"
    :closable="false"
    width="500px"
    :destroyOnClose="true"
    okText="确定"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form>
      <a-form-item label="物流费" v-bind="validateInfos.yuan" style="margin-bottom: 20px">
        <a-input-number v-model:value="modelRef.yuan" placeholder="请输入" /> 元
      </a-form-item>
      <a-form-item label="原因" v-bind="validateInfos.reason">
        <a-input v-model:value="modelRef.reason" placeholder="请输入下架原因" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { message, Form } from 'ant-design-vue';
import { shiftSuit } from '@/services/matchSuit';

interface Props {
  ids: string[] | [];
}

interface FormState {
  yuan: number;
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
  yuan: 0,
  reason: '',
});

const rulesRef = computed(() => ({
  yuan: [
    {
      required: true,
      message: '请输入物流费!',
    },
  ],
  reason: [
    {
      required: true,
      message: '请输入退货原因!',
    },
  ],
}));

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleSubmit = async () => {
  try {
    await validate();
    const params = {
      ids: props.ids,
      yuan: modelRef.yuan,
      reason: modelRef.reason,
    };
    await shiftSuit(params);
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
