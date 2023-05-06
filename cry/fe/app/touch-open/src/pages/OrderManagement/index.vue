<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline">
        <a-row :gutter="[24, 16]">
          <template v-for="(field, key) in FORMDATA" :key="key">
            <a-col :span="8">
              <BaseFormItem
                :field="(field as FieldType)"
                :modelRef="modelRef"
                :fieldkey="key"
                :validateInfos="validateInfos"
              />
            </a-col>
          </template>
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
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'suit_cover_img'">
            <PreviewImgModal :src="text" />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleOperate(record, 'readonly')"
              >详情</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'OrderList',
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { FieldType } from '@/components/BaseFormItem/index-v2.vue';
import useSearchTableList from '@/composables/useSearchTableListV2';
import { getOrderList } from '@/services/order';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import BaseFormItem from '@/components/BaseFormItem/index-v2.vue';
import { searchFormFn } from './constants';
import { orderStatusFilter } from '@/constants/order';

const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
    },
    {
      title: '套装ID',
      dataIndex: 'suit_id',
      key: 'suit_id',
      align: 'center',
    },
    {
      title: '套装封面图',
      dataIndex: 'suit_cover_img',
      key: 'suit_cover_img',
      align: 'center',
    },
    {
      title: '订单金额',
      dataIndex: 'pay_amount_total',
      key: 'pay_amount_total',
      align: 'center',
      customRender: ({ text }: { text: any }) => {
        return '¥' + (text / 100).toFixed(2);
      },
    },
    {
      title: '利润率',
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      align: 'center',
      customRender: ({ text }: { text: any }) => {
        return text + '%';
      },
    },
    {
      title: '昵称/收货人',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
      customRender: ({ text, record }: { text: any; record:any}) => {
        return (text || '-') + '/' + record.receiver_name;
      },
    },
    {
      title: '用户手机/收货人手机',
      dataIndex: 'user_mobile',
      key: 'user_mobile',
      align: 'center',
      customRender: ({ text, record }: { text: any; record:any}) => {
        return (text || '-') + '/' + record.receiver_mobile;
      },
    },
    {
      title: '快递单号',
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'order_stat',
      key: 'order_stat',
      align: 'center',
      width: 90,
      customRender: ({ text }: { text: string }) => {
        return orderStatusFilter(text);
      },
    },
    {
      title: '下单时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'create_time' && sorted.order,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const FORMDATA = searchFormFn();
const dateFormat = 'YYYY-MM-DD';

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
  sortedInfo,
  modelRef,
  validateInfos,
} = useSearchTableList({
  fetchData: getOrderList,
  formData: FORMDATA,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    data.start_time = data.date && data.date[0].format(dateFormat);
    data.end_time = data.date && data.date[1].format(dateFormat);
    delete data['date'];
    return data;
  },
  listFormatEnum: true,
});

// 编辑，查看
const handleOperate = (record: { order_id: string }, type: string) => {
  router.push({
    name: 'OrderDetail',
    query: record.order_id
      ? {
          order_id: record.order_id,
          type: type,
        }
      : {
          type: type,
        },
  });
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
