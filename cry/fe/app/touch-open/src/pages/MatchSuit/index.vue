<template>
  <div>
    <a-card class="search-box-wrap">
      <a-tabs
        v-model:activeKey="formState.status"
        type="card"
        :tabBarGutter="6"
        class="search-tabs"
        @change="handelStatusChange"
      >
        <a-tab-pane
          v-for="item in SUIT_STATUS_OPTIONS"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>
      <a-card class="search-box">
        <a-form ref="searchFormRef" layout="inline" :model="formState">
          <a-row :gutter="[24, 16]">
            <a-col>
              <a-form-item label="套装ID" name="id">
                <a-input
                  v-model:value.trim="formState.id"
                  placeholder="请输入套装ID"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="商品编码" name="sku">
                <a-input
                  v-model:value.trim="formState.sku"
                  placeholder="请输入商品编码"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="商品名称" name="name">
                <a-input
                  v-model:value.trim="formState.name"
                  placeholder="请输入商品名称"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="商品类目" name="category">
                <a-cascader
                  style="min-width: 250px"
                  v-model:value="formState.category"
                  :options="CATEGORY_OPTIONS"
                  placeholder="请选择商品类目"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="套装名称" name="suit_name">
                <a-input
                  v-model:value.trim="formState.suit_name"
                  placeholder="请输入套装名称"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="件数" name="number">
                <a-input-number v-model:value="formState.number" placeholder="请输入件数" />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="廓形" name="silhouette">
                <a-select
                  style="min-width: 150px"
                  mode="multiple"
                  v-model:value="formState.silhouette"
                  placeholder="请选择廓形"
                  :options="silhouette_options"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="创建人" name="op_user_name">
                <a-input
                  v-model:value.trim="formState.op_user_name"
                  placeholder="请输入创建人"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="保存时间" name="updateDate">
                <a-range-picker
                  v-model:value="formState.updateDate"
                  :format="dateFormat"
                  :value-format="dateFormat"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="formState.status !== '2'">
              <a-form-item label="上架时间" name="arriveDate">
                <a-range-picker
                  v-model:value="formState.arriveDate"
                  :format="dateFormat"
                  :value-format="dateFormat"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col v-else>
              <a-form-item label="下架时间" name="withdrawTime">
                <a-range-picker
                  v-model:value="formState.withdrawTime"
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
    </a-card>
    <a-card class="table-box mt15">
      <a-row class="action-btn-box" justify="space-between">
        <a-col></a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleOperateGoods({ id: '' }, 'create')"
              >新建套装</a-button
            >
            <a-button
              type="primary"
              v-if="batchButton.text"
              @click="handlebatch({ status: batchButton.value })"
              >{{ batchButton.text }}</a-button
            >
            <a-button
              type="primary"
              v-if="formState.status === '1'"
              @click="handleOperateGoods({ id: '' }, 'distribution')"
              >总库配货</a-button
            >
          </a-space>
        </a-col>
      </a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :row-selection="rowSelection"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'cover_img_url'">
            <PreviewImgModal :src="text" />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button
              type="link"
              class="action-btn"
              v-if="[0, 2, 4].includes(record.status)"
              @click="handleOperateGoods(record, 'edit')"
              >编辑</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="[0, 4].includes(record.status)"
              @click="handleDelete(record)"
              >删除</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="[0].includes(record.status)"
              @click="handlebatch(record)"
              >确认</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="[2, 4, 1, 5].includes(record.status)"
              @click="handlebatch(record)"
              >{{ suitButtonFilter(record.status) }}</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              :disabled="record.online_status"
              v-if="record.status == 1"
              @click="handlebatch({ ...record, ...{ status: '11' } })"
              >上线</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="[0].includes(record.status)"
              @click="handleOperateGoods(record, 'copy')"
              >复制</a-button
            >
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'readonly')"
              >详情</a-button
            >
            <a-button
              type="link"
              class="action-btn"
              v-if="[1].includes(record.status)"
              @click="handleRemarkDialog(record)"
              >分享</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>
    <off-line-reason-model
      v-if="offLineReasonModelState.visible"
      :ids="offLineReasonModelState.ids"
      @success="getList"
      @cancel="offLineReasonModelState.visible = false"
    />
    <select-suit-modal
      v-if="selectSuitModalState.visible"
      @success="getList"
      @cancel="selectSuitModalState.visible = false"
    />
    <a-modal
      v-model:visible="sharePostModalState.visible"
      :footer="null"
      style="text-align: center"
      :bodyStyle="{ 'min-height': '680px' }"
    >
      <a-spin :spinning="sharePostModalState.spinning"></a-spin>
      <template v-if="!sharePostModalState.spinning">
        <div style="width: 90%; text-align: left; margin: 15px auto">
          链接ID: {{ sharePostModalState.linkId }}
        </div>
        <img style="width: 90%" :src="sharePostModalState.url" alt="" />
      </template>
    </a-modal>
    <a-modal
      v-model:visible="sharePostModalState.remark"
      title="分享备注"
      @ok="onSubmitRemarkDialog"
      @cancel="onResetRemarkDialog"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="备注" v-bind="validateInfos.remark">
          <a-textarea
            :rows="4"
            placeholder="请填写备注"
            v-model:value="remarkDialogModelRef.remark"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <div id="poster" ref="posterRef" v-if="sharePostModalState.visible">
      <div class="image-cover">
        <img
          crossorigin="anonymous"
          :src="sharePostModalState.suitInfo.cover_img_url"
          @load="getPoster"
        />
      </div>
      <div class="suit-info">
        <div class="suit-info__left">
          <p class="suit-price">
            ¥<span>{{ sharePostModalState.suitInfo.sale_price }}</span>
          </p>
          <p class="suit-name">{{ sharePostModalState.suitInfo.suit_name }}</p>
        </div>
        <div class="suit-info__right">
          <img crossorigin="anonymous" :src="sharePostModalState.wxCode" />
          <p>长按识别查看</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'MatchSuitList',
};
</script>
<script lang="ts" setup>
import { reactive, computed, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message, Form } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import {
  onLineShowSuitOperation,
  getSuitListBackend,
  shiftSuit,
  delateSuit,
  getH5SuitInfo,
  getSuitShareCode,
} from '@/services/matchSuit';
import { CATEGORY_OPTIONS, silhouette_options } from '@/constants/index';
import { SUIT_STATUS_OPTIONS, suitButtonFilter } from '@/constants/matchSuit';
import { FormStateType } from '@/types/matchSuit/matchSuit';
import OffLineReasonModel from './components/OffLineReasonModel.vue';
import SelectSuitModal from './components/SelectSuitModal.vue';
import PreviewImgModal from '@/components/PreviewImgModal/index.vue';
import html2canvas from 'html2canvas';
import { formatAmount } from '@/utils/utils';
interface ModelStateType {
  visible: boolean;
  ids: string[] | [];
}

