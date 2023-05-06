<template>
  <a-form-item :label="field.label" v-bind="readonly ? {} : validateInfos[fieldkey]">
    <template v-if="readonly">
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
        type="readonly"
      />
      <div v-if="field.filtter">
        {{ field.filtter(modelRef[fieldkey]) }}
      </div>
      <div v-if="field.type !== 'img-upload' && field.type !== 'img-desc-group' && !field.filtter">
        {{
          fieldkey === 'cost_amount' || fieldkey === 'tag_amount' || fieldkey === 'postage'
            ? '￥' + Number(modelRef[fieldkey]).toFixed(2)
            : modelRef[fieldkey]
        }}
      </div>
    </template>
    <template v-else>
      <a-cascader
        v-if="field.type === 'cascader'"
        v-model:value="modelRef[fieldkey]"
        placeholder="请选择"
        allowClear
        style="min-width: 200px"
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-select
        v-if="field.type === 'select'"
        v-model:value="modelRef[fieldkey]"
        placeholder="请选择"
        allowClear
        style="min-width: 120px"
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      >
      </a-select>
      <a-input
        v-if="field.type === 'input'"
        v-model:value="modelRef[fieldkey]"
        placeholder="请输入"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-textarea
        v-if="field.type === 'textarea'"
        v-model:value="modelRef[fieldkey]"
        placeholder="请输入"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-input-number
        v-if="field.type === 'number'"
        v-model:value="modelRef[fieldkey]"
        v-bind="field.originAttrs"
      />
      <a-radio-group
        v-if="field.type === 'radio'"
        v-model:value="modelRef[fieldkey]"
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-checkbox-group
        v-if="field.type === 'checkbox-group'"
        v-model:value="modelRef[fieldkey]"
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-range-picker
        v-if="field.type === 'range-picker'"
        v-model:value="modelRef[fieldkey]"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-date-picker
        v-if="field.type === 'date-picker'"
        v-model:value="modelRef[fieldkey]"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-time-picker
        v-if="field.type === 'time-picker'"
        v-model:value="modelRef[fieldkey]"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <a-time-range-picker
        v-if="field.type === 'time-range-picker'"
        v-model:value="modelRef[fieldkey]"
        allowClear
        v-bind="field.originAttrs"
        @change="$emit('change', $event)"
      />
      <ImgUpload
        v-if="field.type === 'img-upload'"
        v-model="modelRef[fieldkey]"
        v-bind="field.originAttrs"
        :disabled="disabled"
      />
      <ImgDescGroup
        v-if="field.type === 'img-desc-group'"
        v-model="modelRef[fieldkey]"
        :disabled="disabled"
      />
    </template>
    <span class="antd-form-text" v-if="field.unit">{{ field.unit }}</span>
  </a-form-item>
</template>

<script lang="ts" setup>
import type { validateInfos } from 'ant-design-vue/lib/form/useForm';
import ImgUpload from '@/components/ImgUpload/index.vue';
import ImgDescGroup from '@/components/ImgDescGroup/index.vue';
import type { RangePickerProps } from 'ant-design-vue/lib/date-picker/dayjs';
import type { InputProps, TextAreaProps } from 'ant-design-vue/lib/input/inputProps';

export interface OptionsItemType {
  label: string;
  value: string | number;
}

export type BaseFieldType = RangePickerProps & InputProps & TextAreaProps;

export interface FieldType {
  type: string;
  label: string;
  originAttrs?: BaseFieldType;
  filtter?: (v: any) => {};
  /* 单位 */
  unit?: string;
}

interface Props {
  /* 功能描述对象 */
  field: FieldType;
  /* 双向绑定值 */
  modelRef: Record<string, any>;
  /* 字段key */
  fieldkey: string;
  /* useForm返回的检验信息 */
  validateInfos: validateInfos;
  disabled?: boolean;
  readonly?: boolean;
}
const props = defineProps<Props>();
</script>
<style scoped>
.antd-form-text {
  padding-left: 4px;
}
</style>
