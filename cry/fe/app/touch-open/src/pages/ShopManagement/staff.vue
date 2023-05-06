<template>
  <div>
    <SelectShopForm :fixed="true" @change="handleShopChange">
      <template v-slot:action>
        <a-button type="primary" @click="handleAdd()">创建员工</a-button>
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
                <!-- <a-button type="link" class="action-btn" @click="handleOperate(record)"
                  >详情</a-button
                > -->
                <a-button
                  type="link"
                  class="action-btn"
                  v-if="record.status === 1"
                  @click="handleOperate(record, 'status')"
                  >离职</a-button
                >
                <a-button
                  type="link"
                  class="action-btn"
                  v-if="record.status === 1"
                  @click="handleOperate(record, 'role')"
                  >权限</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </template>
    </SelectShopForm>
    <general-form-model
      v-if="generalModelState.visible"
      :info="generalModelState.currentRow"
      title="员工"
      :form-data="staffAddFormFn"
      :shop-id="shopState.shopId"
      @success="handleUpdateSuccess"
      @cancel="handleCancelgeneralModel"
    />
    <a-modal
      v-model:visible="roleModelState.visible"
      title="修改权限"
      @ok="handleRole"
      width="300px"
    >
      <a-radio-group v-model:value="roleModelState.currentRow.role" :options="STAFF_ROLE_OPTIONS" />
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopStaff',
};
</script>
<script lang="ts" setup>
import type { shopId } from '@/types/shop/shop';
import type { EmployeeListOptionType, UpdateEmployee } from '@/services/shop';
import { computed, reactive, UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash';
import useSearchTableList from '@/composables/useSearchTableListV2';
import { getEmployeeList, addEmployee, updateEmployee } from '@/services/shop';
import { staffSearchFormFn } from './constants';
import { staffRoleFilter, staffStatusFilter } from '@/constants/shop';
import SearchForm from '@/components/SearchForm/index.vue';
import SelectShopForm from './components/SelectShopForm.vue';
import GeneralFormModel from './components/GeneralFormModel.vue';
import { staffAddFormFn } from './constants';
import { message } from 'ant-design-vue';
import { STAFF_ROLE_OPTIONS } from '@/constants/shop';

interface ModelStateType {
  visible: boolean;
  currentRow: Partial<EmployeeListOptionType>;
}
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '员工编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '员工姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '出生年月',
      dataIndex: 'birthday',
      key: 'birthday',
      align: 'center',
    },
    {
      title: '员工状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 90,
      customRender: ({ text }: { text: number }) => {
        return staffStatusFilter(text);
      },
    },
    {
      title: '员工权限',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      width: 90,
      customRender: ({ text }: { text: number }) => {
        return staffRoleFilter(text);
      },
    },
    {
      title: '入职时间',
      dataIndex: 'entry_time',
      key: 'entry_time',
      align: 'center',
    },
    {
      title: '离职时间',
      dataIndex: 'leave_time',
      key: 'leave_time',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const FORMDATA = staffSearchFormFn();
const dateFormat = 'YYYY-MM-DD';
const shopState: UnwrapRef<{ shopId: shopId }> = reactive({
  shopId: null,
});
const handleShopChange = (e: number) => {
  shopState.shopId = e
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
  fetchData: getEmployeeList,
  formData: FORMDATA,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    data.shop_id = shopState.shopId;
    data.before_birthday = data.birthday && data.birthday[0].format(dateFormat);
    data.after_birthday = data.birthday && data.birthday[1].format(dateFormat);
    data.start_entry_time = data.entry_time && data.entry_time[0].format(dateFormat) + ' 00:00:00';
    data.end_entry_time = data.entry_time && data.entry_time[1].format(dateFormat) + ' 23:59:59';
    data.start_leave_time = data.leave_time && data.leave_time[0].format(dateFormat) + ' 00:00:00';
    data.end_leave_time = data.leave_time && data.leave_time[1].format(dateFormat) + ' 23:59:59';
    delete data['entry_time'];
    delete data['leave_time'];
    delete data['birthday'];
    return data;
  },
  firstLoaded: false,
});
const generalModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});
const roleModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});
const handleUpdateSuccess = async (val: any) => {
  let params = {
    ...val,
    shop_id: shopState.shopId,
    birthday: val.birthday.format(dateFormat),
  };
  await addEmployee(params);
  message.success('创建成功!');
  getList();
};
const handleCancelgeneralModel = () => {
  generalModelState.visible = false;
};
// 添加
const handleAdd = () => {
  generalModelState.visible = true;
};
// 编辑，查看
const handleOperate = async (record: EmployeeListOptionType, type: string = '') => {
  if (!type) {
    generalModelState.visible = true;
    generalModelState.currentRow = record;
    return;
  }
  if (type == 'role') {
    roleModelState.visible = true;
    roleModelState.currentRow = cloneDeep(record);
    return;
  }
  if (type == 'status') {
    let params: UpdateEmployee = {
      employee_id: record.id,
      status: record.status === 1 ? 2 : 1,
    };
    await handleUpdateEmployee(params);
  }
};

const handleUpdateEmployee = async (params: UpdateEmployee) => {
  await updateEmployee(params);
  message.success('修改成功!');
  getList();
};

const handleRole = async () => {
  let params: UpdateEmployee = {
    employee_id: roleModelState.currentRow.id,
    role: roleModelState.currentRow.role,
  };
  await handleUpdateEmployee(params);
  roleModelState.visible = false;
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
