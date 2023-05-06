<!-- 选择商品弹窗 -->
<template>
  <a-modal
    title="选择商品"
    :visible="true"
    :maskClosable="false"
    centered
    width="80%"
    destroyOnClose
    :body-style="{ height: '80vh', 'overflow-y': 'auto' }"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <template #footer >
      <template v-if="action !== 'click'">
          <a-button key="back" @click="onModalClose">取消</a-button>
          <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="商品编码" name="sku">
              <a-input
                v-model:value.trim="formState.sku"
                placeholder="请输入商品编码"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品名称" name="name">
              <a-input
                v-model:value.trim="formState.name"
                placeholder="请输入商品名称"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品类目" name="category">
              <a-cascader
                style="min-width: 250px"
                v-model:value="formState.category"
                :options="CATEGORY_OPTIONS"
                placeholder="请选择商品类目"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onSearch">查询</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <select-goods-table
      rowKey="id"
      :data-source="dataSource"
      :pagination="pagination"
      bordered
      @change="(onTableChange as any)"
    >
      <template #operation="{ record }">
        <template v-if="action === 'select'">
          <a-button
            :type="record.checked ? 'primary' : ''"
            :disabled="record.disabled"
            @click="handleChange(record, 'multiple')"
            >{{ record.checked ? '已添加' : '添加' }}</a-button
          >
        </template>
        <template v-if="action === 'replenish'">
          <a-button :type="record.checked ? 'primary' : ''" @click="handleChange(record, 'radio')"
            >补货</a-button
          >
        </template>
        <template v-if="action === 'click'">
          <a-button type="primary" @click="handleClick(record)"
            >补货</a-button
          >
        </template>
      </template>
    </select-goods-table>
  </a-modal>
  <a-modal v-model:visible="replenishModalState.visible" :closable="false" width="400px" :destroyOnClose="true" okText="确定"
    @ok="handleReplenishSubmit" @cancel="onReplenishModalClose">
    <a-form v-bind="layout">
      <a-form-item label="物流费" v-bind="validateInfos.postage">
        <a-input-number
          v-model:value="replenishFormlRef.postage"
          prefix="￥"
          :decimalStep="0.01"
          :step="0.01"
          :max="99999999.00"
          :min="0.01"
        />
      </a-form-item>
      <a-form-item label="补货数量" v-bind="validateInfos.number">
        <a-input-number
          v-model:value="replenishFormlRef.number"
          :max="9999"
          :min="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, onMounted, toRefs, UnwrapRef, Ref, computed } from 'vue';
import { message, Form } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList } from '@/services/goods';
import { CATEGORY_OPTIONS } from '@/constants/index';
import SelectGoodsTable from './SelectGoodsTable.vue';
import { replenishRequest } from '@/services/inwarehouse';
import { mul } from '@/utils/utils';
import { cloneDeep } from 'lodash';

interface Props {
  selectedSkus?: string[];
  action: 'select' | 'replenish' | 'click';
}
interface StateType {
  selectedRowSkus: string[];
  selectedRow: Record<string, any>[];
}
const props = withDefaults(defineProps<Props>(), {
  selectedSkus: () => [],
  action: 'select',
});

const { selectedSkus, action } = toRefs(props);

const emit = defineEmits(['success', 'cancel']);

const state: UnwrapRef<StateType> = reactive({
  selectedRowSkus: [],
  selectedRow: [],
});
const formState = reactive({
  sku: '',
  name: '',
  category: [],
});

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
})
// 获取数据
const { onSearch, onReset, pagination, dataSource, getList, searchFormRef, onTableChange } =
  useSearchTableList({
    fetchData: getProductList,
    formatParams() {
      return formState;
    },
    listFormatEnum: true,
    pageSize: 10,
    formatResponse(res) {
      const { list, total } = res.result;
      if (action.value === 'select') {
        list.forEach((item: Record<string, any>) => {
          if (selectedSkus.value.length) {
            selectedSkus.value.find((i) => (item.checked = item.sku == i));
            selectedSkus.value.find((i) => (item.disabled = item.sku == i));
          }
          if (state.selectedRowSkus.length) {
            state.selectedRowSkus.find((i) => (item.checked = item.sku == i));
          }
        });
      }
      if (action.value === 'replenish') {
        list.forEach((item: Record<string, any>) => {
          item.checked = false;
        });
      }
      return {
        list: list,
        total: total,
      };
    },
  });

const handleChange = (row: Record<string, any>, type: 'multiple' | 'radio') => {
  type === 'multiple' ?handleMultiple(row) : handleRadio(row)
};
const handleMultiple = (row: Record<string, any>) =>{
  row.checked = !row.checked;
  if (row.checked) {
    state.selectedRowSkus.push(row.sku as string);
    state.selectedRow.push(row);
  } else {
    state.selectedRowSkus.splice(
      state.selectedRowSkus.findIndex((item) => item == row.sku),
      1,
    );
    state.selectedRow.splice(
      state.selectedRow.findIndex((item) => item.sku == row.sku),
      1,
    );
  }
}

const handleRadio = (row: Record<string, any>) => {
  dataSource.value?.forEach((item: { checked: boolean; }) => item.checked = false);
  row.checked = !row.checked;

}


const handleSubmit = () => {
  const data = {
    selectedSkus: state.selectedRowSkus,
    selectedRows: state.selectedRow,
  };
  emit('success', data);
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};

onMounted(async () => {
  await getList();
});


const replenishModalState = reactive({
  visible: false,
  currentRow: {},
});

const replenishFormlRef = reactive<{
  sku: string;
  postage: number;
  number: number;
}>({
  postage: 0.01,
  number: 1,
  sku: ''
});
const handleClick = (row: Record<string, any>) => {
  replenishModalState.visible = true
  replenishModalState.currentRow = row
  replenishFormlRef.sku = row.sku
}


const rulesRef = computed(() => ({
  postage: [
    {
      required: true,
      message: '请选择商品报损原因！',
    },
  ],
  number: [
    {
      required: true,
      message: '请输入自定义原因!',
    },
  ]
}));
const { resetFields, validate, validateInfos } = useForm(replenishFormlRef);

const handleReplenishSubmit = async() => {
  try {
    await validate();
    const params = cloneDeep(replenishFormlRef);
    params.postage = mul(params.postage, 100)
    await replenishRequest(params);
    message.success('补货成功!');
    getList()
    onReplenishModalClose();
  } catch (error) {
    console.log('error', error);
  }
}
const onReplenishModalClose = () => {
  resetFields()
  replenishModalState.visible = false
}
</script>
