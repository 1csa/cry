<!-- 商品返还弹窗 -->
<template>
  <a-modal
    title="商品返还"
    :visible="true"
    :closable="false"
    width="800px"
    :destroyOnClose="true"
    okText="完成"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-descriptions title="基本信息">
      <a-descriptions-item label="关联单号">{{ orderInfo.return_order_id }}</a-descriptions-item>
      <a-descriptions-item label="制单时间">{{ orderInfo.create_time }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="商品信息"></a-descriptions>
    <a-table rowKey="id" :columns="goodsColumns" :data-source="goodsDataSource" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'cover_img_url'">
          <img :src="text" style="width: 50px" />
        </template>
      </template>
    </a-table>
    <a-descriptions title="快递信息" class="mt24"></a-descriptions>
    <a-table
      rowKey="id"
      :columns="logisticsColumns"
      :data-source="logisticsDataSource"
      :pagination="false"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button
            type="link"
            class="action-btn"
            @click="showExpressSelect"
            v-if="!record.tracking_number"
            >快递下单
          </a-button>
          <a-button type="link" class="action-btn" @click="handlePrint(record)" v-else
            >打印快递单</a-button
          >
        </template>
      </template>
    </a-table>
  </a-modal>
  <ExpressSelect type="all" v-model:visible="expressVisible" @selected="hanlePlaceOrder" />
</template>

<script lang="ts" setup>
import type {
  ListOptionType,
  OrderInfoType,
  LogisticsInfoType,
  DefectProductItemInfoType,
} from '@/services/inwarehouse';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { reactive, createVNode, onMounted, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  defectProductInfoRequest,
  placeLogisticsOrderRequest,
  confirmInboundRequest,
  cloudPrint,
  getSFTokenRequest,
  JDPrintRequest,
} from '@/services/inwarehouse';
import { previewFile } from '@/plugins/downloadFile';
import '@/utils/SCPPrint.js';
import ExpressSelect from '@/components/ExpressSelect/index.vue';
interface Props {
  info: ListOptionType;
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'cancel']);

const SCPPrint: SCPPrint = (<any>window).SCPPrint;
const printSdk = new SCPPrint({
  env: import.meta.env.VITE_APP_PRIENT_ENV,
  partnerID: 'MHKJWURJq41',
});
const expressVisible = ref(false);
const goodsColumns = [
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
  },
  {
    title: '尺码',
    dataIndex: 'size_name',
    key: 'size_name',
    align: 'center',
  },
];

const logisticsColumns = [
  {
    title: '收货人',
    dataIndex: 'shipper_name',
    key: 'shipper_name',
    align: 'center',
  },
  {
    title: '收货手机号',
    dataIndex: 'shipper_mobile',
    key: 'shipper_mobile',
    align: 'center',
  },
  {
    title: '收货地址',
    dataIndex: 'location',
    key: 'location',
    align: 'center',
  },
  {
    title: '快递单号',
    dataIndex: 'tracking_number',
    key: 'tracking_number',
    align: 'center',
  },
  {
    title: '快递公司',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      if (text === '1') return '顺丰';
      return '';
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const goodsDataSource = reactive<DefectProductItemInfoType[]>([]);
const logisticsDataSource = reactive<LogisticsInfoType[]>([]);
const orderInfo = reactive<Partial<OrderInfoType>>({});

const fetchInfo = async () => {
  const {
    result: { order_info, product_info, sf_info },
  } = await defectProductInfoRequest({ return_order_id: props.info.return_order_id });
  Object.assign(orderInfo, order_info);
  Object.assign(goodsDataSource, product_info);
  logisticsDataSource.push(sf_info);
};

onMounted(async () => {
  await fetchInfo();
});
const showExpressSelect = () => {
  console.log(2222);
  expressVisible.value = true;
};
const hanlePlaceOrder = async (type: number) => {
  try {
    const { result } = await placeLogisticsOrderRequest({
      id: logisticsDataSource[0].id as string,
      type,
    });
    logisticsDataSource[0].tracking_number = result.tracking_number;
    message.success('快递下单成功');
    expressVisible.value = false;
  } catch (error) {
    console.log('error', error);
  }
};

const handlePrint = async (record: { tracking_number: string; type: string }) => {
  const { tracking_number, type } = record;
  if (type === '1') {
    const { result: accessToken } = await getSFTokenRequest({ app: 'print' });
    printSdk.setPrinter('RP4xx Series 200DPI ZPL');
    printSdk.print({
      requestID: Date.now(),
      accessToken,
      templateCode: 'fm_150_standard_MHKJWURJq41',
      documents: [
        {
          masterWaybillNo: tracking_number,
        },
      ],
    });
  } else {
    await JDPrintRequest({
      tracking_number,
      type: Number(type),
    });
  }

  // const { result } = await cloudPrint({ tracking_number: logisticsDataSource[0].tracking_number as string })
  // previewFile(result.waybill_content)
};

const handleSubmit = async () => {
  Modal.confirm({
    title: '您是否已经完成快递单号？',
    icon: createVNode(ExclamationCircleOutlined),
    onOk: async () => {
      const params = {
        id: props.info.id,
        status: '12',
      };
      await confirmInboundRequest(params);
      message.success('返还成功!');
      emit('success');
      onModalClose();
    },
    onCancel() {
      return new Promise((resolve, reject) => {
        resolve('close');
      });
    },
  });
};

const onModalClose = () => {
  emit('cancel');
};
</script>
