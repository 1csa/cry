<template>
  <div>
    <a-spin :spinning="loading" size="large">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="邀请人红包" key="1">
          <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" labelAlign="right">
            <a-form-item label="红包总数/日">
              <a-input-number v-model="config.per_day_count" />
              <span style="margin-left: 3px;">个</span>
            </a-form-item>
            <a-form-item label="每人邀请好友个数/日">
              <a-input-number v-model="config.per_day_personal_count" />
              <span style="margin-left: 3px;">个</span>
            </a-form-item>
            <a-form-item label="每人邀请好友个数上限">
              <a-input-number v-model="config.personal_count" />
              <span style="margin-left: 3px;">个</span>
            </a-form-item>
            <a-form-item label="阶段收益配置">
              <div
                v-for="(v, k) in config.invite_range_config"
                :key="k"
                style="margin-bottom: 30px;"
              >
                <a-row>
                  <a-input-number v-model="v.start" />
                  <span style="margin: 0 3px;">-</span>
                  <a-input-number v-model="v.end" />
                  <span style="margin-left: 3px;">个</span>

                  <a-button type="danger" @click="handleDelInviter(k)" style="margin-left: 50px;"
                    >删除</a-button
                  >
                </a-row>
                <a-row>
                  <span>绑定邀请码：</span>
                  <a-input-number v-model="v.invite_bonus" style="margin-left: 10px;" />
                  <span style="margin-left: 3px;">元</span>
                </a-row>
                <a-row>
                  <div style="float: left;">被邀请人阅读后邀请人可获得：</div>
                  <div
                    v-for="(config, index) in v.active_gained_bonus"
                    :key="index"
                    style="margin-left: 200px;"
                  >
                    <span>第</span>
                    <a-input-number v-model="config.day" style="margin: 0 3px;width: 70px;" />
                    <span>天</span>

                    <a-input-number v-model="config.count" style="margin-left: 20px;width: 80px;" />
                    <span style="margin-left: 3px;">篇</span>

                    <a-input-number v-model="config.bonus" style="margin-left: 20px;" />
                    <span style="margin-left: 3px;">元</span>

                    <a-button
                      type="danger"
                      @click="handleDelActiveGainedBonus(k, index)"
                      style="margin-left: 50px;"
                      >删除</a-button
                    >
                  </div>
                </a-row>
                <a-row>
                  <a-button
                    type="primary"
                    @click="handleAddActiveGainedBonus(k)"
                    style="margin-left: 200px;"
                    >新增</a-button
                  >
                </a-row>
              </div>
              <div>
                <a-button type="primary" @click="handleAddInviter">新增</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="被邀请红包" key="2" forceRender>
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" labelAlign="right">
            <a-form-item label="绑定邀请码">
              <a-input-number
                v-model="config.be_invited_bonus"
                style="margin: 0 3px;width: 70px;"
              />
              <span>元</span>
            </a-form-item>
            <a-form-item label="阅读后被邀请人获得">
              <a-row v-for="(config, index) in config.be_invited_range_config" :key="index">
                <span>第</span>
                <a-input-number v-model="config.day" style="margin: 0 3px;width: 70px;" />
                <span>天</span>

                <a-input-number v-model="config.count" style="margin-left: 20px;width: 80px;" />
                <span style="margin-left: 3px;">篇</span>

                <a-input-number v-model="config.bonus" style="margin-left: 20px;" />
                <span style="margin-left: 3px;">元</span>

                <a-button type="danger" @click="handleDelInvitee(index)" style="margin-left: 50px;"
                  >删除</a-button
                >
              </a-row>
            </a-form-item>
          </a-form>

          <a-button type="primary" @click="handleAddInvitee" style="margin-left: 200px;"
            >新增</a-button
          >
        </a-tab-pane>
      </a-tabs>

      <a-button
        type="primary"
        @click="saveInviteRedpacketConfig"
        style="margin-top: 30px;margin-left: 80px;"
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
  name: 'Invitation',
  data() {
    return {
      loading: true,
      config: {
        per_day_count: 0,
        per_day_personal_count: 0,
        personal_count: 0,
        invite_range_config: [
          {
            start: 1,
            end: 10,
            invite_bonus: 1.5,
            active_gained_bonus: [
              {
                day: 1,
                bonus: 0.5,
                count: 3,
              },
            ],
          },
        ],
        be_invited_range_config: [
          {
            day: 1,
            bonus: 1.2,
            count: 5,
          },
        ],
        be_invited_bonus: 0.3,
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
    this.fetchInviteRedpacketConfig();
  },
  methods: {
    moment,
    async fetchInviteRedpacketConfig() {
      this.loading = true;

      const res = await axios.get(`${this.host}/redpacket/invite-redpacket-config`);

      if (
        res.data.code === 0 &&
        res.data.config &&
        res.data.config.invite_range_config &&
        res.data.config.be_invited_range_config
      ) {
        this.config = res.data.config;
      }

      this.loading = false;
    },
    handleAddInviter() {
      this.config.invite_range_config.push({
        start: 1,
        end: 10,
        invite_bonus: 1.5,
        active_gained_bonus: [
          {
            day: 1,
            bonus: 0.5,
            count: 3,
          },
        ],
      });
    },
    handleDelInviter(index) {
      this.config.invite_range_config.splice(index, 1);
    },
    handleAddInvitee() {
      this.config.be_invited_range_config.push({
        day: this.config.be_invited_range_config.length + 1,
        bonus: 0.05,
        count: 3,
      });
    },
    handleDelInvitee(index) {
      this.config.be_invited_range_config.splice(index, 1);
    },
    handleAddActiveGainedBonus(k) {
      this.config.invite_range_config[k].active_gained_bonus.push({
        day: this.config.invite_range_config[k].active_gained_bonus.length + 1,
        bonus: 0.5,
        count: 3,
      });
    },
    handleDelActiveGainedBonus(k, index) {
      this.config.invite_range_config[k].active_gained_bonus.splice(index, 1);
    },
    checkInviteRangeOk() {
      let lastEnd = -1;

      for (let i = 0, len = this.config.invite_range_config.length; i < len; i++) {
        const currentConfig = this.config.invite_range_config[i];

        if (currentConfig.end < currentConfig.start) {
          this.$message.error(`阶段收益${i + 1}的结束值不能小于起始值，请修改后再保存`);

          return false;
        }

        if (currentConfig.start <= lastEnd) {
          this.$message.error(`阶段收益${i + 1}的起始值必须大于上一阶段的结束值，请修改后再保存`);

          return false;
        }

        lastEnd = currentConfig.end;
      }

      return true;
    },
    async saveInviteRedpacketConfig() {
      const ok = this.checkInviteRangeOk();
      if (!ok) {
        return;
      }

      const res = await axios.post(
        `/api/proxy/${this.host}/redpacket/update-invite-redpacket-config`,
        this.config,
      );

      if (res.data.code === 0) {
        this.$message.success('保存成功');

        if (!this.isTest) {
          saveLog(
            'saveInviteRedpacketConfig',
            {
              userid: +this.GLOBAL.user.userid,
            },
            this.config,
          );
        }

        this.fetchInviteRedpacketConfig();
      } else {
        this.$message.error(`保存失败：${res.data.message}`);
      }
    },
  },
});
</script>
