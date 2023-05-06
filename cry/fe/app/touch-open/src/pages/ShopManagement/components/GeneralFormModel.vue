<!-- 创建员工弹窗 -->
<template>
  <a-modal
    :visible="true"
    :closable="true"
    :title="readonly ? `${title}详情` : `创建${title}`"
    width="500px"
    :destroyOnClose="false"
    okText="确定"
    :footer="readonly ? null : undefined"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <template #footer>
      <template v-if="!readonly">
        <a-button key="back" @click="onModalClose">取消</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-form v-bind="layout">
      <template v-for="(field, key) in FORMDATA" :key="key">
        <BaseFormItem
          :field="(field as FieldType)"
          :modelRef="modelRef"
          :fieldkey="(key as unknown as string)"
          :validateInfos="validateInfos"
          :readonly="readonly"
        />
      </template>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { FieldType } from '@/components/BaseFormItem/index-v2.vue';
import { reactive, ref, computed, toRaw } from 'vue';
import { message, Form } from 'ant-design-vue';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index-v2.vue';

interface Props {
  title?: string;
  info?: any;
  formData?: any;
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'cancel']);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
});

const readonly = computed(() => {
  return !(JSON.stringify(props.info) === '{}' || props.info === undefined);
});

const FORMDATA = props.formData();

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA as any);

readonly.value && Object.assign(modelRef, props.info);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleSubmit = async () => {
  try {
    await validate();
    emit('success', toRaw(modelRef));
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
