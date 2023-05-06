<template>
  <a-card class="search-box">
    <a-form ref="searchFormRef" layout="inline" :model="formState">
      <a-row :gutter="[24, 16]">
        <a-col>
          <a-form-item label="用户ID" name="id">
            <a-input
              v-model:value.trim="formState.id"
              placeholder="用户ID"
              autocomplete="off"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="用户昵称" name="nickname">
            <a-input
              v-model:value.trim="formState.nickname"
              placeholder="请输入用户昵称"
              autocomplete="off"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="手机尾号" name="mobile_suffix">
            <a-input
              v-model:value.trim="formState.mobile_suffix"
              placeholder="请输入用户手机尾号"
              autocomplete="off"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="用户身型" name="carriage">
            <a-select
              v-model:value="formState.carriage"
              style="width: 120px"
              :options="CARRIAGE_OPTIONS"
              allow-clear
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="用户肤色" name="skin_colour">
            <a-select
              v-model:value="formState.skin_colour"
              style="width: 120px"
              :options="SKIN_COLOUR_OPTIONS"
              allow-clear
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="用户类型" name="user_type">
            <a-select
              v-model:value="formState.user_type"
              style="width: 200px"
              :options="USER_TYPE_OPTIONS"
              allow-clear
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="用户注册时间" name="registration_time">
            <a-range-picker
              v-model:value="formState.registration_time"
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
          <a-popconfirm
            title="是否确认为此用户开通会员?"
            ok-text="确认"
            cancel-text="取消"
            :disabled="record.user_type !== 3"
            @confirm="handleOpenVip(record)"
          >
            <a-button type="link" class="action-btn" :disabled="record.user_type !== 3"
              >开通会员</a-button
            >
          </a-popconfirm>
          <a-button type="link" @click="gotoUserDetail(record)" class="action-btn"
            >用户详情</a-button
          >
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
export default {
  name: 'UsersList',
};
</script>
<script lang="ts" setup>
import { reactive, computed, type UnwrapRef } from 'vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { fetchUserList, fetchAddMembership } from '@/services/user';
import {
  CARRIAGE_OPTIONS,
  carriageFilter,
  SKIN_COLOUR_OPTIONS,
  skinColourFilter,
  USER_TYPE_OPTIONS,
  userTypeFilter,
} from '@/constants/user';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormState {
  id: string;
  mobile: string;
  nickname: string;
  carriage: string;
  skin_colour: string;
  user_type: string;
  registration_time: [string, string];
  formState: string;
  mobile_suffix: string;
}

const dateFormat = 'YYYY-MM-DD';

const columns = computed(() => {
  return [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '用户身型',
      dataIndex: 'carriage',
      key: 'carriage',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        return carriageFilter(text);
      },
    },
    {
      title: '用户肤色',
      dataIndex: 'skin_color',
      key: 'skin_color',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        return skinColourFilter(text);
      },
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      key: 'user_type',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        return userTypeFilter(text);
      },
    },
    {
      title: '用户注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const formState: UnwrapRef<FormState> = reactive({
  id: '',
  mobile: '',
  nickname: '',
  carriage: '',
  skin_colour: '',
  user_type: '',
  registration_time: ['', ''],
  mobile_suffix: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, getList, searchFormRef, onTableChange } =
  useSearchTableList({
    fetchData: fetchUserList,
    formatParams() {
      const data: Record<string, any> = { ...formState };
      data.start_time = data.registration_time && data.registration_time[0];
      data.end_time = data.registration_time && data.registration_time[1];
      delete data['registration_time'];
      data.id = Number(data.id);
      return data;
    },
  });

const handleOpenVip = async (record: { id: string }) => {
  await fetchAddMembership({ user_id: record.id });
  message.success('开通成功！');
  await getList();
};
const gotoUserDetail = (record: any) => {
  console.log('record', record);

  router.push({
    name: 'UserDetail',
    query: { id: record.id },
  });
};
</script>

<style lang="less" scoped></style>
