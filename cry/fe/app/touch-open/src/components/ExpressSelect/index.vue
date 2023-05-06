<template>
  <div v-if="visible">
    <a-modal title="选择快递" :visible="visible" @ok="handleConfirm" @cancel="handleCancel">
      <a-form v-bind="layout">
        <a-form-item label="快递商家" v-bind="validateInfos.expressMerchant">
          <a-select
            v-model:value="modelRef.expressMerchant"
            style="width: 200px"
            :options="EXPRESS_OPTIONS"
            placeholder="请选择"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="快递费"
          v-bind="validateInfos.fee"
          v-if="modelRef.expressMerchant === 3"
        >
          <a-input-number v-model:value="modelRef.fee" :step="0.01" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, toRaw, computed } from 'vue';
import { Form } from 'ant-design-vue';
interface Props {
  visible: Boolean;
  type?: String;
}
const props = defineProps<Props>();
const emits = defineEmits(['update:visible', 'selected']);

const { visible } = toRefs(props);
const useForm = Form.useForm;

const EXPRESS_OPTIONS = [
  {
    label: '顺丰',
    value: 1,
  },
  {
    label: '京东快递',
    value: 2,
  },
  {
    label: '大宗货品',
    value: 3,
  },
];

const layout = reactive({
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
});

const modelRef = reactive({
  expressMerchant: null,
  fee: null,
});

const rulesRef = computed(() => {
  if (modelRef.expressMerchant !== 3) {
    return {
      expressMerchant: [
        {
          required: true,
          message: '请选择快递商家',
        },
      ],
    };
  }
  return {
    expressMerchant: [
      {
        required: true,
        message: '请选择快递商家',
      },
    ],
    fee: [
      {
        required: true,
        message: '请填写快递费用',
      },
    ],
  };
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleCancel = () => {
  resetFields();
  emits('update:visible', false);
};

const handleConfirm = () => {
  validate().then(() => {
    const { expressMerchant, fee } = toRaw(modelRef);
    emits('selected', expressMerchant, fee);
    resetFields();
  });
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
