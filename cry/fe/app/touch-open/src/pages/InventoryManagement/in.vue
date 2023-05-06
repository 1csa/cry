<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="快递单号" name="tracking_number">
              <a-input
                v-model:value.trim="formState.tracking_number"
                placeholder="请输入快递单号"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="入库单号" name="return_order_id">
              <a-input
                v-model:value.trim="formState.return_order_id"
                placeholder="请输入入库单号"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品条形码" name="bar_code">
              <a-input
                v-model:value.trim="formState.bar_code"
                placeholder="请输入商品条形码"
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
            <a-form-item label="入库状态" name="inbound_status">
              <a-select
                v-model:value="formState.inbound_status"
                style="width: 120px"
                :options="inboundOptions"
                allow-clear
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onSearch">查询</a-button>
                <a-button @click="onReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="table-box mt20">
      <a-row class="action-btn-box" type="flex" justify="space-between">
        <a-col flex="auto">
          <a-tabs
            v-model:activeKey="formState.is_replenish"
            type="card"
            :tabBarGutter="6"
            class="search-tabs"
            @change="handelStatusChange"
          >
            <a-tab-pane v-for="item in InOptions" :key="item.value" :tab="item.label"></a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleInbound">手动入库</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'bar_code'">
            <a-button
              type="link"
              :disabled="record.inbound_status !== '0'"
              @click="handleCodeClick(record)"
              >{{ text }}
            </a-button>
          </template>
          <template v-if="column.dataIndex === 'cover_img_url'">
            <PreviewImgModal :src="text" />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <action-buton type="link" class="action-btn" :record="record" />
          </template>
        </template>
      </a-table>
    </a-card>
    <in-bound-model
      v-if="inBoundModelState.visible"
      :info="(inBoundModelState.currentRow as ListOptionType)"
      @success="getList"
      @cancel="handleCancelInboundModel"
    />
    <report-model
      v-if="reportModelState.visible"
      :info="(reportModelState.currentRow as ListOptionType)"
      @success="getList"
      @cancel="handleCancelReportModel"
    />
    <return-model
      v-if="returnModelState.visible"
      :info="(returnModelState.currentRow as ListOptionType)"
      @success="getList"
      @cancel="handleCancelReturnModel"
    />
    <select-goods-modal
      v-if="selectGoodsModal.visible"
      action="click"
      @cancel="handleCancelSelectGoodsModal"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'InWarehouseManage',
};
</script>

<script lang="ts" setup>
import type { SelectProps, ButtonProps } from 'ant-design-vue';
import type {
  InWarehouseFormStateType,
  CustomRenderFnPropsType,
} from '@/types/inventory/inventory';
import type { UnwrapRef } from 'vue';
import type { ListOptionType, InBoundListProps } from '@/services/inwarehouse';
import { ref, reactive, h, computed, onMounted } from 'vue';
import { getInBoundList } from '@/services/inwarehouse';
import { Button, Modal } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import InBoundModel from './Components/InBoundModel.vue';
import ReportModel from './Components/ReportModel.vue';
import ReturnModel from './Components/ReturnModel.vue';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import SelectGoodsModal from '@/components/SelectGoods/SelectGoodsModal.vue';
import { useRoute, useRouter } from 'vue-router';

interface ModelStateType {
  visible: boolean;
  currentRow: Partial<ListOptionType>;
}
const route = useRoute();
const router = useRouter();
const { return_order_id = '' } = route.params;

