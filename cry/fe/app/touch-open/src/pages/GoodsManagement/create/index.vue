<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}商品</div>
    <a-form>
      <div v-for="(item, index) in FORMDATA" :key="index">
        <a-divider />
        <div class="group-title">
          {{ item.title }}
        </div>
        <a-row :gutter="24">
          <template v-if="type === 'edit' && item.title === '商品信息'">
            <a-col :span="8">
              <a-form-item label="商品编码">
                <a-input disabled v-model:value.trim="modelRef.sku" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="商品名称" v-bind="validateInfos.name">
                <a-input v-model:value.trim="modelRef.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </template>
          <template v-for="(field, key) in item.group" :key="key">
            <a-col :span="8">
              <BaseFormItem
                v-if="key !== 'profit_margin'"
                :field="(field as FieldType)"
                :type="(type as PageType)"
                :modelRef="modelRef"
                @uploadSuccess="uploadSuccess"
                :fieldkey="key"
                :validateInfos="validateInfos"
                :disabled="
                  (enableEditFields.indexOf(key) === -1 && type === 'edit') || key === 'postage'
                "
                @blur="handleBlur"
              />
              <div v-else>
                单品利润率：<span
                  :style="{ color: modelRef.profit_margin < 20 ? 'red' : '#000000d9' }"
                  >{{ modelRef.profit_margin }} %</span
                >
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
      <a-row>
        <a-divider />
        <a-col :span="24" style="text-align: right" v-if="type !== 'readonly'">
          <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
          <!-- <a-button style="margin-left: 10px" type="primary" @click.prevent="onSubmit(4)" v-if="type !== 'create'">确认搭配</a-button> -->
          <a-button style="margin-left: 10px" @click="handleCancle">取消</a-button>
        </a-col>
        <a-col :span="24" style="text-align: right" v-else>
          <a-button @click.prevent="router.back()">返回</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import { toRaw, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { formDataFn } from './constants';
import {
  createGoods,
  editGoods,
  getProductInfo,
  getTagAmount,
  getProfitMargin,
} from '@/services/goods';
import type { GoodsItemType } from '@/services/goods';
import { getImgOgriginUrl, mockImgUrl, mockImgUrlGroup, formatEnum } from '@/utils/utils';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem, { type FieldType } from '@/components/BaseFormItem/index.vue';

type PageType = 'readonly' | 'edit' | 'create' | 'copy';

const route = useRoute();
const router = useRouter();
const { type = 'create', sku = '01013003611011', postage = '-1' } = route.query;
enum pageType {
  edit = '编辑',
  create = '创建',
  readonly = '查看',
  copy = '复制',
}
const FORMDATA = formDataFn();
const enableEditFields = reactive([
  'name',
  'cost_amount',
  'tag_amount',
  'cover_img_url',
  'original_draw_url',
  'clothes_img_urls',
  'thumbnail_url',
  'screenshot_url',
  'stock_num',
  'tone_code',
  'skin_colour_code',
  'tightness',
  'thickness',
  'sag',
  'elastic_force',
  'ventilate',
  'wear_resisting',
  'goods_source',
  'fabric_description',
  'chest_circumference',
  'shoulder_breadth',
  'waistline',
  'hipline',
  'clothes_length',
  'collar_to_sleeve',
  'outside_sleeve',
  'pants_length',
  'crotch_length',
]);

const useForm = Form.useForm;

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA);
if (type === 'edit') {
  rulesRef['name'] = [
    {
      required: true,
      message: '请填写商品名称',
    },
  ];
}

if (type === 'create' && postage !== '-1') {
  modelRef.postage = postage;
}

watchEffect(async () => {
  if (modelRef.cost_amount && modelRef.tag_amount) {
    const { result } = await getProfitMargin({
      cost_amount: Number((Number(modelRef.cost_amount as string) * 100).toFixed(2)),
      tag_amount: modelRef.tag_amount * 100,
    });
    modelRef.profit_margin = result;
  }
});

const handleBlur = async (data: { fieldkey: string; value: string | number }) => {
  const { fieldkey, value } = data;
  if (fieldkey === 'cost_amount') {
    const { result } = await getTagAmount({
      cost_amount: Number((Number(value as string) * 100).toFixed(2)),
    });
    modelRef.tag_amount = result / 100;
  }
  if (fieldkey === 'tag_amount') {
    modelRef.tag_amount = Math.round(value as number);
  }
};

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

