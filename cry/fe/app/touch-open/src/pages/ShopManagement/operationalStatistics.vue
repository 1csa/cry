<template>
  <a-card>
    <a-select
      v-model:value="searchTimeTnterval"
      style="min-width: 200px"
      :options="statisticsState"
      placeholder="请选择筛选时间"
      :fieldNames="{ label: 'name', value: 'id' }"
      @change="handleDaysChange"
    >
    </a-select>
    <a-select
      v-model:value="currentShop"
      allow-clear
      placeholder="请筛选门店"
      style="min-width: 200px; margin-left: 10px"
      :options="shopOptions"
      @change="handleShopChange"
    >
    </a-select>
  </a-card>
  <a-card class="mt15">
    <a-row class="big-card">
      <a-col :span="5">
        <a-statistic title="预约人数" :value="staticsticsNumberData.all_reserve_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.all_reserve_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="5">
        <a-statistic title="到店人数" :value="staticsticsNumberData.all_reserve_sign_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.all_reserve_sign_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="5">
        <a-statistic title="试穿人数" :value="staticsticsNumberData.all_reserve_done_count"
          ><template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.all_reserve_done_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="5">
        <a-statistic title="量体人数" :value="staticsticsNumberData.all_measure_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.all_measure_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="4">
        <a-statistic
          title="收入流水"
          :value="staticsticsNumberData.all_current_account"
          style="margin-right: 50px"
        />
      </a-col>
    </a-row>
    <a-row class="small-card">
      <a-col :span="2">
        <a-statistic
          title="线上预约"
          :value="staticsticsNumberData.online_reserve_count"
          style="margin-right: 50px"
        >
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.online_reserve_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="3">
        <a-statistic title="线下预约" :value="staticsticsNumberData.offline_reserve_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.offline_reserve_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="2">
        <a-statistic title="线上" :value="staticsticsNumberData.online_reserve_sign_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.online_reserve_sign_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="3">
        <a-statistic title="线下" :value="staticsticsNumberData.offline_reserve_sign_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.offline_reserve_sign_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="2">
        <a-statistic title="线上已完成" :value="staticsticsNumberData.online_reserve_done_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.online_reserve_done_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="3">
        <a-statistic
          title="线下已完成"
          :value="staticsticsNumberData.offline_reserve_done_count"
          style="margin-right: 50px"
        >
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.offline_reserve_done_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="2">
        <a-statistic title="已完成总数" :value="staticsticsNumberData.measure_done_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.measure_done_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="3">
        <a-statistic title="已取消数量" :value="staticsticsNumberData.cancel_measure_count">
          <template #suffix>
            <div class="color-red test-data">
              ({{ staticsticsNumberData.measure_cancel_test_count }})
            </div>
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="2">
        <a-statistic title="套装收益" :value="staticsticsNumberData.product_current_account" />
      </a-col>
      <a-col :span="2">
        <a-statistic title="会员收益" :value="staticsticsNumberData.member_current_account" />
      </a-col>
    </a-row>
  </a-card>
  <a-card class="search-box-wrap mt15">
    <a-tabs
      v-model:activeKey="currentTab"
      type="card"
      :tabBarGutter="6"
      class="search-tabs"
      @change="handelScopeChange"
    >
      <a-tab-pane
        v-for="item in STATISTIC_TYPE_OPTIONS"
        :key="item.value"
        :tab="item.label"
      ></a-tab-pane>
    </a-tabs>
    <a-card class="search-box">
      <a-form v-if="currentTab !== 3" ref="searchFormRef" labelAlign="right" v-bind="layout">
        <a-row :gutter="24">
          <template v-for="(field, key) in searchFormOptions" :key="key">
            <a-col :span="8">
              <BaseFormItem
                :field="(field as FieldType)"
                :modelRef="modelRef"
                :fieldkey="key"
                :validateInfos="validateInfos"
              />
            </a-col>
          </template>
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
      <a-form v-else ref="measureSearchRef" labelAlign="right" v-bind="layout">
        <a-row :gutter="24">
          <template v-for="(field, key) in searchMeasureFormOptions" :key="key">
            <a-col :span="8">
              <BaseFormItem
                :field="(field as FieldType)"
                :modelRef="measureModelRef"
                :fieldkey="key"
                :validateInfos="measureValidateInfos"
              />
            </a-col>
          </template>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onMeasureSearch">查询</a-button>
                <a-button @click="onMeasureReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-card>
  <a-card class="table-box mt15" v-if="currentTab !== 3">
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      bordered
      @change="onTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'suit_img_list'">
          <div class="image-item">
            <PreviewImgModal v-for="item in text" :src="item" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'user_id'">
          <div :style="record.is_staff ? 'color: #F04134' : ''">
            {{ text }}
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-card class="table-box mt15" v-else>
    <a-table
      rowKey="id"
      :columns="measureColumn"
      :data-source="measureDataSource"
      :pagination="measurePagination"
      bordered
      @change="onMeasureTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'user_id'">
          <div :style="record.is_staff ? 'color: #F04134' : ''">
            {{ text }}
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-card class="table-box mt15" title="套装试穿Top50">
    <a-row class="mb15">
      <a-select
        v-model:value="top50SearchTimeTnterval"
        style="min-width: 200px"
        :options="statisticsState"
        placeholder="请选择筛选时间"
        :fieldNames="{ label: 'name', value: 'id' }"
        @change="handleDaysChange"
      >
      </a-select>
      <a-select
        v-model:value="top50CurrentShop"
        allow-clear
        placeholder="请筛选门店"
        style="min-width: 200px; margin-left: 10px"
        :options="shopOptions"
        @change="handleShopChange"
      >
      </a-select>
    </a-row>

    <a-table
      rowKey="id"
      :columns="top50Column"
      :data-source="top50DataSource"
      :pagination="false"
      bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'cover_img_url'">
          <div class="image-item">
            <PreviewImgModal :src="text" />
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
</template>
<script lang="ts">
export default {
  name: 'OperationalStatistics',
};
</script>
<script lang="ts" setup>
import { reactive, computed, ref, toRaw, h } from 'vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableListV2';
import {
  getStatisticsReserveList,
  getShopList,
  getStatisticsNumber,
  getStatisticsMeasureList,
  getStatisticsTop50List,
} from '@/services/shop';
import { STATISTIC_TYPE_OPTIONS, fittingRoomTypeFilter, userTypeFilter } from '@/constants/shop';
import { skinColourFilter, carriageFilter } from '@/constants/user';
import { statisticsSearchFormFn, measureBodySearchFormFn } from './constants';
import BaseFormItem, { type FieldType } from '@/components/BaseFormItem/index-v2.vue';
import { div, formatEnum } from '@/utils/utils';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';