const useForm = Form.useForm;
const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  const status = formState.status;
  const baseColumns = [
    {
      title: '套装ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
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
      title: '商品数量',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'op_user',
      key: 'op_user',
      align: 'center',
    },
    {
      title: '上次保存时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'update_time' && sorted.order,
      status: ['0', '4'],
      width: 300,
    },
    {
      title: '上架时间',
      dataIndex: 'arrive_time',
      key: 'arrive_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'arrive_time' && sorted.order,
      status: ['1'],
    },
    {
      title: '上线时间',
      dataIndex: 'arrive_time',
      key: 'arrive_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'arrive_time' && sorted.order,
      status: ['5'],
    },
    {
      title: '下架时间',
      dataIndex: 'withdraw_time',
      key: 'withdraw_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'withdraw_time' && sorted.order,
      status: ['2'],
    },
    {
      title: '下架原因',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
      status: ['2'],
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 280,
    },
  ];

  return baseColumns.filter((ele) => {
    const s = ele?.status;
    if (!s || s.includes(status as string)) {
      return ele;
    }
  });
});

const dateFormat = 'YYYY-MM-DD';

const formState: UnwrapRef<FormStateType> = reactive({
  id: '',
  sku: '',
  name: '',
  category: [],
  status: '0',
  suit_name: '',
  op_user_name: '',
  updateDate: ['', ''],
  arriveDate: ['', ''],
  withdrawTime: ['', ''],
  number: '',
  silhouette: [],
});

