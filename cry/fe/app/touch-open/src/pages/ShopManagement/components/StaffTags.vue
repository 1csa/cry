<template>
  <div>
    <template v-for="(tag, index) in list" :key="index">
      <a-tag closable @close="handleTagClose(tag)">
        {{ tag.name }}
      </a-tag>
    </template>
    <a-select
      v-if="state.selectVisible"
      ref="selectRef"
      size="small"
      style="min-width: 80px"
      label-in-value
      v-model:value="state.selectValue"
      :options="employeeOptions"
      :fieldNames="{ label: 'name', value: 'employee_id' }"
      @blur="handleSelectConfirm"
    />
    <a-tag
      v-if="!state.selectVisible && length < jobData.job_count"
      style="background: #fff; border-style: dashed"
      @click="showSelect"
    >
      <plus-outlined />
    </a-tag>
  </div>
</template>

<script lang="ts" setup>
import { toRaw, reactive, ref, toRefs, UnwrapRef, nextTick, computed, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { EmployeeListOptionType, JobListResultProps } from '@/services/shop';
import type { EmployeeList } from '@/types/shop/shop';
import { updateRotation } from '@/services/shop';
interface StateType {
  selectVisible: boolean;
  selectValue:
    | {
        value: number;
        lable: string;
        option: {
          employee_id: number;
          name: string;
        };
      }
    | undefined;
}

interface Props {
  employeeOptions: EmployeeList[];
  employeeList: EmployeeList[];
  shopId: number | null;
  date: string | number;
  jobData: JobListResultProps;
}
const props = defineProps<Props>();
const { employeeList, jobData, date, shopId } = toRefs(props);
const selectRef = ref();
const list = ref<EmployeeList[]>([]);
list.value = props.employeeList;
const emit = defineEmits(['add', 'remove']);
const state: UnwrapRef<StateType> = reactive({
  selectVisible: false,
  selectValue: undefined,
});
const length = computed(() => {
  return employeeList.value.length;
});
const showSelect = () => {
  state.selectVisible = true;
  nextTick(() => {
    selectRef.value.focus();
  });
};
const handleTagClose = async (removedTag: EmployeeList) => {
  await fetchUpdateRotation(removedTag.employee_id, 2);
  emit('remove');
};

const handleSelectConfirm = async () => {
  if (state.selectValue) {
    const selectValue = state.selectValue.option;
    const hasId = props.employeeList.some((v) => selectValue.employee_id === v.employee_id);
    if (selectValue.employee_id && !hasId) {
      try {
        await fetchUpdateRotation(selectValue.employee_id, 1);
        emit('add');
      } catch (error) {
        console.log(error);
      }
    }
  }

  Object.assign(state, {
    selectVisible: false,
    selectValue: undefined,
  });
};

const fetchUpdateRotation = async (employee_id: number, op_type: number) => {
  let params = {
    job_id: jobData.value.job_id,
    date: date.value,
    shop_id: shopId?.value,
    employee_id: employee_id,
    op_type: op_type,
  };
  return await updateRotation(params);
};
watch(
  () => props.employeeList,
  (newVal, oldVal) => {
    list.value = newVal;
  },
);
</script>
<style lang="less" scoped></style>