const router = useRouter();

const layout = reactive({
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 14,
  },
});

const searchTimeTnterval = ref();
const currentShop = ref();

const top50SearchTimeTnterval = ref();
const top50CurrentShop = ref();

const currentTab = ref(1);

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      align: 'center',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '昵称/备注',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'user_flag',
      key: 'user_flag',
      align: 'center',
      customRender({ text }: { text: number[] }) {
        if (text && text.length > 0) {
          return text
            .map((item) => {
              return userTypeFilter(item);
            })
            .join(' ');
        }
        return '';
      },
    },
    {
      title: '活动',
      dataIndex: 'activity',
      key: 'activity',
      align: 'center',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
    },
    {
      title: '预约发起时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'create_time' && sorted.order,
    },
    {
      title: '预约类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      customRender({ text }: { text: number }) {
        return fittingRoomTypeFilter(text);
      },
    },
    {
      title: '预约门店',
      dataIndex: 'shop_name',
      key: 'shop_name',
      align: 'center',
    },
    {
      title: '试衣间',
      dataIndex: 'reserve_room_id',
      key: 'reserve_room_id',
      align: 'center',
    },
    {
      title: '预约时段',
      dataIndex: 'reserve_time',
      key: 'reserve_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'reserve_time' && sorted.order,
    },
    {
      title: '到店时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'sign_time' && sorted.order,
    },
    {
      title: '离店时间',
      dataIndex: 'leave_time',
      key: 'leave_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'leave_time' && sorted.order,
    },
    {
      title: '套装ID',
      dataIndex: 'suit_id_list',
      key: 'suit_id_list',
      align: 'center',
      customRender({ text, record }: { text: number[]; record: Record<string, any> }) {
        const suit_product_list = record.suit_product_list
          ? record.suit_product_list.map((item: Record<string, any>) => {
              item = formatEnum(toRaw(item)) as Record<string, any>;
              return item;
            })
          : [];

        if (text && text.length > 0) {
          return h(
            'div',
            text.map((item, index) => {
              let productInfo = suit_product_list[index]
                .map((info: Record<string, any>) => {
                  return `${info.category.split('/')[2]}: ${info.size_code}，`;
                })
                .join('');
              productInfo = productInfo.slice(0, productInfo.length - 1);
              return h('div', {
                class: 'nb',
                innerHTML: `${item}(${productInfo})`,
              });
            }),
          );
        }
        return '';
      },
    },
    {
      title: '套装封面图',
      dataIndex: 'suit_img_list',
      key: 'suit_img_list',
      align: 'center',
    },
    {
      title: '套装价格',
      dataIndex: 'suit_price_list',
      key: 'suit_price_list',
      align: 'center',
      customRender({ text }: { text: number[] }) {
        if (text && text.length > 0) {
          return text.join(' ');
        }
        return '';
      },
    },
  ];
});

