<template>
  <div>
    <SelectShopForm  :fixed="true" @change="handleShopChange">
      <template v-slot:search>
        <a-card class="search-box">
          <a-form ref="searchFormRef" layout="inline">
            <a-row :gutter="[24, 16]">
              <template v-for="(field, key) in FORMDATA" :key="key">
                <a-col>
                  <BaseFormItem
                    :field="(field as unknown as FieldType)"
                    :modelRef="modelRef"
                    :fieldkey="key"
                    :validateInfos="validateInfos"
                  />
                </a-col>
              </template>
              <a-col style="text-align: right">
                <a-form-item>
                  <a-space :size="20">
                    <a-button type="primary" @click="handleUpdateInfo('submit')">更新</a-button>
                    <a-button @click="handleUpdateInfo('cancel')">取消</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </template>
      <template v-slot:main>
        <a-card class="table-box mt20">
          <a-row class="action-btn-box" justify="space-between">
            <a-col></a-col>
            <a-col>
              <a-space>
                <a-button type="primary" @click="handleOperateRoom('add')">增加</a-button>
                <a-button type="danger" ghost @click="handleOperateRoom('del')">删除</a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-table
            rowKey="room_id"
            :columns="columns"
            :data-source="dataSource"
            :pagination="null"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'category'">
                <a-select
                  v-model:value="record[column.dataIndex]"
                  :bordered="false"
                  :options="FITTINGROOM_TYPE_OPTIONS"
                  :disabled="record.status == 1"
                  @change="handleRoomTypeChange($event, record)"
                />
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button
                  type="link"
                  class="action-btn"
                  v-if="record.category == 2"
                  @click="handleOperateEnable(record)"
                  >{{ record.status == 0 ? '启用' : '停用' }}</a-button
                >
                <a-button
                  type="link"
                  class="action-btn"
                  v-if="record.category == 1"
                  @click="handleOperateMigrate(record)"
                  >{{ record.migrate_room_id == 0 ? '迁移' : '恢复' }}</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </template>
    </SelectShopForm>
    <a-modal
      v-model:visible="migrateModelState.visible"
      title="迁移试衣间"
      @ok="handleRecoverMigrate"
      width="300px"
    >
      <a-input type="number" v-model:value.trim="migrateModelState.currentRow.migrate_room_id" />
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopFittingroom',
};
</script>
<script lang="ts" setup>
import type { ShopStateType } from '@/types/shop/shop';
import type {
  ActionDressingRoomType,
  DressingRoomListOptionType,
  EnableDressingRoomType,
  MigrateDressingRoomType,
  ShopReserveType,
  UpdateDressingRoomCategory,
} from '@/services/shop';
import type { FieldType } from '@/components/BaseFormItem/index-v2.vue';
import { computed, reactive, UnwrapRef, ref, toRaw } from 'vue';
import { message, Form } from 'ant-design-vue';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index-v2.vue';
import { fittingRoomStatusFilter, FITTINGROOM_TYPE_OPTIONS } from '@/constants/shop';
import SelectShopForm from './components/SelectShopForm.vue';
import { fittingRoomFormFn } from './constants';
import {
  getDressingRoomList,
  addDressingRoom,
  delDressingRoom,
  setShopReserve,
  enableDressingRoom,
  migrateDressingRoom,
  updateDressingRoomCategory,
} from '@/services/shop';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { div } from '@/utils/utils';

