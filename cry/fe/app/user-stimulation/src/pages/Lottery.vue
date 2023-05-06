<template>
  <div>
    <a-spin :spinning="loading" size="large">
      <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }" labelAlign="right">
        <a-form-item
          v-for="(config, index) in rate_config"
          :key="index"
          :label="`红包${index + 1}`"
        >
          <a-input-number v-model="config.bonus" />

          <span style="margin-left: 40px;">概率：</span>
          <a-input-number v-model="config.percent_rate" style="margin-left: 10px;" />

          <a-button type="danger" @click="handleDel(index)" style="margin-left: 50px;"
            >删除</a-button
          >
        </a-form-item>

        <div style="margin-left: 80px;">
          <a-button type="primary" @click="handleAdd">新增</a-button>
          <a-button type="primary" @click="saveLotteryRedpacketConfig" style="margin-left: 20px;"
            >保存</a-button
          >
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import saveLog from '../utils/logger.js';

export default Vue.extend({
  name: 'Lottery',
  data() {
    return {
      loading: true,
      rate_config: [
        {
          bonus: 0.02,
          percent_rate: 0.5,
        },
      ],
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
    this.fetchLotteryRedpacketConfig();
  },
  methods: {
    async fetchLotteryRedpacketConfig() {
      this.loading = true;

      const res = await axios.get(`${this.host}/redpacket/lottery-redpacket-config`);

      if (res.data.code === 0 && res.data.config.rate_config) {
        this.rate_config = res.data.config.rate_config;
      }

      this.loading = false;
    },
    handleAdd() {
      this.rate_config.push({
        bonus: 0.02,
        percent_rate: 0.5,
      });
    },
    handleDel(index) {
      this.rate_config.splice(index, 1);
    },
    async saveLotteryRedpacketConfig() {
      const totalP = this.rate_config.reduce((last, cur) => {
        return last + cur.percent_rate;
      }, 0);

      if (Math.abs(totalP - 1) > 0.01) {
        this.$message.error('概率之和必须为1，请修改后重新保存');

        return;
      }
      const res = await axios.post(
        `/api/proxy/${this.host}/redpacket/update-lottery-redpacket-config`,
        {
          rate_config: this.rate_config,
        },
      );

      if (res.data.code === 0) {
        this.$message.success('操作成功');

        if (!this.isTest) {
          saveLog(
            'saveLotteryRedpacketConfig',
            {
              userid: +this.GLOBAL.user.userid,
            },
            {
              rate_config: this.rate_config,
            },
          );
        }

        this.fetchLotteryRedpacketConfig();
      } else {
        this.$message.error(`操作失败：${res.data.message}`);
      }
    },
  },
});
</script>
