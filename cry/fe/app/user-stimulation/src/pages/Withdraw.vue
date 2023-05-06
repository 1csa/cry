<template>
  <div>
    <a-spin :spinning="loading" size="large">
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" labelAlign="right">
        <a-form-item label="首次提现配置">
          <a-input-number v-model="config.first" />
          <span style="margin-left: 3px;">元</span>
        </a-form-item>
        <a-form-item label="日常活跃提现配置">
          <a-row v-for="(val, index) in config.daily" :key="index">
            <span>配置{{ index + 1 }}：</span>
            <a-input-number :value="val" @change="v => handleChangeDaily(v, index)" />
            <span style="margin-left: 3px;">元</span>

            <a-button type="danger" @click="handleDel(index)" style="margin-left: 30px;"
              >删除</a-button
            >
          </a-row>
          <a-row>
            <a-button type="primary" @click="handleAdd">新增</a-button>
          </a-row>
        </a-form-item>
        <a-form-item label="每日提现次数限制">
          <a-input-number v-model="config.limit_per_day" />
          <span style="margin-left: 3px;">次</span>
        </a-form-item>
        <a-form-item label="每日提现时间">
          <span>开始时间：</span>
          <a-time-picker
            :allowClear="false"
            :value="moment(config.start_time, 'HH:mm')"
            @change="handleChangeStartTime"
            :defaultValue="moment('08:00', 'HH:mm')"
            format="HH:mm"
          />

          <span style="margin-left: 30px;">结束时间：</span>
          <a-time-picker
            :allowClear="false"
            :value="moment(config.end_time, 'HH:mm')"
            @change="handleChangeEndTime"
            :defaultValue="moment('20:00', 'HH:mm')"
            format="HH:mm"
          />
        </a-form-item>
      </a-form>

      <a-button type="primary" @click="saveWithdrawConfig" style="margin-left: 80px;"
        >保存</a-button
      >
    </a-spin>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import saveLog from '../utils/logger.js';

export default Vue.extend({
  name: 'Withdraw',
  data() {
    return {
      loading: true,
      config: {
        first: 1.0,
        daily: [3.0, 10.0],
        limit_per_day: 10,
        start_time: '08:00',
        end_time: '20:00',
      },
    };
  },
  computed: {
    isTest: {
      get() {
        return window.location.host !== 'zeus.v.yidian-inc.com';
      },
    },
    host: {
      get() {
        return this.isTest
          ? 'http://operationtoolservice.test.yidian-inc.com'
          : 'http://operationtoolservice.int.yidian-inc.com';
      },
    },
  },
  created() {
    this.fetchWithdrawConfig();
  },
  methods: {
    moment,
    async fetchWithdrawConfig() {
      this.loading = true;

      const res = await axios.get(`${this.host}/redpacket/withdraw-config`);

      if (res.data.code === 0 && res.data.config) {
        this.config = res.data.config;
      }

      this.loading = false;
    },
    handleAdd() {
      this.config.daily.push(1.0);
    },
    handleChangeDaily(value, index) {
      this.config.daily.splice(index, 1, value);
    },
    handleDel(index) {
      this.config.daily.splice(index, 1);
    },
    handleChangeStartTime(val) {
      this.config.start_time = val.format('HH:mm');
    },
    handleChangeEndTime(val) {
      this.config.end_time = val.format('HH:mm');
    },
    async saveWithdrawConfig() {
      const res = await axios.post(
        `/api/proxy/${this.host}/redpacket/update-withdraw-config`,
        this.config,
      );

      if (res.data.code === 0) {
        this.$message.success('保存成功');

        if (!this.isTest) {
          saveLog(
            'saveWithdrawConfig',
            {
              userid: +this.GLOBAL.user.userid,
            },
            this.config,
          );
        }

        this.fetchWithdrawConfig();
      } else {
        this.$message.error(`保存失败：${res.data.message}`);
      }
    },
  },
});
</script>
