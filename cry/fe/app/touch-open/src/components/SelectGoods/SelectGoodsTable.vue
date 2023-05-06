<!-- 选择商品弹窗 -->
<template>
  <a-table :columns="columns" v-bind="$attrs">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'cover_img_url'">
        <PreviewImgModal :src="text" />
      </template>
      <template v-if="column.dataIndex === 'stock_num'">
        <a-typography-text type="danger" v-if="text <= 10">仅{{ text }}件</a-typography-text>
        <a-typography-text v-else>{{ text }}件</a-typography-text>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <slot name="operation" :record="record"></slot>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';

const columns = [
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
    title: '成本价',
    dataIndex: 'cost_amount',
    key: 'cost_amount',
    align: 'center',
    width: 120,
    customRender: ({ text }: { text: any }) => {
      return '¥' + (text / 100).toFixed(2);
    },
  },
  {
    title: '库存量',
    dataIndex: 'stock_num',
    key: 'stock_num',
    align: 'center',
    width: 90,
  },
  {
    title: '保存时间',
    dataIndex: 'update_time',
    key: 'update_time',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 110,
  },
];
</script>
