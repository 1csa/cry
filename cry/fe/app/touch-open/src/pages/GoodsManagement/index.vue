<template>
  <div>
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
                change-on-select
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="季节" name="season">
              <a-select
                style="min-width: 150px"
                v-model:value="formState.season"
                :options="SEASON_OPTIONS"
                placeholder="请选择季节"
                mode="multiple"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="尺码" name="size_code">
              <a-select
                style="min-width: 150px"
                v-model:value="formState.size_code"
                :options="SIZE_CODE_OPTIONS"
                placeholder="请选择尺码"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="保存时间" name="date">
              <a-range-picker
                v-model:value="formState.date"
                :format="dateFormat"
                allow-clear
                @change="handleChange"
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
      <a-row class="action-btn-box">
        <a-button type="primary" @click="handleOperateGoods({ sku: '' }, 'create')"
          >添加商品</a-button
        >
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
          <template v-if="column.dataIndex === 'cover_img_url'">
            <PreviewImgModal :src="text" />
          </template>
          <template v-if="column.dataIndex === 'stock_num'">
            <a-typography-text :type="text <= 1 ? 'danger' : ''">{{ text }}</a-typography-text>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'readonly')"
              >详情</a-button
            >
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'copy')"
              >复制</a-button
            >
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'edit')"
              >编辑</a-button
            >
            <a-button type="link" class="action-btn" @click="handleDelete(record)">删除</a-button>
            <!-- <a-button type="link" class="action-btn" @click="handlePrint(record)">打印条形码</a-button> -->
          </template>
        </template>
      </a-table>
    </a-card>
    <print-modal
      v-model:visible="STATE.printVisible"
      :goods-info="STATE.printCurrentRow"
      @success="getList"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'GoodsList',
};
</script>
<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList, deleteProduct } from '@/services/goods';
import PrintModal from './components/PrintModal.vue';
import dayjs, { Dayjs } from 'dayjs';
import { CATEGORY_OPTIONS, SEASON_OPTIONS, SIZE_CODE_OPTIONS } from '@/constants/index';
import { FormStateType } from '@/types/goods/goods';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';

const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '商品编码',
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
      title: '商品类目',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: '颜色',
      dataIndex: 'colour_code',
      key: 'colour_code',
      align: 'center',
      width: 90,
    },
    {
      title: '尺码',
      dataIndex: 'size_code',
      key: 'size_code',
      align: 'center',
      width: 90,
    },
    {
      title: '成本价',
      dataIndex: 'cost_amount',
      key: 'cost_amount',
      align: 'center',
      width: 120,
      customRender: ({ text }: { text: any }) => {
        return '¥' + (text / 100).toFixed(2);
      },
      sorter: true,
      sortOrder: sorted.columnKey === 'cost_amount' && sorted.order,
    },
    {
      title: '库存量',
      dataIndex: 'stock_num',
      key: 'stock_num',
      align: 'center',
      width: 90,
      sorter: true,
      sortOrder: sorted.columnKey === 'stock_num' && sorted.order,
    },
    {
      title: '保存时间',
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
  name: '',
  category: [],
  season: [],
  size_code: '',
  date: [dayjs().subtract(7, 'day'), dayjs()],
});

const STATE = reactive({
  printVisible: false,
  printCurrentRow: {},
});

const handleChange = (val: [Dayjs, Dayjs], dateStrings: []) => {
  // console.log(val, dateStrings);
};

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
  fetchData: getProductList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    data.start_time = data.date && data.date[0].format(dateFormat);
    data.end_time = data.date && data.date[1].format(dateFormat);
    delete data['date'];
    return data;
  },
  listFormatEnum: true,
});

// 删除商品
const handleDelete = ({ id }: { id: string }) => {
  Modal.confirm({
    title: '删除后将无法恢复，您确定要删除该商品吗',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      const { code, msg } = await deleteProduct({ id: id });
      if (code === 0) {
        message.success('删除成功');
        getList();
      } else {
        message.error(msg);
      }
    },
    onCancel() {
      return new Promise<void>((resolve, reject) => {
        resolve();
      });
    },
  });
};

// 商品复制，编辑，查看
const handleOperateGoods = (record: { sku: string }, type: string) => {
  router.push({
    name: 'GoodsCreate',
    query: record.sku
      ? {
          sku: record.sku,
          type: type,
        }
      : {
          type: type,
        },
  });
};

const handlePrint = (record: { sku: string }) => {
  STATE.printVisible = true;
  STATE.printCurrentRow = record;
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
