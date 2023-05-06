<template>
  <div>
    <SelectShopForm :fixed="true" @change="handleShopChange">
      <template v-slot:search>
        <a-card class="search-box-wrap mb15">
          <a-tabs
            v-model:activeKey="formState.status"
            type="card"
            :tabBarGutter="6"
            class="search-tabs"
            @change="handelStatusChange"
          >
            <a-tab-pane
              v-for="item in SHOP_SUIT_STATUS_OPTIONS"
              :key="item.value"
              :tab="item.label"
            ></a-tab-pane>
          </a-tabs>
          <SearchForm
            :form-data="FORMDATA"
            :modelRef="modelRef"
            :validateInfos="validateInfos"
            @search="onSearch"
            @reset="onReset"
          />
        </a-card>
      </template>
      <template v-slot:main>
        <a-card class="table-box mt20">
          <a-row class="action-btn-box" justify="space-between">
            <a-col></a-col>
            <a-col>
              <a-space>
                <a-button type="primary" v-if="formState.status === '2'" @click="expressSelect"
                  >门店返货</a-button
                >
              </a-space>
            </a-col>
          </a-row>
          <a-table
            rowKey="id"
            :columns="columns"
            :row-selection="rowSelection"
            :data-source="dataSource"
            :pagination="pagination"
            bordered
            @change="onTableChange"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'cover_img_url'">
                <PreviewImgModal :src="text" />
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button
                  type="link"
                  class="action-btn"
                  v-if="['2', '4', '1', '5'].includes(record.status.toString())"
                  @click="handlebatch(record)"
                  >{{ suitButtonFilter(record.status) }}</a-button
                >
                <!-- <a-button
                  type="link"
                  class="action-btn"
                  v-if="['1'].includes(record.status)"
                  @click="handlebatch(record)"
                  >上线</a-button
                > -->

                <a-button
                  type="link"
                  class="action-btn"
                  @click="handleOperateGoods(record, 'readonly')"
                  >详情</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </template>
    </SelectShopForm>
    <off-line-reason-model
      v-if="offLineReasonModelState.visible"
      :ids="offLineReasonModelState.ids"
      :shopId="(formState.shopId as number)"
      @success="getList"
      @cancel="offLineReasonModelState.visible = false"
    />
    <ExpressSelect
      type="all"
      @selected="handleUpdateShopStock"
      v-model:visible="expressModalVisible"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopSuit',
};
</script>
<script lang="ts" setup>
import type { shopId, ShopStateType } from '@/types/shop/shop';
import { reactive, computed, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableListV2';
import type { UpdateShopSuitStock } from '@/services/shop';
import { getShopSuitList, shiftShopSuit, updateShopSuitStock } from '@/services/shop';
import { CATEGORY_OPTIONS } from '@/constants/index';
import { SHOP_SUIT_STATUS_OPTIONS, suitButtonFilter } from '@/constants/matchSuit';
import { FormStateType } from '@/types/matchSuit/matchSuit';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import SelectShopForm from './components/SelectShopForm.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { suitSearchFormFn } from './constants';
import { categoryFormat } from '@/utils/utils';
import OffLineReasonModel from '@/pages/MatchSuit/components/OffLineReasonModel.vue';
import ExpressSelect from '@/components/ExpressSelect/index.vue';

interface ModelStateType {
  visible: boolean;
  ids: string[] | [];
}

const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  const status = formState.status;
  const baseColumns = [
    {
      title: '套装ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
    },
    {
      title: '套装名称',
      dataIndex: 'suit_name',
      key: 'suit_name',
      align: 'center',
    },
    {
      title: '套装封面图',
      dataIndex: 'cover_img_url',
      key: 'cover_img_url',
      align: 'center',
    },
    {
      title: '商品数量',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'op_user',
      key: 'op_user',
      align: 'center',
    },
    {
      title: '上次保存时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'update_time' && sorted.order,
      status: ['0', '4'],
      width: 300,
    },
    {
      title: '上架时间',
      dataIndex: 'arrive_time',
      key: 'arrive_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'arrive_time' && sorted.order,
      status: ['1'],
    },
    // {
    //   title: '上线时间',
    //   dataIndex: 'arrive_time',
    //   key: 'arrive_time',
    //   align: 'center',
    //   sorter: true,
    //   sortOrder: sorted.columnKey === 'arrive_time' && sorted.order,
    //   status: ['5'],
    // },
    {
      title: '下架时间',
      dataIndex: 'withdraw_time',
      key: 'withdraw_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'withdraw_time' && sorted.order,
      status: ['2'],
    },
    {
      title: '下架原因',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
      status: ['2'],
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 280,
    },
  ];

  return baseColumns.filter((ele) => {
    const s = ele?.status;
    if (!s || s.includes(status)) {
      return ele;
    }
  });
});
const FORMDATA = suitSearchFormFn();
const dateFormat = 'YYYY-MM-DD';
interface FormStateType {
  status: string;
  shopId: shopId;
}
const formState: UnwrapRef<FormStateType> = reactive({
  status: '1',
  shopId: null,
});

