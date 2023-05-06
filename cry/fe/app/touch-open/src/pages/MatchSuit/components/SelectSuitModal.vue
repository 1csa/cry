<!-- 选择商品弹窗 -->
<template>
  <a-modal
    title="总库配货"
    :visible="true"
    :maskClosable="false"
    centered
    width="80%"
    destroyOnClose
    :body-style="{ height: '80vh', 'overflow-y': 'auto' }"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <SelectShopForm @change="handleShopChange" style="margin-top: -24px">
      <template v-slot:search>
        <SearchForm
          :form-data="FORMDATA"
          :modelRef="modelRef"
          :validateInfos="validateInfos"
          @search="onSearch"
          @reset="onReset"
        />
      </template>
      <template v-slot:main>
        <a-card class="table-box mt20">
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
            </template>
          </a-table>
        </a-card>
      </template>
    </SelectShopForm>
    <ExpressSelect type="all" @selected="handleSubmit" v-model:visible="expressModalVisible" />
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, onMounted, toRefs, UnwrapRef, Ref, computed, ref } from 'vue';
import { message, Form } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableListV2';
import { getSuitListBackend } from '@/services/matchSuit';
import SelectShopForm from '@/pages/ShopManagement/components/SelectShopForm.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { cloneDeep } from 'lodash';
import { suitSearchFormFn } from '@/pages/ShopManagement/constants';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import type { UpdateShopSuitStock } from '@/services/shop';
import { updateShopSuitStock } from '@/services/shop';
import ExpressSelect from '@/components/ExpressSelect/index.vue';

const expressModalVisible = ref(false);

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
      title: '上架时间',
      dataIndex: 'arrive_time',
      key: 'arrive_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'arrive_time' && sorted.order,
      status: ['1'],
    },
    {
      title: '门店状态',
      dataIndex: 'in_shop_status',
      key: 'in_shop_status',
      align: 'center',
      customRender: ({ text }: { text: boolean }) => {
        return text ? '有' : '无';
      },
    },
  ];

  return baseColumns.filter((ele) => {
    const s = ele?.status;
    if (!s || s.includes(status as string)) {
      return ele;
    }
  });
});
const FORMDATA = suitSearchFormFn();

const emit = defineEmits(['success', 'cancel']);

const formState = reactive({
  shopId: null,
  status: '1',
});

const handleShopChange = (e: number) => {
  formState.shopId = e;
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
  rowSelection,
  selectedRowKeys,
  modelRef,
  validateInfos,
} = useSearchTableList({
  fetchData: getSuitListBackend,
  formData: FORMDATA,
  pageSize: 10,
  formatParams() {
    const data: Record<string, any> = { ...modelRef, ...formState };
    data.arrive_start_time = data.arriveDate && data.arriveDate[0];
    data.arrive_end_time = data.arriveDate && data.arriveDate[1];
    data.status = Number(data.status);
    data.shop_id = data.shopId;
    delete data['arriveDate'];
    delete data['shopId'];
    return data;
  },
  listFormatEnum: true,
  firstLoaded: false,
});

const openExpressSelect = () => {
  if (!selectedRowKeys.value.length) {
    message.error('请选择套装');
    return;
  }
  expressModalVisible.value = true;
};
const handleSubmit = async (express_type: number) => {
  if (!selectedRowKeys.value.length) {
    message.error('请选择套装');
    return;
  }
  const params = {
    // suit_list: ['148'],
    suit_list: selectedRowKeys.value,
    op_type: 1,
    shop_id: formState.shopId,
    //express_type,
  };
  await updateShopSuitStock(params as UpdateShopSuitStock);
  selectedRowKeys.value = [];
  message.success('操作成功');
  emit('success');
  onModalClose();
  expressModalVisible.value = false;
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};
</script>
