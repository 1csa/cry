<template>
  <div>
    <div>
      <a-spin :spinning="loading" size="large">
        <a-button type="primary" @click="handleAdd">新建</a-button>

        <a-table :columns="columns" :dataSource="config" :rowKey="record => record.day">
          <span slot="day" slot-scope="day">第{{ day }}天</span>

          <template slot="action" slot-scope="row">
            <a-button type="primary" @click="handleEdit(row)">编辑</a-button>
            <a-button type="danger" @click="handleDel(row)" style="margin-left: 10px;"
              >删除</a-button
            >
          </template>
        </a-table>

        <a-modal :title="`${editting ? '编辑' : '新增'}签到红包`" v-model="visible" @ok="handleOk">
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" labelAlign="right">
            <a-form-item label="时间">
              <span>第</span>
              <a-input-number
                :disabled="editting"
                v-model="edittingConfig.day"
                style="margin: 0 5px;"
              />
              <span>天</span>
            </a-form-item>
            <a-form-item label="金额">
              <a-input-number v-model="edittingConfig.bonus" style="margin: 0 5px;" />
            </a-form-item>
            <a-form-item label="翻倍系数">
              <a-input-number v-model="edittingConfig.rate" style="margin: 0 5px;" />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-spin>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import saveLog from '../utils/logger.js';

const defaultEdittingConfig = JSON.stringify({
  day: 1,
  bonus: 0.02,
  rate: 1,
});

export default Vue.extend({
  name: 'SignIn',
  data() {
    return {
      loading: true,
      visible: false,
      editting: false,
      edittingConfig: JSON.parse(defaultEdittingConfig),
      config: [
        {
          day: 1,
          bonus: 0.02,
          rate: 1,
        },
      ],
      columns: [
        {
          title: '时间',
          dataIndex: 'day',
          scopedSlots: { customRender: 'day' },
        },
        {
          title: '红包金额（元）',
          dataIndex: 'bonus',
          key: 'bonus',
        },
        {
          title: '翻倍系数',
          dataIndex: 'rate',
          key: 'rate',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 180,
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
    this.fetchSignRedpacketConfig();
  },
  methods: {
    async fetchSignRedpacketConfig() {
      this.loading = true;

      const res = await axios.get(`${this.host}/redpacket/sign-redpacket-config`);

      if (res.data.code === 0 && res.data.config.config) {
        this.config = res.data.config.config.sort((a, b) => a.day - b.day);
      }

      this.loading = false;
    },
    handleAdd() {
      this.edittingConfig = JSON.parse(defaultEdittingConfig);

      this.visible = true;
      this.editting = false;
    },
    handleEdit(row) {
      this.edittingConfig = row;

      this.visible = true;
      this.editting = true;
    },
    async handleOk() {
      if (!this.editting) {
        if (this.config.some(item => item.day === this.edittingConfig.day)) {
          this.$message.error(`第${this.edittingConfig.day}天的数据已经存在，不能重复配置`);

          return;
        }

        this.config.push(this.edittingConfig);
      }

      await this.saveSignRedpacketConfig();

      this.visible = false;
    },
    handleDel(row) {
      this.config = this.config.filter(item => {
        return item.day !== row.day;
      });

      this.saveSignRedpacketConfig();
    },
    async saveSignRedpacketConfig() {
      const res = await axios.post(
        `/api/proxy/${this.host}/redpacket/update-sign-redpacket-config`,
        {
          config: this.config,
        },
      );

      if (res.data.code === 0) {
        this.$message.success('操作成功');

        if (!this.isTest) {
          saveLog(
            'saveSignRedpacketConfig',
            {
              userid: +this.GLOBAL.user.userid,
            },
            {
              config: this.config,
            },
          );
        }

        this.fetchSignRedpacketConfig();
      } else {
        this.$message.error(`操作失败：${res.data.reason}`);
      }
    },
  },
});
</script>
