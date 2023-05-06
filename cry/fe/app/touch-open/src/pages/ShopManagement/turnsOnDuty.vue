<template>
  <div>
    <SelectShopForm :fixed="true" @change="handleShopChange">
      <template v-slot:search>
        <a-card class="search-box">
          <a-form ref="searchFormRef" layout="inline">
            <template v-for="(field, key) in FORMDATA" :key="key">
              <BaseFormItem
                :field="(field as unknown as FieldType)"
                :modelRef="modelRef"
                :fieldkey="key"
                :validateInfos="validateInfos"
              />
            </template>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="handleGetRotation">查看</a-button>
                <a-button type="primary" @click="jobAction('add')">新增角色</a-button>
                <a-button type="danger" @click="jobAction('del')">删除角色</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
      <template v-slot:main>
        <a-card class="table-box mt20">
          <a-row class="rotation">
            <a-col class="rotation-col">
              <div class="rotation-header">角色</div>
              <ul class="rotation-ul">
                <template v-for="(job, jobIdx) in rotationDetail.job_list" :key="job.job_id">
                  <li class="rotation-li">
                    {{ job.job_name }}<span v-if="job.job_count > 1">({{ job.job_count }})</span>
                  </li>
                </template>
              </ul>
            </a-col>
            <template v-for="(dateVal, date) in rotationDetail.rotation" :key="date">
              <a-col class="rotation-col">
                <div class="rotation-header">
                  {{ date.toString().split('-')[1] + '.' + date.toString().split('-')[2] }}
                </div>
                <ul class="rotation-ul">
                  <template v-for="(employee, employeeIdx) in dateVal" :key="employee.employee_id">
                    <li class="rotation-li">
                      <staff-tags
                        :employee-options="rotationState.employeeList"
                        :employee-list="employee"
                        :date="date"
                        :shop-id="rotationState.shopId"
                        :job-data="rotationDetail.job_list[employeeIdx]"
                        @add="handleGetRotation"
                        @remove="handleGetRotation"
                      />
                    </li>
                  </template>
                </ul>
              </a-col>
            </template>
          </a-row>
        </a-card>
        <!-- <div>
          <a-row>
            <a-col> 角色 </a-col>
          </a-row>
          <template v-for="(job, jobIdx) in rotationDetail.job_list" :key="job.job_id">
            <a-row>
              <a-col>
                {{ job.job_name }}
              </a-col>
            </a-row>
          </template>
        </div> -->
      </template>
    </SelectShopForm>
    <a-modal
      v-model:visible="jobModelState.visible"
      :title="`${jobModelState.type === 'add' ? '添加' : '删除'}角色`"
      :maskClosable="false"
      @ok="handleJob"
      width="40%"
    >
      <a-radio-group v-model:value="jobModelState.value">
        <template v-if="jobModelState.type === 'add'">
          <a-radio :value="item.job_id" v-for="item in rotationState.jobList" :key="item.job_id">{{
            item.name
          }}</a-radio>
        </template>
        <template v-else>
          <template v-for="item in rotationDetail.job_list" :key="item.job_id">
            <a-radio :value="item.job_id + item.job_count / 10" v-if="item.job_count <= 1"
              >{{ item.job_name }}
            </a-radio>
            <template v-else>
              <a-radio :value="item.job_id + count / 10" v-for="count in item.job_count"
                ><span>{{ item.job_name }}({{ count }})</span>
              </a-radio>
            </template>
          </template>
        </template>
      </a-radio-group>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ShopTurnsOnDuty',
};
</script>
<script lang="ts" setup>
import type { EmployeeList, shopId } from '@/types/shop/shop';
import type {
  EmployeeListResultProps,
  JobListResultProps,
  QueryEmployeeListProps,
  QueryRotationListProps,
  RotationListResultProps,
  UpdateShopJob,
} from '@/services/shop';
import type { FieldType } from '@/components/BaseFormItem/index-v2.vue';
import { reactive, UnwrapRef } from 'vue';
import { message, Form } from 'ant-design-vue';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index-v2.vue';
import SelectShopForm from './components/SelectShopForm.vue';
import { rotationFormFn } from './constants';
import { getRotationList, getJobList, updateShopJob, getEmployeeList } from '@/services/shop';
import dayjs from 'dayjs';
import StaffTags from './components/StaffTags.vue';
import { cloneDeep } from 'lodash';

interface RotationStateType {
  shopId: shopId;
  jobList: JobListResultProps[];
  employeeList: EmployeeList[];
}
interface ModelStateType {
  visible: boolean;
  type: string;
  value: number | undefined;
}
const layout = reactive({
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
});
const dateFormat = 'YYYY-MM-DD';

const useForm = Form.useForm;

const FORMDATA = rotationFormFn();

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA as any);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const rotationState: RotationStateType = reactive({
  shopId: null,
  jobList: [],
  employeeList: [],
});
const rotationDetail: UnwrapRef<RotationListResultProps> = reactive({
  job_list: [],
  rotation: {},
  rotationList: {},
});
const jobModelState = reactive<ModelStateType>({
  visible: false,
  type: '',
  value: undefined,
});
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
const fetchJobList = async () => {
  const res = await getJobList();
  rotationState.jobList = res.result;
};
const fetchEmployeeList = async () => {
  const res = await getEmployeeList<Partial<QueryEmployeeListProps>, EmployeeListResultProps>({
    shop_id: rotationState.shopId,
    page: 1,
    status: 1,
    page_size: 100,
  });
  const { list } = res.result;
  rotationState.employeeList = list.map((item) => {
    return {
      employee_id: item.id,
      name: item.name,
    };
  });
};

const handleGetRotation = async () => {
  await validate();
  const params = cloneDeep(modelRef as QueryRotationListProps);
  params.start_time = params.time && params.time[0].format(dateFormat);
  params.end_time = params.time && params.time[1].format(dateFormat);
  params.shop_id = rotationState.shopId;
  delete params['time'];
  const { result } = await getRotationList(params);
  Object.assign(rotationDetail, result);
};

const handleShopChange = (e: number) => {
  rotationState.shopId = e;
  init();
};

const jobAction = (type: string) => {
  jobModelState.type = type;
  jobModelState.visible = true;
};
const handleJob = async () => {
  if (!jobModelState.value) return message.error('请选择角色！');
  let params: UpdateShopJob = {
    shop_id: rotationState.shopId,
    job_id: Math.floor(jobModelState.value),
    op_type: jobModelState.type === 'add' ? 1 : 2,
  };
  await updateShopJob(params);
  Object.assign(jobModelState, {
    visible: false,
    type: '',
    value: undefined,
  });
  // await fetchJobList();
  await handleGetRotation();
};
const init = async () => {
  modelRef.time = [dayjs(), dayjs().add(15, 'day')];
  await fetchJobList();
  await fetchEmployeeList();
  await handleGetRotation();
};
// init();
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
.table-box {
  overflow-x: auto;
}
.rotation {
  width: max-content;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
}
.rotation-header {
  width: 100%;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.rotation-col {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
}
.rotation-header,
.rotation-li {
  display: flex;
  justify-content: center;
  padding: 15px 8px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  min-width: 100px;
}
// .rotation-li {
//   flex: auto;
// }
// .rotation-header {
//   height: 50px;
// }
</style>