const columns = [
  {
    title: '入库编号',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: '订单编号',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return text != '0' ? text : '';
    },
  },
  {
    title: '快递单号',
    dataIndex: 'tracking_number',
    key: 'tracking_number',
    align: 'center',
  },
  {
    title: '入库单号',
    dataIndex: 'return_order_id',
    key: 'return_order_id',
    align: 'center',
  },
  {
    title: '商品条形码',
    dataIndex: 'bar_code',
    key: 'bar_code',
    align: 'center',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '封面图',
    dataIndex: 'cover_img_url',
    key: 'cover_img_url',
    align: 'center',
  },
  {
    title: '颜色',
    dataIndex: 'colour_name',
    key: 'colour_name',
    align: 'center',
    width: 90,
  },
  {
    title: '尺码',
    dataIndex: 'size_name',
    key: 'size_name',
    align: 'center',
    width: 90,
  },
  {
    title: '入库量',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
    width: 90,
  },
  {
    title: '入库状态',
    dataIndex: 'inbound_status',
    key: 'inbound_status',
    align: 'center',
    customRender: ({ text: value }: { text: string }) => {
      const obj = {
        '0': '待入库',
        '1': '已取消',
        '2': '已上报',
        '10': '待返还',
        '11': '已记录',
        '12': '已返还',
        '20': '已完成',
      };
      return obj[value as keyof typeof obj];
    },
  },
  {
    title: '操作人',
    dataIndex: 'op_user',
    key: 'op_user',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const inboundOptions = ref<SelectProps['options']>([
  {
    value: '0',
    label: '待入库',
  },
  {
    value: '1',
    label: '已取消',
  },
  {
    value: '2',
    label: '已上报',
  },
  {
    value: '10',
    label: '待返还',
  },
  {
    value: '11',
    label: '已记录',
  },
  {
    value: '12',
    label: '已返还',
  },
  {
    value: '20',
    label: '已完成',
  },
]);

const InOptions = computed(() => {
  return [
    {
      label: '采购入库',
      value: '1',
    },
    {
      label: `售后入库(待入库${originalResponse.value?.result?.pre_inbound_count || 0})`,
      value: '2',
    },
    {
      label: `门店入库`,
      value: '3',
    },
  ];
});

const formState: UnwrapRef<InWarehouseFormStateType> = reactive({
  tracking_number: '',
  return_order_id: '',
  bar_code: '',
  name: '',
  inbound_status: '',
  is_replenish: '1',
});

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
  originalResponse,
} = useSearchTableList({
  fetchData: getInBoundList,
  formatParams() {
    const data: InBoundListProps = { ...formState };
    return data;
  },
});
const inBoundModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});

const reportModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});

const returnModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});

const handelStatusChange = (val: string) => {
  formState.is_replenish = val;
  getList();
};

// 上报 操作
const handleCodeClick = (record: ListOptionType) => {
  reportModelState.visible = true;
  reportModelState.currentRow = record;
};

const handleCancelReportModel = () => {
  reportModelState.visible = false;
};

// 返还、入库、次品 操作
const handleOperate = (record: ListOptionType) => {
  if (record.inbound_status === '0') {
    inBoundModelState.visible = true;
    inBoundModelState.currentRow = record;
  }
  if (record.inbound_status === '10') {
    returnModelState.visible = true;
    returnModelState.currentRow = record;
  }
};

const handleCancelInboundModel = () => {
  inBoundModelState.visible = false;
};

const handleCancelReturnModel = () => {
  returnModelState.visible = false;
};

const handleCancelSelectGoodsModal = () => {
  selectGoodsModal.visible = false;
  getList();
};

const ActionButon = (props: CustomRenderFnPropsType) => {
  const { record, ...nativeProps } = props;
  let text = '';
  const componentsProps = { ...nativeProps, disabled: true };
  if (['0', '1', '2', '20'].indexOf(record.inbound_status) > -1) {
    text = '入库';
    if (record.inbound_status === '0') componentsProps['disabled'] = false;
  }
  if (['10', '12'].indexOf(record.inbound_status) > -1) {
    if (record.inbound_status === '10') componentsProps['disabled'] = false;
    text = '返还';
  }
  if (record.inbound_status === '11') {
    text = '次品';
  }
  return h<ButtonProps>(
    Button,
    {
      ...componentsProps,
      onClick: () => handleOperate(record),
    },
    {
      default: () => text,
    },
  );
};
// 商品弹窗
const selectGoodsModal = reactive({
  visible: false,
});
const handleInbound = () => {
  Modal.confirm({
    title: '',
    content: '请确认本次入库货品是否为新增货品，若不是，请选择补货',
    icon: '',
    okText: '新建',
    cancelText: '补货',
    onOk() {
      router.push({
        name: 'GoodsCreate',
        query: {
          id: '',
          type: 'create',
        },
      });
    },
    onCancel() {
      selectGoodsModal.visible = true;
    },
  });
};

if (return_order_id) {
  formState.return_order_id = return_order_id as string;
  formState.is_replenish = '2';
  getList();
}
</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.action-btn {
  padding: 0 5px;
}
</style>
