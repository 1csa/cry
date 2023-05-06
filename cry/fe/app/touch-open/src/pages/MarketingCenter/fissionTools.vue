<template>
  <div>
    <SearchForm
      :form-data="FORMDATA"
      :modelRef="modelRef"
      :validateInfos="validateInfos"
      @search="onSearch"
      @reset="onReset"
      title="裂变工具"
    />

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
          <template v-if="column.dataIndex === 'wxacode' || column.dataIndex === 'cover_img_url'">
            <PreviewImgModal :src="text" />
          </template>
          <template v-if="column.dataIndex === 'remark'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              <div class="remark">{{ text }}</div>
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex === 'userid'">
            <div v-if="text === 0">{{ record.op_user }}</div>
            <div v-else>{{ text }}</div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'FissionTools',
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import useSearchTableList from '@/composables/useSearchTableListV2';
import SearchForm from '@/components/SearchForm/index.vue';

import { fissionSearchFormFn } from './constants/index';
import { getSuitShareList } from '@/services/marketingCenter';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '链接ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '生成时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    {
      title: '生成人',
      dataIndex: 'userid',
      key: 'userid',
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
      dataIndex: 'cover_img_url',
      key: 'cover_img_url',
      align: 'center',
    },
    {
      title: '小程序码',
      dataIndex: 'wxacode',
      key: 'wxacode',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '链接点击数',
      dataIndex: 'pv',
      key: 'pv',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'pv' && sorted.order,
    },
    {
      title: '链接购买量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'quantity' && sorted.order,
    },
  ];
});
const FORMDATA = fissionSearchFormFn();

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
  fetchData: getSuitShareList,
  formData: FORMDATA,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    data.start_time = data.time && data.time[0];
    data.end_time = data.time && data.time[1];
    delete data['time'];
    return data;
  },
  // formatResponse(res) {
  //   const { data, total } = res.result;
  //   return {
  //     list: data,
  //     total: total
  //   }
  // },
  defaultSortedInfo: {
    field: 'id',
    order: 'descend',
    columnKey: 'id',
  },
});
</script>

<style lang="less" scoped>
.remark {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
}
.cover-img-wrap {
  width: 50px;
}

.action-btn {
  padding: 0 5px;
}
</style>
