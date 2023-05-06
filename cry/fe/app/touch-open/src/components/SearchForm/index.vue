<template>
  <a-card class="search-box" :title="title">
    <a-form ref="searchFormRef" layout="inline">
      <a-row :gutter="[24, 16]">
        <template v-for="(field, key) in formData" :key="key">
          <a-col>
            <BaseFormItem
              :field="(field as FieldType)"
              :modelRef="modelRef"
              :fieldkey="(key as unknown  as string)"
              :validateInfos="validateInfos"
            />
          </a-col>
        </template>
        <a-col>
          <a-form-item>
            <a-space :size="20">
              <a-button type="primary" @click="$emit('search')">查询</a-button>
              <a-button @click="$emit('reset')">重置</a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, toRefs, UnwrapRef } from 'vue';
import type { FieldType } from '@/components/BaseFormItem/index-v2.vue';
import BaseFormItem from '@/components/BaseFormItem/index-v2.vue';

interface Props {
  formData: any;
  modelRef: any;
  validateInfos: any;
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  formData: {},
  modelRef: {},
  validateInfos: {},
  title: ''
});
const { formData, modelRef, validateInfos } = toRefs(props);
const emit = defineEmits(['search', 'reset']);
</script>