type FormatType = 'text' | 'textArray' | 'objectArray';

const genImageData = (target: any, fields: string[], targetType: FormatType) => {
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    if (targetType === 'text') {
      target[element] = (getImgOgriginUrl(target[element]) as string[])[0];
    }
    if (targetType === 'textArray') {
      target[element] = getImgOgriginUrl(target[element]);
    }
    if (targetType === 'objectArray') {
      target[element] = mockImgUrl(target[element]);
    }
  }
};

const genInfoResult = () => {
  modelRef.cost_amount = modelRef.cost_amount / 100;
  modelRef.postage = modelRef.postage / 100;
  modelRef.tag_amount = modelRef.tag_amount / 100;
  genImageData(
    modelRef,
    ['cover_img_url', 'original_draw_url', 'thumbnail_url', 'clothes_img_urls', 'screenshot_url'],
    'objectArray',
  );

  if (type === 'readonly') formatEnum(modelRef);
};

const fetchProductInfo = async () => {
  const { result } = await getProductInfo(sku as string);
  if (result) {
    result.fabric_description = result.fabric_description.map((item) => ({
      img: mockImgUrl(item.img),
      word: item.word,
    })) as unknown as { img: string; word: string }[];
    Object.assign(modelRef, result);
    genInfoResult();
  }
};

if (type !== 'create' && sku) {
  fetchProductInfo();
}

const sendRequest = (params: GoodsItemType) => {
  const _params = cloneDeep(params);
  genImageData(_params, ['clothes_img_urls'], 'textArray');
  genImageData(
    _params,
    ['cover_img_url', 'thumbnail_url', 'screenshot_url', 'original_draw_url'],
    'text',
  );

  _params.fabric_description = _params.fabric_description.map((item) => {
    let arr = {
      img: mockImgUrlGroup([item.img])[0],
      word: item.word,
    };
    return arr;
  });
  _params.cost_amount = _params.cost_amount * 100;
  _params.postage = _params.postage * 100;
  _params.tag_amount = _params.tag_amount * 100;
  if (toneCode.tone_code !== -1) {
    _params.tone_code = toneCode.tone_code || 0;
    _params.main_colour_code = toneCode.main_colour_code || '';
  }
  if (type === 'edit') {
    const {
      id,
      name,
      cost_amount,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      screenshot_url,
      original_draw_url,
      stock_num,
      fabric_description,
      thickness,
      length,
      tone_code,
      skin_colour_code,
      tightness,
      silhouette,
      sag,
      elastic_force,
      ventilate,
      wear_resisting,
      goods_source,
      postage,
      chest_circumference,
      shoulder_breadth,
      waistline,
      hipline,
      clothes_length,
      collar_to_sleeve,
      outside_sleeve,
      pants_length,
      crotch_length,
      tag_amount,
    } = _params;
    const data = {
      id: id as string,
      name: name as string,
      cost_amount,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      original_draw_url,
      screenshot_url,
      stock_num,
      fabric_description,
      thickness,
      length,
      tone_code,
      skin_colour_code,
      tightness,
      silhouette,
      sag,
      elastic_force,
      ventilate,
      wear_resisting,
      goods_source,
      postage,
      chest_circumference,
      shoulder_breadth,
      waistline,
      hipline,
      clothes_length,
      collar_to_sleeve,
      outside_sleeve,
      pants_length,
      crotch_length,
      tag_amount,
    };
    return editGoods(data);
  }
  return createGoods(_params);
};

const toneCode = reactive({
  tone_code: -1,
  main_colour_code: '',
});
const TONE_CODE_OPTIONS = ['无', '暖色（红、橙、黄）', '冷色（绿、蓝、紫）', '中性（黑、白、灰）'];

const uploadSuccess = (data: { tone_code: number; main_colour_code: string }) => {
  if (data.tone_code) {
    toneCode.tone_code = data.tone_code;
    toneCode.main_colour_code = data.main_colour_code;
    modelRef['tone_code'] = TONE_CODE_OPTIONS[data.tone_code];
  }
};

const onSubmit = async () => {
  try {
    await validate();
    const params = toRaw(modelRef as GoodsItemType);
    const res = await sendRequest(params);
    if (res['code' as keyof typeof res] === 0) {
      message.success(`成功`);
      handleCancle();
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