const handelStatusChange = (val: string) => {
  formState.status = val;
  onReset();
};
const handleShopChange = (e: number) => {
  formState.shopId = e;
  onReset();
};
const expressModalVisible = ref(false);
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
  rowSelection,
  selectedRowKeys,
  modelRef,
  validateInfos,
} = useSearchTableList({
  fetchData: getShopSuitList,
  formData: FORMDATA,
  formatParams() {
    const data: Record<string, any> = { ...modelRef };
    data.update_start_time = data.updateDate && data.updateDate[0];
    data.update_end_time = data.updateDate && data.updateDate[1];
    data.arrive_start_time = data.arriveDate && data.arriveDate[0];
    data.arrive_end_time = data.arriveDate && data.arriveDate[1];
    data.shop_id = formState.shopId;
    data.status = parseInt(formState.status);
    delete data['updateDate'];
    delete data['arriveDate'];
    categoryFormat(data);
    return data;
  },
  listFormatEnum: true,
  firstLoaded: false,
});

const offLineReasonModelState = reactive<ModelStateType>({
  visible: false,
  ids: [],
});

// 批量/单个操作
const handlebatch = async (record: { id?: string; status: string }) => {
  if (!record.id && !selectedRowKeys.value.length) {
    message.error('请选择套装');
    return;
  }
  const data = {
    suit_list: record.id ? [record.id] : selectedRowKeys.value,
    op_type: record.status == '1' ? 2 : 1,
    shop_id: formState.shopId,
  };
  if (record.status == '1') {
    offLineReasonModelState.visible = true;
    offLineReasonModelState.ids = data.suit_list;
    return;
  } else {
    await shiftShopSuit(data);
  }
  message.success('操作成功');
  selectedRowKeys.value = [];
  getList();
};
const expressSelect = () => {
  if (!selectedRowKeys.value.length) {
    message.error('请选择套装');
    return;
  }
  expressModalVisible.value = true;
};

const handleUpdateShopStock = async (express_type: number) => {
  const params = {
    suit_list: selectedRowKeys.value.map(item => { return  Number(item)}),
    op_type: 2,
    shop_id: formState.shopId,
    express_type,
  };
  await updateShopSuitStock(params as UpdateShopSuitStock);
  message.success('操作成功');
  selectedRowKeys.value = [];
  expressModalVisible.value = false;
  getList();
};

// 商品复制，编辑，查看
const handleOperateGoods = (record: { id: string }, type: string) => {
  if (type === 'distribution') {
  } else {
    router.push({
      name: 'SuitCreate',
      query: record.id
        ? {
            id: record.id,
            type: type,
          }
        : {
            type: type,
          },
    });
  }
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
