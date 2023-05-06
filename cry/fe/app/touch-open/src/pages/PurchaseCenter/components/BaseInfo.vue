<!-- 选择商品弹窗 -->
<template>
  <a-descriptions title="基本信息" v-if="type === 'readonly'">
    <template>
      <a-descriptions-item label="采购单号">{{
        purchaseStatusFilter(detailInfo.status)
      }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ detailInfo.related_order_id }}</a-descriptions-item>
      <a-descriptions-item label="采购类型">{{ detailInfo.create_time }}</a-descriptions-item>
      <a-descriptions-item label="结算方式">{{
        purchaseStatusFilter(detailInfo.status)
      }}</a-descriptions-item>
      <a-descriptions-item label="采购费用">{{ detailInfo.related_order_id }}</a-descriptions-item>
      <a-descriptions-item label="备注">{{ detailInfo.create_time }}</a-descriptions-item>
      <a-descriptions-item label="制单人">{{
        purchaseStatusFilter(detailInfo.status)
      }}</a-descriptions-item>
      <a-descriptions-item label="制单时间">{{ detailInfo.related_order_id }}</a-descriptions-item>
    </template>
  </a-descriptions>
  <template v-else>
    <a-descriptions title="基本信息" v-if="type === 'readonly'"></a-descriptions>
    <a-form v-bind="layout" layout="inline">
      <a-form-item label="采购类型" name="name" v-bind="validateInfos.name">
        <a-select
          v-model:value="modelRef.name"
          style="width: 160px"
          :options="PURCHASE_TYPE_OPTIONS"
          placeholder="请选择"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="结算方式" name="name" v-bind="validateInfos.name">
        <a-select
          v-model:value="modelRef.name"
          style="width: 160px"
          :options="CLOSE_TYPE_OPTIONS"
          placeholder="请选择"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea
          v-model:value="modelRef.customReason"
          style="width: 500px"
          placeholder="请输入备注"
          :rows="4"
        />
      </a-form-item>
    </a-form>
  </template>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import {
  PURCHASE_STATUS_OPTIONS,
  purchaseStatusFilter,
  PURCHASE_TYPE_OPTIONS,
  CLOSE_TYPE_OPTIONS,
} from '@/constants/purchase';
import { Form } from 'ant-design-vue';

const props = defineProps({
  type: {
    type: String,
    default: 'create',
  },
  detailInfo: {
    type: Object,
    default: () => {},
  },
});
const useForm = Form.useForm;
const layout = reactive({
  labelCol: { span: 12 },
});

const modelRef = reactive({
  reason: '',
  name: '',
  customReason: '',
});
const rulesRef = computed(() => ({
  name: [
    {
      required: true,
      message: '请选择商品报损原因！',
    },
  ],
  reason: [
    {
      required: true,
      message: '请输入自定义原因!',
    },
  ],
}));

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
</script>
