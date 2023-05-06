<template>
  <a-card>
    <div class="page-title">订单详情</div>
    <div v-for="(item, index) in FORMDATA" :key="index">
      <template v-if="item.type === 'table'">
        <a-divider />
        <a-descriptions :title="item.title"></a-descriptions>
        <PreviewImgModal :src="detailInfo.order_info.suit_cover_img || ''" size="middle" />
        <div class="mb15"></div>
        <select-goods-table
          rowKey="sku"
          :columns="columns"
          :data-source="detailInfo.product_info"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <a-button
              type="link"
              @click="handleOperate(record, 'goods')"
              v-if="!record.after_sale_status"
              >查看</a-button
            >
            <a-button type="link" @click="handleOperate(record, 'afterSale')" v-else>详情</a-button>
          </template>
        </select-goods-table>
      </template>
      <!-- 买家信息展示 -->
      <template v-else-if="item.value === 'user_info'">
        <a-divider />
        <a-descriptions :title="item.title"></a-descriptions>
        <a-row type="flex">
          <a-col flex="100px">
            <PreviewImgModal :src="detailInfo[item.value]['avatar_url'] || ''" />
          </a-col>
          <a-col flex="1">
            <a-descriptions title="">
              <template v-for="(field, key) in item.group" :key="key">
                <a-descriptions-item :label="field" v-if="key !== 'avatar_url'">{{
                  detailInfo[item.value as keyof typeof key][key as keyof typeof key] || '-'
                }}</a-descriptions-item>
              </template>
            </a-descriptions>
          </a-col>
        </a-row>
      </template>
      <!-- 快递信息展示 -->
      <template v-else-if="item.value === 'logistics_info'">
        <template v-for="(ele, idx) in detailInfo.logistics_info">
          <a-divider />
          <a-descriptions :title="`${item.title + (idx + 1)}`">
            <template v-for="(field, key) in item.group" :key="key">
              <a-descriptions-item :label="field">{{
                ele[key as keyof typeof key] || '-'
              }}</a-descriptions-item>
            </template>
          </a-descriptions>
        </template>
      </template>
      <!-- 售后信息展示 -->
      <template v-else-if="item.value === 'after_sale_info'">
        <a-divider />
        <a-descriptions :title="item.title"></a-descriptions>
        <div class="mb15">订单亏损：{{ detailInfo.order_info.loss }}</div>
        <a-table
          :columns="sale_columns"
          :data-source="detailInfo.after_sale_info"
          :pagination="false"
          bordered
        ></a-table>
      </template>

      <template v-else>
        <a-divider />
        <a-descriptions :title="item.title">
          <template v-for="(field, key) in item.group" :key="key">
            <a-descriptions-item :label="field">{{
              detailInfo[item.value as keyof typeof key][key as keyof typeof key] || '-'
            }}</a-descriptions-item>
          </template>
        </a-descriptions>
      </template>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { toRaw, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import { detailFormFn } from './constants';
import type {
  Product_info,
  Pay_info,
  Logistics_info,
  Order_info,
  After_sale_info,
  User_info,
  OrderInfoResult,
} from '@/types/order/order';
import { defaultOrderInfoResult } from '@/types/order/order.config';
import { getOrderInfo } from '@/services/order';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import SelectGoodsTable from '@/components/SelectGoods/SelectGoodsTable.vue';
import { formatEnum, centYuanConvert } from '@/utils/utils';
import {
  orderStatusFilter,
  payStatusFilter,
  deliveryTypeFilter,
  orderSourceTypeFilter,
  afterSaleStatusFilter,
  goodsStatusFilter,
} from '@/constants/order';

const columns = [
  {
    title: '  商品编号',
    dataIndex: 'sku',
    key: 'sku',
    align: 'center',
  },
  {
    title: '商品类目',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
  },
  {
    title: '商品图',
    dataIndex: 'cover_img_url',
    key: 'cover_img_url',
    align: 'center',
  },
  {
    title: '商品颜色',
    dataIndex: 'colour_code',
    key: 'colour_code',
    align: 'center',
    width: 90,
  },
  {
    title: '商品尺码',
    dataIndex: 'size_code',
    key: 'size_code',
    align: 'center',
    width: 90,
  },
  {
    title: '商品价格',
    dataIndex: 'tag_amount',
    key: 'tag_amount',
    align: 'center',
    width: 120,
    customRender: ({ text }: { text: any }) => {
      return '¥' + centYuanConvert(text);
    },
  },
  {
    title: '服务费',
    dataIndex: 'service_charge',
    key: 'service_charge',
    align: 'center',
    width: 90,
    customRender: ({ text }: { text: any }) => {
      return '¥' + centYuanConvert(text);
    },
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '售后状态',
    dataIndex: 'after_sale_status_value',
    key: 'after_sale_status_value',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 110,
  },
];
const sale_columns = [
  {
    title: '种类',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align: 'center',
  },
  {
    title: '商品编号',
    dataIndex: 'sku',
    key: 'sku',
    align: 'center',
    customRender: ({ text }: { text: any }) => {
      return `商品（${text}）`;
    },
  },
  {
    title: '发起角色',
    dataIndex: 'op_user',
    key: 'op_user',
    align: 'center',
    customRender: ({ text }: { text: any }) => {
      return text ? `由操作人：${text}` : '由用户';
    },
  },
  // {
  //   title: '邮寄单号',
  //   dataIndex: 'tracking_number',
  //   key: 'tracking_number',
  //   align: 'center',
  // },
  {
    title: '详细(退货理由)',
    dataIndex: 'context',
    key: 'context',
    align: 'center',
  },
];
const route = useRoute();
const router = useRouter();
const { order_id = '' } = route.query;

const FORMDATA = detailFormFn();
interface DetailInfoType {
  after_sale_info: [];
  logistics_info: [];
  order_info: {};
  pay_info: {};
  product_info: Record<string, any> | undefined;
  user_info: {};
}
const detailInfo = reactive<OrderInfoResult>(defaultOrderInfoResult);
const goodsInfo = ref([]);

const fetchProductInfo = async () => {
  const { result } = await getOrderInfo({ order_id: order_id as string });
  if (result) {
    Object.assign(detailInfo, result);
    detailInfo.product_info = formatEnum(result.product_info) as [];
    formatInfo();
  }
};

if (order_id) {
  fetchProductInfo();
}

const formatInfo = () => {
  // 订单
  detailInfo.order_info.order_stat_value = orderStatusFilter(detailInfo.order_info.order_stat + '');
  detailInfo.order_info.source = orderSourceTypeFilter(detailInfo.order_info.source + '');
  detailInfo.order_info.type = deliveryTypeFilter(detailInfo.order_info.type + '');
  detailInfo.order_info.pay_amount_total =
    '¥' + centYuanConvert(detailInfo.order_info.pay_amount_total);
  detailInfo.order_info.tag_amount_total =
    '¥' + centYuanConvert(detailInfo.order_info.tag_amount_total);
  detailInfo.order_info.postage =
    '¥' + centYuanConvert((detailInfo.order_info.postage as number) * 100);
  detailInfo.order_info.service_charge =
    '¥' + centYuanConvert(detailInfo.order_info.service_charge);
  detailInfo.order_info.coupon_amount = '¥' + centYuanConvert(detailInfo.order_info.coupon_amount);
  detailInfo.order_info.profit_margin = detailInfo.order_info.profit_margin + '%';
  detailInfo.order_info.loss = '¥' + centYuanConvert(detailInfo.order_info.loss);
  // 商品
  detailInfo.product_info.forEach((ele) => {
    ele.after_sale_status_value = afterSaleStatusFilter(ele.after_sale_status);
    ele.status = goodsStatusFilter(ele.status);
    ele.cover_img_url = ele.cover_img_url || '';
  });
  // 支付
  detailInfo.pay_info.amount = '¥' + centYuanConvert(detailInfo.pay_info.amount);
  detailInfo.pay_info.pay_mode = detailInfo.pay_info.pay_mode == 1 ? '微信' : '其他';
  detailInfo.pay_info.status = payStatusFilter(detailInfo.pay_info.status + '');

  // 快递
  detailInfo.logistics_info.forEach((ele) => {
    if (ele.newest_info) {
      let newestInfo = JSON.parse(ele.newest_info);
      ele.newest_info = `${newestInfo.acceptTime} , ${newestInfo.remark}`;
    }
    const { province = '', city = '', county = '', location = '' } = ele;
    ele.address = province + city + county + location;
    ele.express = ele.express ? '顺丰' : '';
  });
};
// 商品查看
const handleOperate = (record: Product_info, type: string) => {
  if (type === 'goods') {
    router.push({
      name: 'GoodsCreate',
      query: {
        sku: record.sku,
        type: 'readonly',
      },
    });
  }
  if (type === 'afterSale') {
    if ([40, 41, 42].includes(record.after_sale_status)) {
      record.after_sale_id &&
        router.push({
          name: 'OutWarehouseDetail',
          query: { id: record.after_sale_id, type: 'readonly' },
        });
    } else {
      record.return_order_id &&
        router.push({
          name: 'InWarehouseManage',
          params: { return_order_id: record.return_order_id },
        });
    }
  }
};
</script>

<style lang="less" scoped>
.page-title {
  color: #000000d9;
  font-weight: 700;
  font-size: 24px;
}

.group-title {
  overflow: hidden;
  color: #000000d9;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
</style>
