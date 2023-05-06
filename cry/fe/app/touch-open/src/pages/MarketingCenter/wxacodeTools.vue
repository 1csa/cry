<template>
  <div>
    <a-card class="search-box" title="营销工具 / 小程序码生成">
      <a-form v-bind="layout" layout="inline">
        <a-form-item label="活动">
          <a-input
            v-model:value.trim="modelRef.activity"
            placeholder="请输入"
            autocomplete="off"
            :maxlength="20"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="渠道">
          <a-input
            v-model:value.trim="modelRef.channel"
            placeholder="请输入"
            autocomplete="off"
            :maxlength="20"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            v-model:value.trim="modelRef.mobile"
            placeholder="请输入"
            autocomplete="off"
            :maxlength="11"
            allow-clear
          />
        </a-form-item>
        <div class="shop-selected">
          <SelectShopForm @change="handleShopChange" />
        </div>
        <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.prevent="handleSubmit">生成</a-button>
        </a-form-item>
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
          <template v-if="column.dataIndex === 'wxacode'">
            <PreviewImgModal :src="text" />
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="previewInfo.visible"
      :footer="null"
      @cancel="previewInfo.visible = false"
    >
      <img
        v-if="previewInfo.previewImage"
        alt="img"
        style="width: 100%"
        :src="previewInfo.previewImage"
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'WxacodeTools',
};
</script>
<script lang="ts" setup>
import { reactive, computed, toRaw } from 'vue';
import { message, Form } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getWxcodeList, creatWxcode } from '@/services/marketingCenter';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import SelectShopForm from '../ShopManagement/components/SelectShopForm.vue';
interface FormState {
  activity: string;
  channel: string;
  mobile: string;
  shop_id: number;
}
const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
});
const columns = computed(() => {
  return [
    {
      title: '分享ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '活动',
      dataIndex: 'activity',
      key: 'activity',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
    },
    {
      title: '门店',
      dataIndex: 'shop_name',
      key: 'shop_name',
      align: 'center',
    },
    {
      title: '注册次数',
      dataIndex: 'register_count',
      key: 'register_count',
      align: 'center',
    },
    {
      title: '小程序码',
      dataIndex: 'wxacode',
      key: 'wxacode',
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
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
    },
  ];
});
const modelRef = reactive<FormState>({
  activity: '',
  channel: '',
  mobile: '',
  shop_id: 0,
});
const rulesRef = reactive({
  activity: [
    {
      required: false,
      message: '必填',
    },
  ],
  channel: [
    {
      required: false,
      message: '必填',
    },
  ],
  mobile: [
    {
      required: false,
      message: '必填',
    },
  ],
});
const { resetFields, validate } = useForm(modelRef, rulesRef);
const handleShopChange = (id: any) => {
  console.log(1111, id);
  modelRef.shop_id = id;
};
const handleSubmit = async () => {
  try {
    await validate();
    const { result } = await creatWxcode(toRaw(modelRef));
    previewInfo.previewImage = result.wxacode;
    previewInfo.visible = true;
    resetFields();
    getList();
  } catch (error) {
    console.log('error', error);
  }
};

const { pagination, dataSource, getList, onTableChange } = useSearchTableList({
  fetchData: getWxcodeList,
  formatParams() {
    return {};
  },
  listFormatEnum: true,
});

const previewInfo = reactive({
  visible: false,
  previewImage: '',
});
</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.action-btn {
  padding: 0 5px;
}
.ant-card .ant-card-body {
  padding: 0 !important;
}
:deep(.ant-form .ant-card .ant-card-body) {
  padding: 0px !important;
}
</style>
