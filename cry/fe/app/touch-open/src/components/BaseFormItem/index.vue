<template>
  <a-form-item :label="field.label" v-bind="type === 'readonly' ? {} : validateInfos[fieldkey]">
    <template v-if="type !== 'readonly'">
      <a-cascader
        v-if="field.type === 'cascader'"
        v-model:value="modelRef[fieldkey]"
        :options="field.options"
        placeholder="请选择"
        :disabled="disabled"
        :show-search="true"
      />
      <a-select
        v-if="field.type === 'select'"
        v-model:value="modelRef[fieldkey]"
        :options="field.options"
        placeholder="请选择"
        :disabled="disabled"
      >
      </a-select>
      <a-input
        v-if="field.type === 'input'"
        v-model:value.trim="modelRef[fieldkey]"
        placeholder="请输入"
        :disabled="disabled"
        @change="$emit('change', { fieldkey, value: $event })"
        @blur="$emit('blur', { fieldkey, value: $event.target.value })"
      />
      <a-input-number
        v-if="field.type === 'number'"
        v-model:value="modelRef[fieldkey]"
        :step="field.step"
        placeholder="请输入"
        :min="field.min"
        :max="field.max"
        :disabled="disabled"
        :precision="field.pre"
        @change="$emit('change', { fieldkey, value: $event })"
        @blur="$emit('blur', { fieldkey, value: $event.target.value })"
      />
      <a-radio-group
        v-if="field.type === 'radio'"
        v-model:value="modelRef[fieldkey]"
        :options="field.options"
        :disabled="disabled"
      />
      <a-checkbox-group
        v-if="field.type === 'checkbox-group'"
        v-model:value="modelRef[fieldkey]"
        :options="field.options"
        :disabled="disabled"
      />
      <ImgUpload
        v-if="field.type === 'img-upload'"
        v-model="modelRef[fieldkey]"
        :max-length="field.maxCount || 1"
        :crop="field.crop || false"
        :original="field.original"
        :disabled="disabled"
        @uploadSuccess="uploadSuccess"
      />
      <ImgDescGroup
        v-if="field.type === 'img-desc-group'"
        v-model="modelRef[fieldkey]"
        :disabled="disabled"
        :type="type"
      />
    </template>
    <template v-else>
      <ImgUpload
        v-if="field.type === 'img-upload'"
        v-model="modelRef[fieldkey]"
        :max-length="modelRef[fieldkey].length || 1"
        disabled
      />
      <ImgDescGroup
        v-if="field.type === 'img-desc-group'"
        v-model="modelRef[fieldkey]"
        :max-length="modelRef[fieldkey].length || 1"
        disabled
        :type="type"
      />
      <div v-if="field.type !== 'img-upload' && field.type !== 'img-desc-group'">
        {{
          fieldkey === 'cost_amount' || fieldkey === 'tag_amount' || fieldkey === 'postage'
            ? '￥' + Number(modelRef[fieldkey]).toFixed(2)
            : modelRef[fieldkey]
        }}
      </div>
    </template>
    <span class="ant-form-text" v-if="field.unit">{{ field.unit }}</span>
  </a-form-item>
</template>

<script lang="ts" setup>
import type { validateInfos } from 'ant-design-vue/lib/form/useForm';
import ImgUpload from '@/components/ImgUpload/index.vue';
import ImgDescGroup from '@/components/ImgDescGroup/index.vue';

export interface OptionsItemType {
  label: string;
  value: string | number;
}

export interface FieldType {
  type: string;
  label: string;
  options?: OptionsItemType[];
  /* 当类型为图片上传时是否支持裁切 */
  crop?: boolean;
  /* 当类型为透明图 */
  original?: string;
  /* 当类型为图片上传时最多支持上传数量限制 */
  maxCount?: number;
  /* 数字输入框步长，最大值，最小值, 精度 */
  step?: number;
  min?: number;
  max?: number;
  pre?: number;
  /* 单位 */
  unit?: string;
}

interface Props {
  /* 功能描述对象 */
  field: FieldType;
  /* 父级页面类型： 只读、可编辑、创建、复制 */
  type: 'readonly' | 'edit' | 'create' | 'copy';
  /* 双向绑定值 */
  modelRef: Record<string, any>;
  /* 字段key */
  fieldkey: string;
  /* useForm返回的检验信息 */
  validateInfos: validateInfos;
  disabled?: boolean;
}

const emit = defineEmits(['uploadSuccess', 'change', 'blur']);

const props = defineProps<Props>();

const uploadSuccess = async (data: unknown) => {
  emit('uploadSuccess', data);
};
</script>
<style scoped>
.ant-form-text {
  padding-left: 4px;
}
</style>
