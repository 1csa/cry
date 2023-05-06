<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="关联单号" name="return_order_id">
              <a-input v-model:value.trim="formState.return_order_id" placeholder="请输入关联单号" autocomplete="off"
                allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品条形码" name="bar_code">
              <a-input v-model:value.trim="formState.bar_code" placeholder="请输入商品条形码" autocomplete="off" allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品名称" name="name">
              <a-input v-model:value.trim="formState.name" placeholder="请输入商品名称" autocomplete="off" allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="处理状态" name="status">
              <a-select style="min-width: 120px" v-model:value="formState.status" :options="DEFECT_STATUS_OPTIONS"
                placeholder="请选择" allow-clear />
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
      <a-table rowKey="id" :columns="columns" :data-source="dataSource" :pagination="pagination" bordered
        @change="onTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'cover_img_url'">
             <PreviewImgModal :src="text"/>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" :disabled="record.status != 10" @click="handleOperate(record, 11)">
              记录</a-button>
            <a-button type="link" class="action-btn" :disabled="record.status != 10" @click="handleOperate(record, 12)">
              返还</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'DefectManage',
};
</script>

<script lang="ts" setup>
import type { DefectFormStateType } from '@/types/inventory/inventory';
import type { UnwrapRef } from 'vue';
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { getDefectiveProductList, updateDefective } from '@/services/inwarehouse';
import useSearchTableList from '@/composables/useSearchTableList';
import { DEFECT_STATUS_OPTIONS, defectStatusFilter } from '@/constants/inventor';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: '关联单号',
    dataIndex: 'return_order_id',
    key: 'return_order_id',
    align: 'center',
  },
  {
    title: '商品条形码',
    dataIndex: 'bar_code',
    key: 'bar_code',
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
    title: '颜色',
    dataIndex: 'colour_name',
    key: 'colour_name',
    align: 'center',
    width: 90,
  },
  {
    title: '尺码',
    dataIndex: 'size_name',
    key: 'size_name',
    align: 'center',
    width: 90,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '联系方式',
    dataIndex: 'mobie',
    key: 'mobie',
    align: 'center',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return defectStatusFilter(text)
    },
  },
  {
    title: '操作人',
    dataIndex: 'op_user',
    key: 'op_user',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const formState: UnwrapRef<DefectFormStateType> = reactive({
  return_order_id: '',
  bar_code: '',
  name: '',
  status: undefined
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
} = useSearchTableList({
  fetchData: getDefectiveProductList,
  formatParams() {
    return formState;
  },
});

// 记录、返还 操作
const handleOperate = async (record: { id: string }, status: number) => {
  try {
    const { code, msg } = await updateDefective({ id: parseInt(record.id), status: status });
    if (code === 0) {
      message.success('操作成功');
      getList();
    } else {
      message.error(msg);
    }
  } catch (error) { }

};

</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.action-btn {
  padding: 0 5px;
}
</style>
