<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="出库单号" name="related_order_id">
              <a-input
                v-model:value.trim="formState.related_order_id"
                placeholder="请输入"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="出库状态" name="status">
              <a-select
                style="min-width: 250px"
                v-model:value="formState.status"
                :options="OUT_STATUS_OPTIONS"
                placeholder="请选择"
                allow-clear
              />
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
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleOperateOut(record, 'readonly')"
              >查看</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              :disabled="record.status != 0"
              @click="handleOperateOut(record, '')"
              >出库</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'OutWarehouseManage',
};
</script>
<script lang="ts" setup>
import { reactive, computed, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableList';
import { getOutboundList } from '@/services/inwarehouse';
import { OUT_STATUS_OPTIONS, outStatusFilter } from '@/constants/inventor';

const router = useRouter();
const columns = computed(() => {
  return [
    {
      title: '出库编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
    },
    {
      title: '出库单号',
      dataIndex: 'related_order_id',
      key: 'related_order_id',
      align: 'center',
    },
    {
      title: '出库状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        return outStatusFilter(text);
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

interface FormStateType {
  related_order_id: string;
  status: string | undefined;
}

const formState: UnwrapRef<FormStateType> = reactive({
  related_order_id: '',
  status: undefined,
});

const STATE = reactive({
  printVisible: false,
  printCurrentRow: {},
});

// // 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
  sortedInfo,
} = useSearchTableList({
  fetchData: getOutboundList,
  formatParams() {
    return formState;
  },
});

// 出库详情
const handleOperateOut = (record: { id: string }, type: string) => {
  router.push({
    name: 'OutWarehouseDetail',
    query: { id: record.id, type: type },
  });
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
