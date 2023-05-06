<template>
  <div>
    <SelectShopForm :fixed="true" @change="handleShopChange">
      <template v-slot:action>
        <template v-if="shopState.op_type">
          <a-button type="primary" @click="handleActionType('submit')">提交</a-button>
          <a-button @click="handleActionType('cancle')">取消</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="handleActionType(1)">补货</a-button>
          <a-button type="primary" @click="handleActionType(2)">退回</a-button>
        </template>
      </template>
      <template v-slot:search>
        <SearchForm
          :form-data="FORMDATA"
          :modelRef="modelRef"
          :validateInfos="validateInfos"
          @search="onSearch"
          @reset="onReset"
      /></template>
      <template v-slot:main>
        <a-card class="table-box">
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
              <template v-if="column.dataIndex === 'number'">
                <a-input-number
                  v-model:value="record[column.dataIndex]"
                  :max="shopState.op_type === 1 ? record.count : record.stock_count"
                  :min="0"
                  :precision="0"
                  :defaultValue="0"
                />
              </template>
            </template>
          </a-table>
        </a-card>
      </template>
    </SelectShopForm>
    <ExpressSelect
      type="all"
      @selected="handleExpressSelect"
      v-model:visible="expressModalVisible"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopInventory',
};
</script>
<script lang="ts" setup>
import type { shopId } from '@/types/shop/shop';
import { computed, reactive, Ref, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableListV2';
import {
  getShopStockList,
  ShopStockListOptionType,
  ShopStockOpListType,
  UpdateShopStock,
  updateShopStock,
} from '@/services/shop';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { inventorySearchFormFn } from './constants';
import SelectShopForm from './components/SelectShopForm.vue';
import { getInBoundList } from '@/services/inwarehouse';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import { categoryFormat } from '@/utils/utils';
import ExpressSelect from '@/components/ExpressSelect/index.vue';

const router = useRouter();
interface ShopStateType {
  shopId: shopId;
  op_type: number | string;
}
const shopState: UnwrapRef<ShopStateType> = reactive({
  shopId: null,
  op_type: 0,
});
const expressModalVisible = ref(false);
const columns = computed(() => {
  const arr = [
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
      title: '库存量',
      dataIndex: 'stock_count',
      key: 'stock_count',
      align: 'center',
      width: 90,
    },
    {
      title: '入库时间',
      dataIndex: 'inbound_time',
      key: 'inbound_time',
      align: 'center',
    },
    {
      title: `${shopState.op_type === 1 ? '补货' : '退回'}数量`,
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      action: [1, 2],
    },
  ];
  return arr.filter((ele) => {
    const s = ele?.action;
    if (!s || s.includes(shopState.op_type as number)) {
      return ele;
    }
  });
});

const FORMDATA = inventorySearchFormFn();
const dateFormat = 'YYYY-MM-DD';

const handleShopChange = (e: number) => {
  shopState.shopId = e;
  onReset();
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
  modelRef,
  validateInfos,
} = useSearchTableList({
  fetchData: getShopStockList,
  formData: FORMDATA,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    data.shop_id = shopState.shopId;
    categoryFormat(data);
    return data;
  },
  listFormatEnum: true,
  firstLoaded: false,
});
const handleExpressSelect = (express_type: number) => {
  actionSubmit(express_type);
};
// 编辑，查看
const handleActionType = (type: string | number) => {
  if (type === 'submit') {
    expressModalVisible.value = true;
    return;
  }
  if (type === 'cancle') {
    actionCancle();
    return;
  }
  shopState.op_type = type;
};

const actionSubmit = async (express_type: number) => {
  const list = cloneDeep(dataSource.value) as ShopStockListOptionType[];
  const op_list = [] as unknown as ShopStockOpListType[];
  list.map((item: ShopStockListOptionType) => {
    if (item.number > 0) {
      op_list.push({
        sku: item.sku,
        count: Number(item.number),
      });
    }
  });
  let params = {
    op_list: op_list,
    shop_id: shopState.shopId,
    op_type: shopState.op_type,
    express_type,
  };
  await updateShopStock(params as UpdateShopStock);
  message.success('操作成功');
  expressModalVisible.value = false;
  actionCancle();
};

const actionCancle = () => {
  shopState.op_type = 0;
  getList();
};
</script>

<style lang="less" scoped></style>
