<template>
  <div>
    <a-card class="search-box-wrap mb15">
      <a-card class="search-box">
        <a-form ref="searchFormRef" layout="inline" :model="formState">
          <a-row :gutter="[24, 16]">
            <a-col>
              <a-form-item label="采购单号" name="sku">
                <a-input
                  v-model:value.trim="formState.sku"
                  placeholder="请输入商品编码"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="采购类型" name="name">
                <a-select
                  v-model:value="formState.name"
                  style="width: 160px"
                  :options="PURCHASE_TYPE_OPTIONS"
                  placeholder="请选择"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="结算方式" name="suit_name">
                <a-select
                  v-model:value="formState.name"
                  style="width: 160px"
                  :options="CLOSE_TYPE_OPTIONS"
                  placeholder="请选择"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="货品名称" name="op_user">
                <a-input
                  v-model:value.trim="formState.op_user_name"
                  placeholder="请输入创建人"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="制单人" name="op_user">
                <a-input
                  v-model:value.trim="formState.op_user_name"
                  placeholder="请输入创建人"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="制单时间" name="updateDate">
                <a-range-picker
                  v-model:value="formState.updateDate"
                  :format="dateFormat"
                  :value-format="dateFormat"
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
    </a-card>
    <a-card class="table-box mt20">
      <a-row class="action-btn-box" type="flex" justify="space-between">
        <a-col flex="auto">
          <a-tabs
            v-model:activeKey="formState.status"
            type="card"
            :tabBarGutter="6"
            class="search-tabs"
            @change="handelStatusChange"
          >
            <a-tab-pane
              v-for="item in PURCHASE_STATUS_OPTIONS"
              :key="item.value"
              :tab="item.label"
            ></a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleOperate({ id: '' }, 'create')"
              >新建采购单</a-button
            >
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
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleClose(record)">关闭</a-button>
            <a-button type="link" class="action-btn" @click="handleOperate(record, 'readonly')"
              >详情</a-button
            >
            <a-button type="link" class="action-btn" @click="handleOperate(record, 'copy')"
              >采购</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>

  </div>
</template>
<script lang="ts">
export default {
  name: 'PurchaseManage',
};
</script>
<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getSuitListBackend, shiftSuit, delateSuit } from '@/services/matchSuit';
import { CATEGORY_OPTIONS } from '@/constants/index';
import {
  PURCHASE_STATUS_OPTIONS,
  purchaseStatusFilter,
  PURCHASE_TYPE_OPTIONS,
  CLOSE_TYPE_OPTIONS,
} from '@/constants/purchase';
import { FormStateType } from '@/types/purchase/purchase';

interface ModelStateType {
  visible: boolean;
  ids: string[] | [];
}

const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '采购单号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
    },
    {
      title: '采购类型',
      dataIndex: 'suit_name',
      key: 'suit_name',
      align: 'center',
    },
    {
      title: '单据状态',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        return purchaseStatusFilter(text);
      },
    },
    {
      title: '结算方式',
      dataIndex: 'suit_name',
      key: 'suit_name',
      align: 'center',
    },
    {
      title: '采购总数量',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
    },
    {
      title: '制单人',
      dataIndex: 'op_user',
      key: 'op_user',
      align: 'center',
    },
    {
      title: '制单时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'update_time' && sorted.order,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const dateFormat = 'YYYY-MM-DD';

const formState: UnwrapRef<FormStateType> = reactive({
  sku: '',
  name: undefined,
  category: [],
  status: '0',
  suit_name: '',
  op_user_name: '',
  updateDate: ['', ''],
  arriveDate: ['', ''],
});

const handelStatusChange = (val: string) => {
  formState.status = val;
  getList()
};

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
} = useSearchTableList({
  fetchData: getSuitListBackend,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    data.update_start_time = data.updateDate && data.updateDate[0];
    data.update_end_time = data.updateDate && data.updateDate[1];
    delete data['updateDate'];
    return data;
  },
  listFormatEnum: true,
});


// 关闭
const handleClose = async({ id }: { id: string }) => {
  await delateSuit({ id: id });
  message.success('删除成功');
  getList();
};

// 商品复制，编辑，查看
const handleOperate = (record: { id: string }, type: string) => {
  router.push({
    name: 'PurchaseDetail',
    query: record.id
      ? {
          id: record.id,
          type: type,
        }
      : {
          type: type,
        },
  });
};
</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.search-box {
  border: none;
  margin-bottom: 0;
}

.action-btn {
  padding: 0 5px;
}
</style>

<style lang="less">
.search-box-wrap {
  .ant-card-body {
    padding: 15px;
  }
}

.search-tabs {
  border: none;

  .ant-tabs-nav {
    margin: 0 !important;
  }

  .ant-tabs-top > .ant-tabs-nav::before {
    border-color: #ffffff;
  }
}
</style>
