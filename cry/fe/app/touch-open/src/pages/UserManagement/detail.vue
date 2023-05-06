<template>
  <a-card class="search-box">
    <a-descriptions title="用户信息">
      <a-descriptions-item
        v-for="(item, key) in userInfo.user_detail"
        :label="userInfoLabel.user_detail[key]"
      >
        <span v-if="key === 'avatar_url'">
          <img class="avatar" :src="item" />
        </span>
        <span v-else>{{ item }}</span>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <a-card class="search-box">
    <a-descriptions title="订单详情"></a-descriptions>
    <a-table :dataSource="userInfo.order_detail" :columns="userInfoLabel.orderDetailLabel">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'order_product_list'">
          <a-table
            :dataSource="record.order_product_list"
            :columns="userInfoLabel.orderProductList"
            :pagination="false"
            :showHeader="false"
          >
            <template #bodyCell="{ column, text, record2 }">
              <template v-if="column.dataIndex === 'cover_img_url'">
                <img class="sku-cover" :src="text" />
              </template>
              <template v-if="column.dataIndex === 'size'">
                {{ SIZE_MAP[text] }}
              </template>
              <template v-if="column.dataIndex === 'pay_amount'">
                <span>{{ text / 100 }}</span>
              </template>
            </template>
          </a-table>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-card class="search-box">
    <a-descriptions title="预约单信息"> </a-descriptions>
    <a-table
      :dataSource="userInfo.reserve_order_detail"
      :columns="userInfoLabel.reserveOrderDetailLabel"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'suit_detail'">
          <a-table
            :dataSource="record.suit_detail"
            :columns="userInfoLabel.reserveProductLabel"
            :pagination="false"
            :showHeader="false"
          >
            <template #bodyCell="{ column, text, record2 }">
              <template v-if="column.dataIndex === 'suit_cover_img_url'">
                <img class="sku-cover" :src="text" />
              </template>
              <template v-if="column.dataIndex === 'suit_amount'">
                <span>{{ text / 100 }}</span>
              </template>
            </template>
          </a-table>
        </template>
      </template>
    </a-table>
  </a-card>

  <a-card class="search-box">
    <a-descriptions title="量体信息"> </a-descriptions>

    <a-table
      :dataSource="userInfo.measure_order_detail"
      :columns="userInfoLabel.measureOrderDetail"
    >
      <template #bodyCell="{ column, text, record2 }">
        <template v-if="column.dataIndex === 'skin_colour'">
          {{ SKIN_COLOUR_MAP[text] }}
        </template>
        <template v-if="column.dataIndex === 'carriage'">
          {{ CARRIAGE_MAP[text] }}
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
import { reactive, computed, type UnwrapRef, ref, watch } from 'vue';
import useSearchTableList from '@/composables/useSearchTableListV2';
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
import { useRouter, useRoute } from 'vue-router';
import { any, number, string } from 'vue-types';
import { defaultUserInfoResult } from './constants';
import { defaultUserInfoData } from './constants';
import { userInfoLabel } from './constants';
import { getUserDetail } from '@/services/user';
import { SIZE_MAP, CARRIAGE_MAP, SKIN_COLOUR_MAP } from '../../constants/bodyDataMap';
import useReloadPage from '@/composables/useReloadPage';
useReloadPage();
const userInfo = ref(defaultUserInfoData);
const route = useRoute();
const { id = '' } = route.query;
const userType = {
  1: '新用户',
  2: '老用户',
  3: '大客户',
  4: '会员',
};
const fetchUserInfo = async (userId: string) => {
  const { result } = await getUserDetail({ userid: Number(userId) });
  if (result.user_detail) {
    result.user_detail.user_flag = result.user_detail.user_flag
      .map((item) => {
        item = userType[item];
        return item;
      })
      .toString();
  }
  userInfo.value = result;
};

fetchUserInfo(id);
watch(
  () => route.query.id,
  async (id) => {
    try {
      fetchUserInfo(id);
    } catch (error) {
      console.error(error);
    }
  },
);
</script>

<style lang="less" scoped>
.avatar,
.sku-cover {
  width: 30px;
}
</style>
