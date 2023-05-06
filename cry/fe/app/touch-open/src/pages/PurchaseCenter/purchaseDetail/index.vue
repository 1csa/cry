<template>
  <a-card>
    <div className="page-title">{{ pageType[type as keyof typeof pageType] }}采购</div>
    <div>
      <a-divider />
      <base-info :type="(type as keyof typeof pageType)" :detail-info="{}" />
      <a-divider />
      <goods-info :type="(type as keyof typeof pageType)" v-model="goodsModelRef" />
      <a-divider />
      <logistics-info :type="(type as keyof typeof pageType)" v-model="logisticsModelRef" />
    </div>
    <a-row class="mt50">
      <a-col :span="24" style="text-align: right">
        <a-button @click="router.back()">取消</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="handleOutbound">完成</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, createVNode } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getOutboundDetail,
  outbound,
  placeLogisticsOrderRequest,
  cloudPrint,
} from '@/services/inwarehouse';
import type { ProductInfoType, LogisticsInfoType } from '@/types/purchase/purchase';
import { Modal, message, Form } from 'ant-design-vue';
import BaseInfo from '../components/BaseInfo.vue';
import GoodsInfo from '../components/GoodsInfo.vue';
import LogisticsInfo from '../components/LogisticsInfo.vue';

type PageType = 'readonly' | 'edit' | 'create' | 'copy';
const route = useRoute();
const router = useRouter();
const { type = 'create', sku = '01013003611011' } = route.query;

enum pageType {
  edit = '编辑',
  create = '新建',
  readonly = '查看',
  copy = '复制',
}

const detailInfo = reactive({});

const goodsModelRef = reactive<{ goodsList: ProductInfoType[] }>({
  goodsList: [],
});

const logisticsModelRef = reactive<{ logList: LogisticsInfoType[] }>({
  logList: [],
});

// const getDetail = async () => {
//   const { code, msg, result } = await getOutboundDetail({ id: id as string });
//   if (code === 0) {
//     Object.assign(detailInfo, result);
//   } else {
//     message.error(msg);
//   }
// };

const handleOutbound = async () => {
  console.log(goodsModelRef);
  console.log(logisticsModelRef);
  // await validate();
  // Modal.confirm({
  //   title: '是否保存',
  //   content: '保存后，除物流信息外，采购单不支持修改',
  //   okText: '保存',
  //   cancelText: '取消',
  //   onOk: async () => {
  //     await outbound({ id: id as string });
  //     message.success('出库成功');
  //     router.back();
  //   },
  //   onCancel() {
  //     return new Promise((resolve, reject) => {
  //       resolve();
  //     });
  //   },
  // });
};

onMounted(() => {
  // getDetail();
});
</script>

<style lang="less" scoped>
.page-title {
  color: #000000d9;
  font-weight: 700;
  font-size: 20px;
}

.action-btn {
  padding: 0 5px;
}

.btn-area {
  margin-top: 40px;
}
</style>