const handelStatusChange = (val: string) => {
  formState.status = val;
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
  rowSelection,
  selectedRowKeys,
} = useSearchTableList({
  fetchData: getSuitListBackend,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    data.update_start_time = data.updateDate && data.updateDate[0];
    data.update_end_time = data.updateDate && data.updateDate[1];
    data.arrive_start_time = data.arriveDate && data.arriveDate[0];
    data.arrive_end_time = data.arriveDate && data.arriveDate[1];
    data.withdraw_start_time = data.withdrawTime && data.withdrawTime[0];
    data.withdraw_end_time = data.withdrawTime && data.withdrawTime[1];
    data.silhouette = data.silhouette.map((item: string) => {
      return Number(item);
    });
    data.id = Number(data.id);
    data.status = Number(data.status);
    delete data['updateDate'];
    delete data['arriveDate'];
    delete data['withdrawTime'];
    return data;
  },
  listFormatEnum: true,
});

const offLineReasonModelState: ModelStateType = reactive({
  visible: false,
  ids: [],
});
const selectSuitModalState: { visible: boolean } = reactive({
  visible: false,
});
// 批量操作信息
const batchButton = computed(() => {
  const status = formState.status;
  const obj: Record<string, Record<string, string>> = {
    '0': {
      text: '批量确认',
      value: '0',
    },
    '2': {
      text: '批量上架',
      value: '2',
    },
    '1': {
      text: '批量下架',
      value: '1',
    },
    '4': {
      text: '批量上架',
      value: '4',
    },
    '5': {
      text: '',
      value: '5',
    },
  };
  return obj[status as string];
});

// 上下线操作
const onLineOffLineOperation = async ({ state, suit_id }: { state: Number; suit_id: Number }) => {
  const result = await onLineShowSuitOperation({ state, suit_id });
  if (result.code == 0) {
    message.success(state == 1 ? '上线成功!' : '下线成功');
    getList();
  } else {
    message.error(result.msg);
  }
  return;
};

// 批量/单个操作
const handlebatch = async (record: { id?: string; status: string }) => {
  if (!record.id && !selectedRowKeys.value.length) {
    message.error('请选择套装');
    return;
  }
  const data = {
    ids: record.id ? [record.id] : selectedRowKeys.value,
    action: record.status == '0' ? 'confirm' : 'on',
  };

  /**
   * 已上架有两种可操作性状态
   * 下架 status: 1
   * 上线 status: 11 自定义
   * 如果是上线状态，则只有下线操作
   * update by freyhill in 2022.11.11
   **/
  if (record.status == '5') {
    onLineOffLineOperation({ state: 2, suit_id: Number(record.id) });
    return;
  }

  if (record.status == '11') {
    onLineOffLineOperation({
      state: 1,
      suit_id: Number(record.id),
    });
    return;
  }

  if (record.status == '1') {
    offLineReasonModelState.visible = true;
    offLineReasonModelState.ids = data.ids;
    return;
  } else {
    await shiftSuit(data);
  }
  message.success('操作成功');
  selectedRowKeys.value = [];
  getList();
};

// 删除商品
const handleDelete = ({ id }: { id: string }) => {
  Modal.confirm({
    title: '删除后将无法恢复，您确定要删除该套装吗',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      const { code, msg } = await delateSuit({ id: id });
      if (code === 0) {
        message.success('删除成功');
        getList();
      } else {
        message.error(msg);
      }
    },
    onCancel() {
      return new Promise<void>((resolve, reject) => {
        resolve();
      });
    },
  });
};

// 商品复制，编辑，查看
const handleOperateGoods = (record: { id: string }, type: string) => {
  if (type === 'distribution') {
    selectSuitModalState.visible = true;
  } else {
    router.push({
      name: 'SuitCreate',
      query: record.id
        ? {
            id: record.id,
            type: type,
          }
        : {
            type: type,
          },
    });
  }
};
interface sharePostModalStateType {
  remark: boolean;
  visible: boolean;
  url: string;
  suitInfo: {
    sale_price: string;
    cover_img_url: string;
    suit_name: string;
  };
  wxCode: string;
  linkId: number | string;
  spinning: boolean;
  currentId: string;
}
const sharePostModalState: sharePostModalStateType = reactive({
  remark: false,
  visible: false,
  url: '',
  suitInfo: {
    sale_price: '',
    cover_img_url: '',
    suit_name: '',
  },
  wxCode: '',
  linkId: '',
  spinning: false,
  currentId: '',
});

