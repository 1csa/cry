<template>
  <a-descriptions title="物流信息">
    <template #extra>
      <a-button type="primary" @click="handleAdd">新增物流信息</a-button>
      <a-button type="link" @click="handleValidate">校验</a-button>
    </template>
  </a-descriptions>
  <a-form ref="formRef" :model="modelValue">
    <a-space
      v-for="(list, index) in modelValue.logList"
      :key="list.id"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <a-form-item :name="['logList', index, 'no']" label="物流单号" :rules="rules">
        <a-input v-model:value="list.no" :maxlength="50" placeholder="物流单号" />
      </a-form-item>
      <a-form-item :name="['logList', index, 'fee']" label="物流费用" :rules="rules">
        <a-input v-model:value="list.fee" type="number" :maxlength="20" placeholder="物流费用" />
      </a-form-item>
      <MinusCircleOutlined @click="handleRemove(list)" />
    </a-space>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, toRefs } from 'vue';
import { MinusCircleOutlined } from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';
import { LogisticsInfoType } from '@/types/purchase/purchase';
import { defaultLogisticsInfo } from '@/types/purchase/purchase.config';

interface Props {
  modelValue: {
    logList: LogisticsInfoType[];
  };
  type: 'readonly' | 'edit' | 'create' | 'copy';
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const { modelValue, type } = toRefs(props);

const formRef = ref();
const rules = ref([
  {
    required: true,
    message: '必填',
    trigger: 'change',
  },
]);

const handleValidate = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log(toRaw(props.modelValue));
    })
    .catch((err: any) => {
      console.log('error', err);
    });
};

const handleAdd = () => {
  const newValue = reactive(props.modelValue);
  const newData = Object.assign({}, defaultLogisticsInfo);
  newData.id = newValue.logList.length + 1;
  newValue.logList.push(newData);
  // console.log('🚀 ~ file: LogisticsInfo.vue ~ line 82 ~ handleAdd ~ newValue.logList', newData);
  emit('update:modelValue', toRaw(newValue));
};

for (let i = 0; i < 3; i++) {
  handleAdd();
}

const handleRemove = (item: LogisticsInfoType) => {
  const newValue = reactive(props.modelValue);
  let idx = newValue.logList.indexOf(item);
  if (idx !== -1) {
    newValue.logList.splice(idx, 1);
  }
  emit('update:modelValue', toRaw(newValue));
};

defineExpose({
  handleValidate
});
</script>