interface ModelStateType {
  visible: boolean;
  currentRow: Partial<DressingRoomListOptionType>;
}
const columns = computed(() => {
  return [
    {
      title: '试衣间序号',
      dataIndex: 'room_id',
      key: 'room_id',
      align: 'center',
    },
    {
      title: '试衣间状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      customRender: ({ text, record }: { text: number; record: DressingRoomListOptionType }) => {
        return record.migrate_room_id == 0
          ? fittingRoomStatusFilter(text)
          : `迁移-${record.migrate_room_id}`;
      },
    },
    {
      title: '试衣间用途',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: '试衣间操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const dateFormat = 'HH:mm:ss';

const useForm = Form.useForm;

const FORMDATA = fittingRoomFormFn();

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA as any);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const roomState: UnwrapRef<ShopStateType> = reactive({
  shopId: null,
});
const dataSource = ref<DressingRoomListOptionType[]>([]);

const handleShopChange = (e: number) => {
  roomState.shopId = e;
  getRoomList();
};

const getRoomList = async () => {
  const res = await getDressingRoomList({
    shop_id: roomState.shopId,
  });
  const { list, reserve_info } = res.result;
  dataSource.value = list;
  reserve_info.reserve_time = [
    dayjs(reserve_info.start_reserve_time, 'HH:mm:ss'),
    dayjs(reserve_info.end_reserve_time, 'HH:mm:ss'),
  ];
  Object.assign(modelRef, reserve_info);
};

// getRoomList();
const diffHours = (times: any) => {
  const d1 = new Date(times[0]).getTime();
  const d2 = new Date(times[1]).getTime();
  const diff = d2 - d1;
  const diffMins = div(diff, 60000);
  if (diffMins % modelRef.time_step === 0) {
    return true;
  } else {
    message.error('当前输入时间段不符合预约周期，请重新设置');
    return false;
  }
};
const handleUpdateInfo = async (type: string) => {
  if (type === 'submit') {
    await validate();
    // if (!diffHours(modelRef.reserve_time)) return;
    const params = toRaw(modelRef as ShopReserveType);
    params.start_reserve_time = params.reserve_time && params.reserve_time[0].format(dateFormat);
    params.end_reserve_time = params.reserve_time && params.reserve_time[1].format(dateFormat);
    params.shop_id = roomState.shopId;
    delete params['reserve_time'];
    await setShopReserve(params);
    message.success('更新成功!');
    getRoomList();
  }
  if (type === 'cancel') {
    resetFields();
    getRoomList();
  }
};

const handleOperateRoom = async (type: 'add' | 'del') => {
  let params: ActionDressingRoomType = {
    shop_id: roomState.shopId,
    count: 1,
  };
  if (type === 'add') {
    await addDressingRoom(params);
  }
  if (type === 'del') {
    await delDressingRoom(params);
  }
  getRoomList();
};

const handleRoomTypeChange = async (v: 1 | 2, record: DressingRoomListOptionType) => {
  let params: UpdateDressingRoomCategory = {
    shop_id: roomState.shopId,
    room_id: record.room_id,
    op_type: v,
  };
  await updateDressingRoomCategory(params);
};
const handleOperateEnable = async (record: DressingRoomListOptionType) => {
  let params: EnableDressingRoomType = {
    shop_id: roomState.shopId,
    room_id: record.room_id,
    op_type: record.status == 0 ? 2 : 1,
  };
  await enableDressingRoom(params);
  getRoomList();
};
const migrateModelState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
});
const handleOperateMigrate = async (record: DressingRoomListOptionType) => {
  if (record.migrate_room_id == 0) {
    migrateModelState.visible = true;
    migrateModelState.currentRow = cloneDeep(record);
    migrateModelState.currentRow.migrate_room_id = '' as unknown as number;
    return;
  }
  let params: MigrateDressingRoomType = {
    shop_id: roomState.shopId,
    room_id: record.room_id,
    op_type: 2,
  };
  await migrateDressingRoom(params);
  getRoomList();
};

const handleRecoverMigrate = async () => {
  if (!migrateModelState.currentRow.migrate_room_id) {
    message.error('目标试衣间编号不能为空！');
    return;
  }
  let params: MigrateDressingRoomType = {
    shop_id: roomState.shopId,
    room_id: migrateModelState.currentRow.room_id,
    target_room_id: Number(migrateModelState.currentRow.migrate_room_id),
    op_type: 1,
  };

  await migrateDressingRoom(params);
  migrateModelState.visible = false;
  getRoomList();
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
