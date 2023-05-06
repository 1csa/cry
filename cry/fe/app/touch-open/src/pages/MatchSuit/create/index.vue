<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}套装</div>
    <a-form>
      <div v-for="item in FORMDATA">
        <a-divider />
        <div class="group-title">
          {{ item.title }}
        </div>
        <template v-for="(field, key) in item.group" :key="key">
          <BaseFormItem
            :field="(field as FieldType)"
            :type="(type as PageType)"
            :modelRef="modelRef"
            :fieldkey="key"
            :validateInfos="validateInfos"
          />
        </template>
      </div>
      <div>
        <a-divider />
        <div class="group-title">套装商品</div>
        <div class="mb15" v-if="type === 'readonly'">
          套装利润率：{{ modelRef.suit_profit_margin }} %
        </div>
        <div>
          <a-button type="primary" @click="selectGoodsModal.visible = true">添加商品</a-button>
          <span style="margin-left: 24px">已选 {{ selectGoods.goods?.length }} 件商品</span>
        </div>
        <select-goods-table
          rowKey="sku"
          :data-source="selectGoods.goods"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <a-button type="primary" size="small" @click="handleRemoveGoods(record)">移除</a-button>
          </template>
        </select-goods-table>
      </div>
      <a-row v-if="type !== 'readonly'">
        <a-divider />
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
          <a-button style="margin-left: 10px" @click="router.back()">取消</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <select-goods-modal
    v-if="selectGoodsModal.visible"
    :selectedSkus="selectGoods.skus"
    action="select"
    @success="handleGoodsSelected"
    @cancel="selectGoodsModal.visible = false"
  />
</template>

<script lang="ts" setup>
import type { SuitListType } from '@/services/matchSuit';
import type { FieldType } from '@/components/BaseFormItem/index.vue';
import { toRaw, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { FORMDATA } from './constants';
import { createSuit, editSuit, getSuitInfo } from '@/services/matchSuit';
import { getImgOgriginUrl, mockImgUrl, formatEnum, mockImgUrlGroup } from '@/utils/utils';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index.vue';
import { CURING_INSTRUCTION_OPTIONS } from '@/constants/index';
import SelectGoodsTable from '@/components/SelectGoods/SelectGoodsTable.vue';
import SelectGoodsModal from '@/components/SelectGoods/SelectGoodsModal.vue';

type PageType = 'readonly' | 'edit' | 'create' | 'copy';
type ImgArray = { img: string; word: string }[];

const route = useRoute();
const router = useRouter();
const { type = 'create', sku = '01013003611011', id } = route.query;
enum pageType {
  edit = '编辑',
  create = '创建',
  readonly = '查看',
  copy = '复制',
}

const useForm = Form.useForm;

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA);
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
type FormatType = 'text' | 'textArray' | 'objectArray';

const genImageData = (target: any, fields: string[], targetType: FormatType) => {
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    if (targetType === 'text') {
      target[element] = getImgOgriginUrl(target[element])?.[0] ?? '';
    }
    if (targetType === 'textArray') {
      target[element] = getImgOgriginUrl(target[element]) ?? '';
    }
    if (targetType === 'objectArray') {
      target[element] = mockImgUrl(target[element]);
    }
  }
};

const selectGoods = reactive<{ skus: string[]; goods: Record<string, any>[] }>({
  skus: [],
  goods: [],
});

function formatIMgUrl(arg: { img: string; word: string }[], type?: string) {
  if (type == 'req') {
    return arg
      .map((item) => {
        if (item.img.length || item.word) {
          return {
            img: mockImgUrlGroup([item.img])[0],
            word: item.word,
          };
        }
      })
      .filter((item) => item);
  } else {
    return arg.map((item) => {
      return {
        img: mockImgUrl(item.img),
        word: item.word,
      };
      // return arr;
    });
  }
}

const fetchProductInfo = async () => {
  const { result } = await getSuitInfo(id as string);
  result.process_description = formatIMgUrl(result.process_description) as ImgArray;
  result.selection = formatIMgUrl(result.selection) as ImgArray;

  Object.assign(modelRef, result);
  if (result) {
    return new Promise<SuitListType>((res) => {
      genInfoResult();
      res(result);
    });
  }
};

if (type !== 'create' && sku) {
  fetchProductInfo().then((result: any) => {
    selectGoods.skus = result.skus.map((item: { sku: string }) => item.sku);
    selectGoods.goods = (formatEnum(result.skus) as unknown as Record<string, any>[]) || [];
  });
}

const genInfoResult = () => {
  genImageData(modelRef, ['cover_img_url', 'sample_product_urls', 'model_img_urls'], 'objectArray');
  if (type === 'readonly') {
    formatEnum(modelRef);
    modelRef.curing_instruction = modelRef.curing_instruction_origin
      .map((item: string) => CURING_INSTRUCTION_OPTIONS.find((obj) => obj.value === item)?.label)
      .join('、');
  }
};

// 商品弹窗
const selectGoodsModal = reactive({
  visible: false,
});

const handleGoodsSelected = (data: Record<string, any>) => {
  const { selectedSkus, selectedRows } = data;
  selectGoods.skus.push(...selectedSkus);
  selectGoods.goods.push(...selectedRows);
  Object.assign(toRaw(modelRef as SuitListType).sample_product_urls, modelRef.sample_product_urls);
  console.log('modelRef.sample_product_urls', modelRef);
};

const handleRemoveGoods = (row: Record<string, any>) => {
  selectGoods.skus.splice(
    selectGoods.skus.findIndex((item) => item == row.sku),
    1,
  );
  selectGoods.goods.splice(
    selectGoods.goods.findIndex((item) => item.sku == row.sku),
    1,
  );
};

const sendRequest = (params: SuitListType) => {
  const _params = cloneDeep(params);
  genImageData(_params, ['cover_img_url'], 'text');
  genImageData(_params, ['sample_product_urls', 'model_img_urls'], 'textArray');
  _params.selection = formatIMgUrl(_params.selection, 'req') as ImgArray;
  _params.process_description = formatIMgUrl(_params.process_description, 'req') as ImgArray;
  _params.skus = cloneDeep(selectGoods.goods) as unknown as string[];
  if (type === 'edit') {
    const {
      id,
      suit_name,
      suit_label,
      description,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      screenshot_url,
      sample_product_urls,
      model_img_urls,
      silhouette,
      tone_code,
      curing_instruction,
      process_description,
      selection,
      skus,
    } = _params;
    const data = {
      id: id as string,
      suit_name: suit_name as string,
      suit_label,
      description,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      screenshot_url,
      sample_product_urls,
      model_img_urls,
      silhouette,
      tone_code,
      process_description,
      selection,
      curing_instruction,
      skus,
    };
    return editSuit(data);
  }
  return createSuit(_params);
};

const onSubmit = async () => {
  try {
    await validate();
    const params = toRaw(modelRef as SuitListType);
    const res = await sendRequest(params);
    if (res['code' as keyof typeof res] === 0) {
      message.success(`成功`);
      router.back();
      return;
    }
  } catch (error) {
    console.log('error', error);
  }
};

const handleCancle = () => {
  resetFields();
  router.back();
};
</script>

<style lang="less" scoped>
.page-title {
  color: #000000d9;
  font-weight: 700;
  font-size: 24px;
}

.group-title {
  overflow: hidden;
  color: #000000d9;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
</style>
