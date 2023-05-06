<template>
  <div>
    <a-card class="cost-management" title="首页展示">
      <div class="cost-form">
        <a-form :model="modelRef">
          <template v-for="(value, filed) in modelRef" :key="filed">
            <div>
              <a-descriptions :title="tableMap[filed]">
                <template #extra>
                  <a-button type="primary" @click="handleAdd(filed)" v-if="editValue.canEdit"
                    >新增{{ filed === 'banner' ? 'banner' : '卡片' }}</a-button
                  >
                </template>
              </a-descriptions>
            </div>
            <a-table
              rowKey="id"
              :columns="columns"
              :data-source="modelRef[filed]"
              :pagination="false"
              bordered
              :id="'table' + filed"
              class="mb15"
            >
              <template #headerCell="{ title, column }">
                <template v-if="['index', 'title', 'url'].includes(column.key)">
                  <span>{{ filed === 'banner' ? 'banner' : '卡片' }}{{ title }}</span>
                </template>
                <template v-if="column.key === 'cover_img_url'">
                  <span>{{ filed === 'banner' ? 'banner' : '封面' }}{{ title }}</span>
                </template>
              </template>
              <template #bodyCell="{ column, text, record, index }">
                <!-- <template v-if="column.dataIndex === 'index'">
                  {{ index + 1 }}-{{record.id}}
                </template> -->
                <template v-if="['title', 'url', 'cover_img_url'].includes(column.dataIndex)">
                  <div>
                    <template v-if="editValue.canEdit">
                      <a-form-item v-bind="validateInfos[`${filed}.${index}.${column.dataIndex}`]">
                        <a-input
                          v-if="column.type === 'input'"
                          v-model:value.trim="record[column.dataIndex]"
                          :maxlength="column.maxLength"
                          placeholder="请输入"
                        />
                        <ImgUpload
                          v-if="column.type === 'img-upload'"
                          v-model="record[column.dataIndex]"
                          :max-length="1"
                        />
                      </a-form-item>
                    </template>
                    <template v-else>
                      <ImgUpload
                        v-if="column.type === 'img-upload'"
                        v-model="record[column.dataIndex]"
                        :max-length="1"
                        disabled
                      />
                      <a-typography-link
                        :href="text"
                        target="_blank"
                        v-else-if="column.dataIndex === 'url'"
                      >
                        {{ text }}
                      </a-typography-link>
                      <div v-else>
                        {{ text }}
                      </div>
                    </template>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'operation' && editValue.canEdit">
                  <a-button type="link" class="action-move">移动</a-button>
                  <a-button type="link" class="action-btn" danger @click="handleRemove(record, filed)"
                    >删除</a-button
                  >
                </template>
              </template>
            </a-table>
          </template>
        </a-form>
      </div>
      <a-row justify="end" class="bottom-area">
        <a-divider />
        <a-col style="margin-left: 20px">
          <a-button @click="handleCancle" v-if="editValue.canEdit">取消</a-button>
          <a-button type="primary" style="margin-left: 10px" @click.prevent="onSubmit">{{
            editValue.canEdit ? '提交' : '修改'
          }}</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'HomePageSet',
};
</script>
<script lang="ts" setup>
import { reactive, createVNode, toRaw, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message, Form, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import { getOpenConfig, updateOpenConfig } from '@/services/marketingCenter';
import type {
  ListInfoType,
  OpenConfigFormStateType,
} from '@/types/marketingCenter/marketingCenter';
import { defaultListInfoFn, defaultListInfo } from '@/types/marketingCenter/marketingCenter.config';
import ImgUpload from '@/components/ImgUpload/index.vue';
import Sortable from 'sortablejs';
import { getImgOgriginUrl, mockImgUrl } from '@/utils/utils';

interface RulesProps {
  [key: string]: any;
}
type modal = 'banner' | 'cards'

const columns = computed(() => {
  const arr = [
    {
      title: '排序',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 120,
      customRender: ({ index }: { index: number }) => {
        return index + 1;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      type: 'input',
      maxLength: 50,
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      type: 'input',
      maxLength: 200,
    },
    {
      title: '图',
      dataIndex: 'cover_img_url',
      key: 'cover_img_url',
      align: 'center',
      type: 'img-upload',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      canEdit: true,
    },
  ];
  return arr.filter((ele) => {
    const s = ele?.canEdit;
    if (!s || s == editValue.canEdit) {
      return ele;
    }
  });
});

const tableMap = {
  banner: 'banner',
  cards: '穿搭日记',
};
const useForm = Form.useForm;
const modelRef = reactive<OpenConfigFormStateType>({
  banner: [],
  cards: [],
});
const rules = [
  {
    required: true,
    message: '必填',
    trigger: 'change',
  },
];
let rulesRef = reactive<RulesProps>({ rules: {} });
const { resetFields, validate, validateInfos, clearValidate } = useForm(modelRef, rulesRef.rules);

const editValue = reactive({
  deadline: 0,
  canEdit: false,
});

const initRulseRef = async (type: string, filed: modal, index?: number) => {
  const newData = defaultListInfo;
  const sub = index !== undefined ? index : modelRef[filed].length - 1;
  // 新增
  if (type === 'add') {
    Object.keys(newData).forEach((key) => {
      if (['title', 'cover_img_url', 'url'].includes(key) && filed === 'cards') {
        rulesRef.rules[`${filed}.${sub}.${key}`] = rules;
      }
      if (['cover_img_url'].includes(key) && filed === 'banner') {
        rulesRef.rules[`${filed}.${sub}.${key}`] = rules;
      }
    });
    return;
  }
  // 移除
  if (type === 'delete') {
    Object.keys(newData).forEach((key) => {
      clearValidate();
      delete rulesRef.rules[`${filed}.${modelRef[filed].length - 1}.${key}`];
    });

    return;
  }
};

const handleAdd = (filed: modal) => {
  let newData: ListInfoType = {
    id: modelRef[filed].length + 1,
    cover_img_url: [],
    title: '',
    url: '',
    create_time: '',
  };
  modelRef[filed].push(newData);
  initRulseRef('add', filed);
};

const handleRemove = async (record: ListInfoType, filed: modal) => {
  let idx = modelRef[filed].indexOf(record);
  if (idx !== -1) {
    await initRulseRef('delete', filed);
    modelRef[filed].splice(idx, 1);
  }
};

const fetchConfigInfo = async () => {
  const { result } = await getOpenConfig();
  if (result) {
    Object.keys(result).forEach((key) => {
      result[key].forEach((ele: ListInfoType, index:number) => {
        ele.cover_img_url = mockImgUrl(ele.cover_img_url) as unknown as [];
        initRulseRef('add', key, index);
      });
    });
    // modelRef.banner = result.banner;
    // modelRef.cards = result.cards;
    Object.assign(modelRef, result);
  }
};

const sendRequest = (params: OpenConfigFormStateType) => {
  const _params = cloneDeep(params);
  Object.keys(_params).forEach((key) => {
    _params[key as keyof typeof _params].forEach((ele: ListInfoType, index: number) => {
      ele.cover_img_url = getImgOgriginUrl(ele.cover_img_url)[0];
      ele.id = index + 1;
    });
  });
  return updateOpenConfig(_params);
};

const onSubmit = async () => {
  try {
    if (!editValue.canEdit) {
      editValue.canEdit = true;
      return;
    }

    await validate();
    const params = toRaw(modelRef);
    const res = await sendRequest(params);
    if (res['code' as keyof typeof res] === 0) {
      message.success(`更新成功`);
      editValue.canEdit = false;
      fetchConfigInfo();
      return;
    }
  } catch (error) {
    console.log('error', error);
  }
};
const router = useRouter();
const handleCancle = async () => {
  router.go(0);
  // editValue.canEdit = false;
  // rulesRef.rules = {};

  // await fetchConfigInfo();
};

const initSortable = () => {
  const tablebanner = document.querySelector('#tablebanner tbody') as HTMLElement;
  const tablecards = document.querySelector('#tablecards tbody') as HTMLElement;
  new Sortable(tablebanner, {
    handle: '.action-move',
    onEnd: async (evt) => {
      // 获取排序之后的data数据
      await nextTick();
      if (evt.newIndex !== undefined && evt.oldIndex !== undefined) {
        [modelRef.banner[evt.newIndex], modelRef.banner[evt.oldIndex]] = [
          modelRef.banner[evt.oldIndex],
          modelRef.banner[evt.newIndex],
        ];
      }
    },
  });
  new Sortable(tablecards, {
    handle: '.action-move',
    onEnd: async (evt) => {
      // 获取排序之后的data数据
      await nextTick();
      if (evt.newIndex !== undefined && evt.oldIndex !== undefined) {
        [modelRef.cards[evt.newIndex], modelRef.cards[evt.oldIndex]] = [
          modelRef.cards[evt.oldIndex],
          modelRef.cards[evt.newIndex],
        ];
      }
    },
  });
};
onMounted(() => {
  initSortable();
  fetchConfigInfo();
});
</script>

<style lang="less" scoped>
.cost-management {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  min-height: calc(100vh - 90px);
}
.cost-form {
  height: calc(100vh - 90px - 180px);
  overflow-y: auto;
}
.action-btn {
  padding: 0 5px;
}
.action-move {
  cursor: move;
}
</style>
<style lang="less">
.cost-management {
  .ant-statistic-title {
    margin-bottom: 0;
  }
  .ant-statistic-title,
  .ant-statistic-content {
    font-size: 14px;
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
  }
}
</style>
