<template>
  <a-button type="primary" class="mb24" @click="handleAddRowClick" v-if="type !== 'readonly'">新增行</a-button>
  <div class="item-wrapper mb24" v-for="(item, index) in modelValue" :key="index">
    <div v-if="modelValue[index]">
     <ImgUpload v-model="item['img']" :max-length="1" :crop="false" :disabled="disabled"/>
      <a-textarea class="desc-input" v-model:value.trim="item['word']" placeholder="请输入说明文字" :rows="2" :disabled="disabled"  v-if="type !== 'readonly'"/>
      <p class="desc-p" v-if="type === 'readonly' && item['word']" > {{item['word']}} </p>
      <a-button class="delete-btn" v-if="index !== 0 && type !== 'readonly'" @click="handleRemoveItemClick(index)">删除行</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw } from 'vue';
import ImgUpload from '../ImgUpload/index.vue';
interface ModelRefItemType {
  img: [];
  word: string
}

interface Props {
  modelValue: ModelRefItemType[];
  type?: "readonly" | "edit" | "create" | "copy";
  disabled?: boolean;
  maxLength?: number;
}

const props = defineProps<Props>();




const emit = defineEmits(['update:modelValue']);

const handleAddRowClick = () => {
  const groupArr = reactive(props.modelValue);
  groupArr.push({ img: [], word: '' });
  emit('update:modelValue', toRaw(groupArr));
}

const handleRemoveItemClick = (index: number) => {
  const groupArr = reactive(props.modelValue);
  groupArr.splice(index, 1);
  emit('update:modelValue', toRaw(groupArr));
}

</script>

<style lang='less' scoped>
.desc-input {
  width: 105px;
}

.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input {
  border-color: #d9d9d9 !important;
}

.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input:focus {
  box-shadow: none
}

.item-wrapper {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 35%;
  left: 120px;
}
.desc-p {
  width: 105px;
  padding: 2px;
  border: 1px solid #d9d9d9;
}
</style>
