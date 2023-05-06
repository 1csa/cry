<template>
  <a-descriptions title="货品信息">
    <template #extra>
      <a-button type="primary" @click="handleAddGoods">新增货品</a-button>
      <a-button type="link" @click="onClick">校验</a-button>
    </template>
  </a-descriptions>
  <a-form :model="modelValue">
    <a-table
      rowKey="code"
      :columns="columns"
      :data-source="modelValue.goodsList"
      :pagination="false"
      bordered
    >
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.dataIndex === 'code'">
          {{ type !== 'readonly' ? index + 1 : text }}
        </template>
        <template
          v-if="
            [
              'name',
              'colour_code',
              'cover_img_url',
              'number',
              'size_code',
              'supplier',
              'cost_amount',
            ].includes(column.dataIndex)
          "
        >
          <div>
            <template v-if="type !== 'readonly'">
              <a-form-item v-bind="validateInfos[`goodsList.${index}.${column.dataIndex}`]">
                <a-select
                  v-if="column.type === 'select'"
                  style="width: 100px"
                  v-model:value="record[column.dataIndex]"
                  :options="column.options"
                  placeholder="请选择"
                >
                </a-select>
                <a-input
                  v-if="column.type === 'input'"
                  v-model:value.trim="record[column.dataIndex]"
                  :maxlength="50"
                  placeholder="请输入"
                />
                <a-input-number
                  v-if="column.type === 'number'"
                  v-model:value="record[column.dataIndex]"
                  placeholder="请输入"
                />
                <ImgUpload
                  v-if="column.type === 'img-upload'"
                  v-model="record[column.dataIndex]"
                  :max-length="1"
                />
              </a-form-item>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button
            type="link"
            class="action-btn"
            v-if="type !== 'readonly'"
            @click="handleRemove(record)"
            >移除</a-button
          >
          <template v-else>
            <a-button type="link" class="action-btn" @click="handleRemove(record)">签收</a-button>
            <a-button type="link" class="action-btn" @click="handleRemove(record)">退回</a-button>
            <a-button type="link" class="action-btn" @click="handleCopy(record)"
              >打印条形码</a-button
            >
          </template>
        </template>
      </template>
    </a-table>
  </a-form>

  <return-reason-model
    v-if="returnReasonModelState.visible"
    :ids="returnReasonModelState.ids"
    @success=""
    @cancel="returnReasonModelState.visible = false"
  />
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, toRefs, watch } from 'vue';
import { SIZE_CODE_OPTIONS, COLOUR_CODE_OPTIONS } from '@/constants/index';
import ImgUpload from '@/components/ImgUpload/index.vue';
import { ProductInfoType } from '@/types/purchase/purchase';
import { defaultProductInfo } from '@/types/purchase/purchase.config';
import { copyText } from '@/plugins/clipboard';
import { message, Form } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import ReturnReasonModel from '../components/ReturnReasonModel.vue';
interface Props {
  modelValue: {
    goodsList: ProductInfoType[];
  };
  type: 'readonly' | 'edit' | 'create' | 'copy';
}
interface RulesProps {
  [key: string]: any;
}
interface ModelStateType {
  visible: boolean;
  ids: string[] | [];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const { modelValue, type } = toRefs(props);
const columns = [
  {
    title: '货品编码',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
  },
  {
    title: '货品名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    type: 'input',
  },
  {
    title: '样例图',
    dataIndex: 'cover_img_url',
    key: 'cover_img_url',
    align: 'center',
    type: 'img-upload',
  },
  {
    title: '供货商',
    dataIndex: 'supplier',
    key: 'supplier',
    align: 'center',
    type: 'input',
  },
  {
    title: '尺码',
    dataIndex: 'size_code',
    key: 'size_code',
    align: 'center',
    type: 'select',
    options: SIZE_CODE_OPTIONS,
  },
  {
    title: '颜色',
    dataIndex: 'colour_code',
    key: 'colour_code',
    align: 'center',
    type: 'select',
    options: COLOUR_CODE_OPTIONS,
  },
  {
    title: '单品价格',
    dataIndex: 'cost_amount',
    key: 'cost_amount',
    type: 'number',
    align: 'center',
  },
  {
    title: '采购数量',
    dataIndex: 'number',
    key: 'number',
    type: 'number',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
  },
];

const rules = [
  {
    required: true,
    message: '必填',
    trigger: 'change',
  },
];
let rulesRef = reactive<RulesProps>({});
const useForm = Form.useForm;
const { resetFields, validate, validateInfos, clearValidate } = useForm(modelValue, rulesRef);
const initRulseRef = async (type: string) => {
  const newData = cloneDeep(defaultProductInfo());
  // 新增
  if (type === 'add') {
    Object.keys(newData).forEach((key) => {
      rulesRef[`goodsList.${props.modelValue.goodsList.length - 1}.${key}`] = rules;
    });
    return;
  }
  // 移除
  if (type === 'delete') {
    Object.keys(newData).forEach((key) => {
      clearValidate();
      delete rulesRef[`goodsList.${props.modelValue.goodsList.length - 1}.${key}`];
    });

    return;
  }
};

const onClick = () => {
  validate()
    .then(() => {
      console.log(toRaw(props.modelValue));
    })
    .catch((err: any) => {
      console.log('error', err);
    });
};

const handleAddGoods = () => {
  const newValue = reactive(props.modelValue);
  const newData = cloneDeep(defaultProductInfo());
  newValue.goodsList.push(newData);
  initRulseRef('add');
  emit('update:modelValue', toRaw(newValue));
};

for (let i = 0; i < 1; i++) {
  handleAddGoods();
}

const handleRemove = async (record: ProductInfoType) => {
  const newValue = props.modelValue;
  let idx = props.modelValue.goodsList.indexOf(record);
  if (idx !== -1) {
    await initRulseRef('delete');
    newValue.goodsList.splice(idx, 1);
  }
  emit('update:modelValue', toRaw(newValue));
};

// 复制商品编码
const handleCopy = (record: ProductInfoType) => {
  copyText(record.code + '')
    .then(() => {
      message.success('已复制到您的剪切板!');
    })
    .catch(() => {
      message.error('复制失败');
    });
};

const returnReasonModelState = reactive<ModelStateType>({
  visible: false,
  ids: [],
});

defineExpose({
  validate,
});
</script>
