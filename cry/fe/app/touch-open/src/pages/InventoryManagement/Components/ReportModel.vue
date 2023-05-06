<!-- 上报确认弹窗 -->
<template>
  <a-modal :visible="true" :closable="false" width="400px" :destroyOnClose="true" okText="上报"
    @ok="handleSubmit" @cancel="onModalClose">
    <a-form v-bind="layout">
      <a-form-item label="商品报损原因" v-bind="validateInfos.reason">
        <a-select v-model:value="modelRef.reason" :options="reasonOptions"></a-select>
      </a-form-item>
      <a-form-item v-if="modelRef.reason === '自定义'" label="自定义原因" v-bind="validateInfos.customReason">
        <a-textarea v-model:value.trim="modelRef.customReason" placeholder="请输入自定义原因" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';
import type { ListOptionType } from '@/services/inwarehouse';
import { reactive, ref, computed } from 'vue';
import { REPORT_REASON_OPTIONS } from '../../../constants/inventor';
import { message, Form } from 'ant-design-vue';
import { confirmInboundRequest } from '@/services/inwarehouse';

interface Props {
  info: ListOptionType;
}

interface FormState {
  reason: string;
  customReason?: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'cancel']);

const reasonOptions = ref<SelectProps['options']>(REPORT_REASON_OPTIONS);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
})

const modelRef = reactive<FormState>({
  reason: '',
  customReason: '',
});

const rulesRef = computed(() => ({
  reason: [
    {
      required: true,
      message: '请选择商品报损原因！',
    },
  ],
  customReason: [
    {
      required: modelRef.reason === '自定义',
      message: '请输入自定义原因!',
    },
  ]
}));

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleSubmit = async () => {
  try {
    await validate();
    const params = {
      id: props.info.id,
      status: '2',
      reason: modelRef.reason === '自定义' ? modelRef.customReason : modelRef.reason
    };
    await confirmInboundRequest(params);
    message.success('上报成功!');
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