const measureColumn = computed(() => {
  const sorted = measureSortedInfo.value || {};
  return [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      align: 'center',
      width: 120,
    },
    {
      title: '手机尾号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      customRender({ text }: { text: number }) {
        const str = text.toString();
        if (str.length > 4) return `***${str.slice(-4)}`;
        return `-`;
      },
    },
    {
      title: '昵称/备注',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'user_flag',
      key: 'user_flag',
      align: 'center',
      customRender({ text }: { text: number[] }) {
        if (text && text.length > 0) {
          return text
            .map((item) => {
              return userTypeFilter(item);
            })
            .join(' ');
        }
        return '';
      },
    },
    {
      title: '活动',
      dataIndex: 'activity',
      key: 'activity',
      align: 'center',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
    },
    {
      title: '量体排队时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'sign_time' && sorted.order,
    },
    {
      title: '结束量体时间',
      dataIndex: 'finish_time',
      key: 'finish_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'finish_time' && sorted.order,
    },
    {
      title: '身高',
      dataIndex: 'height',
      key: 'height',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'kg';
      },
    },
    {
      title: '身型',
      dataIndex: 'carriage',
      key: 'carriage',
      align: 'center',
      customRender({ text }: { text: string }) {
        return carriageFilter(text) === '未选择' ? '--' : carriageFilter(text);
      },
    },
    {
      title: '肤色',
      dataIndex: 'skin_colour',
      key: 'skin_colour',
      align: 'center',
      customRender({ text }: { text: string }) {
        return skinColourFilter(text) === '未选择' ? '--' : skinColourFilter(text);
      },
    },
    {
      title: '胸围',
      dataIndex: 'breast_size',
      key: 'breast_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '腰围',
      dataIndex: 'waist_size',
      key: 'waist_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '臀围',
      dataIndex: 'haunch_size',
      key: 'haunch_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '大臂围',
      dataIndex: 'arm_size',
      key: 'arm_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '大腿围',
      dataIndex: 'thigh_size',
      key: 'thigh_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
    {
      title: '小腿围',
      dataIndex: 'calf_size',
      key: 'calf_size',
      align: 'center',
      customRender({ text }: { text: string }) {
        return text + 'cm';
      },
    },
  ];
});

const top50Column = [
  {
    title: '套装ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
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
    title: '试穿次数',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
  },
  {
    title: '套装价格',
    dataIndex: 'sale_price',
    key: 'sale_price',
    align: 'center',
  },
  {
    title: '商品数量',
    dataIndex: 'p_count',
    key: 'p_count',
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'op_user',
    key: 'op_user',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align: 'center',
  },
];

const shopOptions = ref<{ label: string; value: number }[]>([]);

const statisticsState = [
  {
    name: '1天',
    id: 1,
  },
  {
    name: '3天',
    id: 3,
  },
  {
    name: '5天',
    id: 5,
  },
  {
    name: '7天',
    id: 7,
  },
  {
    name: '15天',
    id: 15,
  },
  {
    name: '30天',
    id: 30,
  },
  {
    name: '全部',
    id: 0,
  },
];

const searchFormOptions = ref<Record<string, any>>(
  statisticsSearchFormFn({
    shopOptions: shopOptions.value,
  }),
);

const searchMeasureFormOptions = measureBodySearchFormFn();

const handleDaysChange = () => {
  fetchStatisticsNumberData();
  getTop50List();
};

const handleShopChange = () => {
  fetchStatisticsNumberData();
  getTop50List();
};

const staticsticsNumberData = ref<
  Partial<{
    online_reserve_count: number;
    offline_reserve_count: number;
    all_reserve_count: number;
    online_reserve_sign_count: number;
    offline_reserve_sign_count: number;
    all_reserve_sign_count: number;
    online_reserve_done_count: number;
    offline_reserve_done_count: number;
    all_reserve_done_count: number;
    all_measure_count: number;
    cancel_measure_count: number;
    product_current_account: number;
    member_current_account: number;
    all_current_account: number;
    measure_done_count: number;
    online_reserve_test_count: number;
    offline_reserve_test_count: number;
    all_reserve_test_count: number;
    online_reserve_sign_test_count: number;
    offline_reserve_sign_test_count: number;
    all_reserve_sign_test_count: number;
    online_reserve_done_test_count: number;
    offline_reserve_done_test_count: number;
    all_reserve_done_test_count: number;
    all_measure_test_count: number;
    measure_done_test_count: number;
    measure_cancel_test_count: number;
  }>
