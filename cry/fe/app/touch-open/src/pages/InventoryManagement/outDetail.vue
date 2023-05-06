<template>
  <a-card>
    <div class="page-title">售后出库</div>
    <div>
      <a-divider />
      <a-descriptions title="基本信息">
        <a-descriptions-item label="状态">{{
          outStatusFilter(detailInfo.status)
        }}</a-descriptions-item>
        <a-descriptions-item label="关联单号">{{
          detailInfo.related_order_id
        }}</a-descriptions-item>
        <a-descriptions-item label="制单时间">{{ detailInfo.create_time }}</a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <a-descriptions title="商品信息">
        <a-descriptions-item label="本次出库总数量">{{ outTotal }}</a-descriptions-item>
      </a-descriptions>
      <a-table
        rowKey="id"
        :columns="goodsColumns"
        :data-source="detailInfo.product_info"
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'cover_img_url'">
            <img :src="text" style="width: 50px" />
          </template>
          <!-- <template v-if="column.dataIndex === 'operation'">
                        <a-button type="link" class="action-btn">复制条形码</a-button>
                    </template> -->
        </template>
      </a-table>
      <a-descriptions title="快递信息" class="mt24"></a-descriptions>
      <a-table rowKey="id" :columns="exColumns" :data-source="logisticsInfo" :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation' && type !== 'readonly'">
            <a-button type="link" class="action-btn" @click="handleCopy(record)"
              >复制订单编号</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="record.type === '0'"
              @click="showExpressSelect"
              >快递下单</a-button
            >
            <a-button type="link" class="action-btn" v-else @click="handlePrint(record)"
              >打印快递单</a-button
            >
          </template>
        </template>
      </a-table>
    </div>
    <a-row class="mt50" v-if="type !== 'readonly'">
      <a-col :span="24" style="text-align: right">
        <a-button @click="router.back()">取消</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="handleOutbound">完成</a-button>
      </a-col>
    </a-row>
  </a-card>
  <ExpressSelect type="all" v-model:visible="expressVisible" @selected="hanlePlaceOrder" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getOutboundDetail,
  outbound,
  placeLogisticsOrderRequest,
  cloudPrint,
  getSFTokenRequest,
  JDPrintRequest,
  type PlaceLogisticsOrderProps,
} from '@/services/inwarehouse';
import type { OutBoundDetailResultProps } from '@/services/inwarehouse';
import type { LogisticsType } from '@/types/inventory/inventory';
import { defaultLogistics } from '@/types/inventory/inventory.config';
import { Modal, message } from 'ant-design-vue';
import { outStatusFilter } from '@/constants/inventor';
import { copyText } from '@/plugins/clipboard';
import { previewFile } from '@/plugins/downloadFile';
import { removeNullItem } from '@/utils/utils';
import '@/utils/SCPPrint.js';
import ExpressSelect from '@/components/ExpressSelect/index.vue';
const expressVisible = ref(false);

const SCPPrint: SCPPrint = (<any>window).SCPPrint;
const printSdk = new SCPPrint({
  env: import.meta.env.VITE_APP_PRIENT_ENV,
  partnerID: 'MHKJWURJq41',
});

const goodsColumns = [
  {
    title: '商品条形码',
    dataIndex: 'sku',
    key: 'sku',
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
    dataIndex: 'colour',
    key: 'colour',
    align: 'center',
  },
  {
    title: '尺码',
    dataIndex: 'size',
    key: 'size',
    align: 'center',
  },
  {
    title: '本次出库数量',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
  },
];

const exColumns = [
  {
    title: '关联单号',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
  },
  {
    title: '收货人',
    dataIndex: 'receiver_name',
    key: 'receiver_name',
    align: 'center',
  },
  {
    title: '收货手机号',
    dataIndex: 'receiver_mobile',
    key: 'receiver_mobile',
    align: 'center',
  },
  {
    title: '收货地址',
    dataIndex: 'address',
    key: 'address',
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
    dataIndex: 'company',
    key: 'company',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const route = useRoute();
const router = useRouter();
const { id = '', type = '', express_type = '' } = route.query;
const logisticsCompanyMap = {
  '0': '',
  '1': '顺丰',
  '2': '京东',
  '3': '大宗货品',
};
const detailInfo = reactive<OutBoundDetailResultProps>({
  related_order_id: '',
  status: '',
  create_time: '',
  product_info: [],
  logistics_info: defaultLogistics,
});
const logisticsInfo = ref<LogisticsType[]>([]);
const outTotal = computed(() => {
  let arr: number[] = [];
  detailInfo.product_info.map((item) => arr.push(parseInt(item?.number)));
  return arr.reduce((pre, current) => {
    return pre + current;
  }, 0);
});
const getDetail = async () => {
  const { code, msg, result } = await getOutboundDetail({ id: id as string });
  if (code === 0) {
    Object.assign(detailInfo, result);
    const logisticsData = result.logistics_info ? result.logistics_info : ({} as LogisticsType);
    if (logisticsData.id) {
      const { province = '', city = '', county = '', location = '', type = '' } = logisticsData;
      logisticsData.address = province + city + county + location;
      logisticsData.company = logisticsCompanyMap[type as keyof typeof logisticsCompanyMap];
      logisticsInfo.value?.push(logisticsData);
    }
  } else {
    message.error(msg);
  }
};
const showExpressSelect = () => {
  expressVisible.value = true;
};
const hanlePlaceOrder = async (type: number, fee: number) => {
  try {
    const params = removeNullItem({
      id: logisticsInfo.value[0].id as string,
      type,
      fee,
    });
    const { result } = await placeLogisticsOrderRequest(params as PlaceLogisticsOrderProps);
    logisticsInfo.value[0].tracking_number = result.tracking_number;
    logisticsInfo.value[0].company =
      logisticsCompanyMap[result.type as keyof typeof logisticsCompanyMap];
    logisticsInfo.value[0].type = type + '';
    message.success('快递下单成功');
    expressVisible.value = false;
  } catch (error) {
    console.log('error', error);
  }
};

const handleOutbound = async () => {
  Modal.confirm({
    title: '您是否已经完成打印条形码、订单号、快递单号，并进行出库。',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      await outbound({ id: id as string });
      message.success('出库成功');
      router.back();
    },
    onCancel() {
      return new Promise<void>((resolve, reject) => {
        resolve();
      });
    },
  });
};

// 复制商品编码
const handleCopy = (record: { order_id: string }) => {
  copyText(record.order_id)
    .then(() => {
      message.success('已复制到您的剪切板!');
    })
    .catch(() => {
      message.error('复制失败');
    });
};
// 下载快递单
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
          masterWaybillNo: record.tracking_number,
        },
      ],
    });
  } else {
    await JDPrintRequest({
      tracking_number,
      type: Number(type),
    });
  }
  // const { code, msg, result } = await cloudPrint({
  //   tracking_number: logisticsInfo.value[0].tracking_number as string,
  // });
  // previewFile(result.waybill_content);
};

onMounted(() => {
  getDetail();
});
</script>

<style lang="less" scoped>
.page-title {
  color: #000000d9;
  font-weight: 700;
  font-size: 24px;
}

.action-btn {
  padding: 0 5px;
}

.btn-area {
  margin-top: 40px;
}
</style>
