<template>
  <div :class="{ 'top-sticky': fixed }">
    <a-card :bordered="false">
      <a-row justify="space-between">
        <a-col>
          <a-form ref="searchFormRef" layout="inline" :model="shopState">
            <a-form-item label="请选择门店" name="shopId">
              <a-select
                v-model:value="shopState.shopId"
                style="min-width: 200px"
                :options="shopState.shopOptions"
                placeholder="请选择"
                :fieldNames="{ label: 'name', value: 'id' }"
                @change="handleChange"
              >
              </a-select>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col v-show="shopState.shopId">
          <a-space>
            <slot name="action"></slot>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
  </div>
  <div v-show="shopState.shopId">
    <slot name="search"></slot>
    <slot name="main"></slot>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, UnwrapRef } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { shopId, ShopStateType } from '@/types/shop/shop';
import { getShopList } from '@/services/shop';
interface BaseReturnProps {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total: number | string;
}
interface Props {
  // modelValue: shopId;
  fixed?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'change']);
const shopState: UnwrapRef<{ shopOptions: SelectProps['options'] }> = reactive({
  shopId: null,
  shopOptions: [],
});
const fetchShopList = async () => {
  const res = await getShopList<Record<string, any>, BaseReturnProps>({
    page: 1,
    page_size: 100,
  });
  shopState.shopOptions = res.result.list;
};
fetchShopList();
const handleChange = () => {
  // emit('update:modelValue', toRaw(props.modelValue));
  emit('change', shopState.shopId);
};
</script>
<style lang="less" scoped></style>