>({});

const handelScopeChange = (val: number) => {
  if (val === 3) {
    getMeasureList();
  } else {
    getList();
  }
};

const fetchShopListData = async () => {
  const { result: shopListResult } = await getShopList({ page: 1, page_size: 10000 });
  shopOptions.value = shopListResult.list.map(({ id, name }: { id: number; name: string }) => ({
    label: name,
    value: id,
  }));
  searchFormOptions.value.shop_id.originAttrs.options = shopOptions.value;
};

const fetchStatisticsNumberData = async () => {
  const { result: staticsticsNumber } = await getStatisticsNumber({
    period_time: searchTimeTnterval.value,
    shop_id: currentShop.value,
  });
  staticsticsNumber.product_current_account =
    staticsticsNumber.product_current_account / 100 + '元';
  staticsticsNumber.member_current_account = staticsticsNumber.member_current_account / 100 + '元';
  staticsticsNumber.all_current_account = staticsticsNumber.all_current_account / 100 + '元';
  staticsticsNumberData.value = staticsticsNumber;
};

fetchStatisticsNumberData();
fetchShopListData();

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  onTableChange,
  searchFormRef,
  sortedInfo,
  modelRef,
  validateInfos,
} = useSearchTableList({
  fetchData: getStatisticsReserveList,
  formData: searchFormOptions.value,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef, scope: currentTab.value };
    data.reserve_start_time = data.reserveDate && data.reserveDate[0];
    data.reserve_end_time = data.reserveDate && data.reserveDate[1];
    data.user_id = data.user_id ? Number(data.user_id) : '';
    data.suit_id = data.suit_id ? Number(data.suit_id) : '';
    delete data['reserveDate'];
    return data;
  },
  listFormatEnum: true,
});

// 获取量体数据
const {
  onSearch: onMeasureSearch,
  onReset: onMeasureReset,
  pagination: measurePagination,
  dataSource: measureDataSource,
  getList: getMeasureList,
  onTableChange: onMeasureTableChange,
  searchFormRef: measureSearchRef,
  sortedInfo: measureSortedInfo,
  modelRef: measureModelRef,
  validateInfos: measureValidateInfos,
} = useSearchTableList({
  fetchData: getStatisticsMeasureList,
  formData: searchMeasureFormOptions,
  formatParams(modelRef) {
    const data: Record<string, any> = { ...modelRef };
    data.m_start_time = data.queueDate && data.queueDate[0];
    data.m_end_time = data.queueDate && data.queueDate[1];
    data.user_id = data.user_id ? Number(data.user_id) : '';
    delete data['queueDate'];
    return data;
  },
  listFormatEnum: true,
});

// Top50 榜单数据
const { dataSource: top50DataSource, getList: getTop50List } = useSearchTableList({
  fetchData: getStatisticsTop50List,
  formatParams() {
    const data = {
      period_time: top50SearchTimeTnterval.value,
      shop_id: top50CurrentShop.value,
    };
    return data;
  },
  formatResponse({ result }) {
    return {
      list: result ?? [],
      total: result?.length ?? 0,
    };
  },
  listFormatEnum: false,
});
</script>

<style lang="less" scoped>
.test-data {
  font-size: 12px;
}
.image-item :deep(div) {
  float: left;
  margin-left: 5px;
}
.big-card {
  margin-bottom: 20px;
}
:deep(.big-card .ant-statistic .ant-statistic-title) {
  font-size: 18px !important;
  color: #999;
}

:deep(.big-card .ant-statistic-content .ant-statistic-content-value-int) {
  font-size: 20px !important;
  color: #222;
}
:deep(.big-card .ant-statistic-content .ant-statistic-content-value) {
  font-size: 20px !important;
  color: #222;
}

:deep(.small-card .ant-statistic-content .ant-statistic-content-value-int) {
  font-size: 16px !important;
  color: #222;
}
:deep(.small-card .ant-statistic-content .ant-statistic-content-value) {
  font-size: 16px !important;
  color: #222;
  margin-bottom: 5px;
}
</style>
