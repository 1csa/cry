<template>
  <div>
    <a-card class="cost-management" title="成本管理">
      <a-form class="cost-form">
        <div v-for="item in FORMDATA">
          <div class="group-title">
            {{ item.title }}
          </div>
          <a-row :gutter="24">
            <template v-for="(field, key) in item.group" :key="key">
              <a-col :span="6">
                <BaseFormItem
                  :field="(field as FieldType)"
                  type="edit"
                  :modelRef="modelRef"
                  :fieldkey="key"
                  :validateInfos="validateInfos"
                  :disabled="unableEditFields.indexOf(key) !== -1 || editValue.canEdit"
                />
              </a-col>
            </template>
          </a-row>
        </div>
      </a-form>
      <a-row justify="end" class="bottom-area">
        <a-divider />
        <a-col v-show="editValue.canEdit">
          <a-statistic-countdown
            title="更新间隔时间："
            :value="editValue.deadline"
            @finish="onFinish"
          />
        </a-col>
        <a-col v-show="!editValue.canEdit">可更新</a-col>
        <a-col style="margin-left: 20px">
          <a-button type="primary" :disabled="editValue.canEdit" @click.prevent="onSubmit"
            >保存</a-button
          >
          <a-button style="margin-left: 10px" @click="handleCancle">取消</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CostManagement',
};
</script>
<script lang="ts" setup>
import type { FieldType } from '@/components/BaseFormItem/index.vue';
import type { CostProps } from '@/services/marketingCenter';
import { reactive, createVNode, toRaw, onMounted } from 'vue';
import { message, Form, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import { FORMDATA } from './constants/cost';
import BaseFormItem from '@/components/BaseFormItem/index.vue';
import useFormItemColumns from '@/composables/useFormItemColumns';
import { getCost, updateCost } from '@/services/marketingCenter';
import dayjs from 'dayjs';
import { mul, div, centYuanConvert } from '@/utils/utils';

const unableEditFields = reactive(['spot_goods_num', 'real_time_spot_goods_num']);
const useForm = Form.useForm;
const { modelRef, rulesRef } = useFormItemColumns(FORMDATA);
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const editValue = reactive({
  deadline: 0,
  canEdit: true,
});

const onFinish = () => {
  editValue.canEdit = false;
};
interface FeeFiledType {
  [key: string]: string | object | number;
}

// 过滤表单中元为单位的filed
const feeFiledFn = () => {
  const feeFiledArr: string[] = [];
  FORMDATA.map((item: FeeFiledType) => {
    Object.keys(item.group).forEach((key) => {
      console.log(typeof key);
      item.group[key as keyof typeof item.group]['unit'] === '元' && feeFiledArr.push(key);
    });
  });
  return feeFiledArr;
};

// 价格处理，分转元，元转分
const genPriceFiled = (originFiled: { [x: string]: number }, count: string) => {
  const feeFiled: string[] = feeFiledFn();
  Object.keys(originFiled).forEach((key) => {
    feeFiled.map((item) => {
      if (item == key) {
        // originFiled[key] = centYuanConvert(originFiled[key])
        count === 'mul'
          ? (originFiled[key] = mul(originFiled[key], 100))
          : (originFiled[key] = div(originFiled[key], 100));
      }
    });
  });
};

const fetchCostInfo = async () => {
  const { result } = await getCost();
  if (result) {
    Object.assign(modelRef, result);
    editValue.canEdit = modelRef.cooling_time > 0 ? true : false;
    editValue.deadline = dayjs(result.create_time).add(7, 'day').valueOf();
    genPriceFiled(modelRef, 'div');
  }
};

const sendRequest = (params: CostProps) => {
  const _params = cloneDeep(params);
  delete _params['id'];
  delete _params['create_time'];
  delete _params['cooling_time'];
  // _params.force_update = true; //是否强制更新
  genPriceFiled(_params as any, 'mul');
  return updateCost(_params);
};

const onSubmit = async () => {
  try {
    await validate();
    Modal.confirm({
      title: '请确认是否需要更新',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '更新后7天之内无法更改'),
      okText: '继续',
      onOk: async () => {
        const params = toRaw(modelRef as CostProps);
        const res = await sendRequest(params);
        if (res['code' as keyof typeof res] === 0) {
          message.success(`更新成功`);
          fetchCostInfo();
          return;
        }
      },
      onCancel() {
        return new Promise<void>((resolve, reject) => {
          resolve();
        });
      },
    });
  } catch (error) {
    console.log('error', error);
  }
};

const handleCancle = () => {
  fetchCostInfo();
};

onMounted(() => {
  fetchCostInfo();
});
</script>

<style lang="less" scoped>
.cost-management {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  min-height: calc(100vh - 90px);
}
.cost-form {
  height: calc(100vh - 90px - 180px);
  overflow-y: auto;
}
.group-title {
  overflow: hidden;
  color: #000000;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
.action-btn {
  padding: 0 5px;
}
</style>
<style lang="less">
.cost-management {
  .ant-statistic-title {
    margin-bottom: 0;
  }
  .ant-statistic-title,
  .ant-statistic-content {
    font-size: 14px;
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
  }
}
</style>