const remarkDialogModelRef = reactive({
  remark: '',
});

const { resetFields, validate, validateInfos } = useForm(
  remarkDialogModelRef,
  reactive({
    remark: [
      {
        required: true,
        message: '请填写备注',
      },
    ],
  }),
);

// 分享备注
const handleRemarkDialog = (record: { id: string }) => {
  sharePostModalState.remark = true;
  sharePostModalState.currentId = record.id;
};

const onSubmitRemarkDialog = async () => {
  try {
    const res = await validate();
    sharePostModalState.remark = false;
    resetFields();
    handlCreateSuitPost(res.remark);
  } catch (error) {
    console.log('error', error);
  }
};

const onResetRemarkDialog = () => {
  resetFields();
  sharePostModalState.remark = false;
};

// 生成分享海报
const handlCreateSuitPost = async (remark: string) => {
  const { currentId } = sharePostModalState;
  const {
    result: { wxacode: wxCode, id },
  } = await getSuitShareCode({ suit_id: currentId, remark });
  sharePostModalState.wxCode = wxCode;
  sharePostModalState.linkId = id;
  const {
    result: { suit_data },
  } = await getH5SuitInfo({ suit_id: currentId });
  sharePostModalState.suitInfo = suit_data;
  sharePostModalState.suitInfo.sale_price = formatAmount(suit_data.sale_price);
  sharePostModalState.visible = true;
  sharePostModalState.spinning = true;
};

const getPoster = async () => {
  html2canvas(document.querySelector('#poster') as HTMLElement, {
    useCORS: true, // 【重要】开启跨域配置
    allowTaint: true, // 允许跨域图片
    backgroundColor: null,
  }).then((img) => {
    sharePostModalState.url = img.toDataURL('image/png');
    sharePostModalState.spinning = false;
    console.log('====================================');
    console.log(sharePostModalState.wxCode);
    console.log('====================================');
  });
};
</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.search-box {
  border: none;
  margin-bottom: 0;
}

.action-btn {
  padding: 0 5px;
}
@multiple: 2;

#poster {
  position: absolute;
  left: 9999px;
  bottom: 9999px;
  width: 284px * @multiple;
  height: 422px * @multiple;
  border-radius: 12px * @multiple;
  background: transparent;
  overflow: hidden;
  .image-cover {
    width: 100%;
    height: 330px * @multiple;
    border-radius: 12px * @multiple 12px * @multiple 0 0;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .suit-info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 92px * @multiple;
    padding: 16px * @multiple;
    border-radius: 0 0 12px * @multiple 12px * @multiple;
    background: #ffffff;
  }
  .suit-info__left {
    .suit-price {
      font-family: 'DIN';
      color: #8b2e11;
      font-weight: 400;
      font-size: 12px * @multiple;
      line-height: 12px * @multiple;
      span {
        font-size: 20px * @multiple;
      }
    }
    .suit-name {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 10px * @multiple;
      line-height: 16px * @multiple;
      color: #999999;
      margin-top: 8px * @multiple;
      max-width: 150px * @multiple;
    }
  }
  .suit-info__right {
    text-align: center;
    img {
      width: 40px * @multiple;
      height: 40px * @multiple;
    }
    p {
      font-family: 'PingFang SC';
      font-weight: 300;
      font-size: 7px * @multiple;
      line-height: 20px * @multiple;
      letter-spacing: 0.4em * @multiple;
      color: #000000;
      margin-top: 4px * @multiple;
    }
  }
}
</style>

<style lang="less">
.search-box-wrap {
  .ant-card-body {
    padding: 15px;
  }
}

.search-tabs {
  border: none;

  .ant-tabs-nav {
    margin: 0 !important;
  }

  .ant-tabs-top > .ant-tabs-nav::before {
    border-color: #ffffff;
  }
}
</style>
