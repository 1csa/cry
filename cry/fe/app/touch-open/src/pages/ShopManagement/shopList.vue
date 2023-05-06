<template>
  <div>
    <a-card class="table-box mt20">
      <a-row class="action-btn-box" justify="space-between">
        <a-col></a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleOperate()">创建门店</a-button>
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
        <template #bodyCell="{ column, text, record }">
          <template v-if="['sign_in_code', 'images', 'measure_code'].includes(column.dataIndex)">
            <PreviewImgModal :src="Array.isArray(text) ? text[0] : text" />
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="1"
              :unCheckedValue="2"
              checked-children="已启用"
              un-checked-children="已停用"
              @change="handleEnableShop(record)"
            />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button
              type="link"
              danger
              class="action-btn"
              :disabled="record.status === 1"
              @click="handleDelShop(record)"
              >删除</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>
    <general-form-model
      v-if="generalModelState.visible"
      title="门店"
      :form-data="shopAddFormFn"
      @success="handleAddShop"
      @cancel="handleCancelgeneralModel"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopList',
};
</script>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableListV2';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import type { ShopListOptionType, UpdateShopType } from '@/services/shop';
import { getShopList, updateShop, enableShop } from '@/services/shop';
import { shopStatusFilter } from '@/constants/shop';
import GeneralFormModel from './components/GeneralFormModel.vue';
import { shopAddFormFn } from './constants';
import { message } from 'ant-design-vue';
import { getImgOgriginUrl } from '@/utils/utils';

interface ModelStateType {
  visible: boolean;
  currentRow: Partial<{}>;
}
const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '门店ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '门店地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '门店码',
      dataIndex: 'sign_in_code',
      key: 'sign_in_code',
      align: 'center',
    },
    // {
    //   title: '量体码',
    //   dataIndex: 'measure_code',
    //   key: 'measure_code',
    //   align: 'center',
    // },
    {
      title: '门店图片',
      dataIndex: 'images',
      key: 'images',
      align: 'center',
      customRender: ({ text }: { text: any }) => {
        return text.length ? text[0] : '';
      },
    },
    {
      title: '门店状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

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
  fetchData: getShopList,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    return data;
  },
  listFormatEnum: true,
});
const generalModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});

const handleAddShop = async (val: UpdateShopType) => {
  let params = {
    ...val,
    cover_img_url: val.cover_img_url && getImgOgriginUrl(val.cover_img_url),
    op_type: 1,
  };
  await updateShop(params);
  message.success('创建成功!');
  getList();
};

const handleDelShop = async (record: ShopListOptionType) => {
  let params = {
    shop_id: record.id,
    op_type: 2,
  };
  await updateShop(params);
  message.success('操作成功!');
  getList();
};

const handleCancelgeneralModel = () => {
  generalModelState.visible = false;
};
// 编辑，查看
const handleOperate = (record: {} = {}) => {
  generalModelState.visible = true;
  generalModelState.currentRow = record;
};

const handleEnableShop = async (record: ShopListOptionType) => {
  try {
    await enableShop({
      shop_id: record.id,
      op_type: record.status === 2 ? 1 : 2,
    });
  } catch (error) {
    getList();
  }
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
