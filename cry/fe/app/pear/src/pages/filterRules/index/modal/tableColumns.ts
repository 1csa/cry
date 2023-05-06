import React from "react";

export const Columns =
  [
    // {
    //   title: '序号',
    //   dataIndex: 'primaryId',
    //   key: 'primaryId',
    //   align: 'center',
    //   fixed: 'left',
    //   width: 70,
    // },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    // {
    //   title: 'ruleId',
    //   dataIndex: 'ruleId',
    //   key: 'ruleId',
    //   align: 'center',
    //   fixed: 'left',
    //   width: 70,
    // },
    {
      title: '端',
      dataIndex: 'appIdGroup',
      key: 'appIdGroup',
      align: 'center',
      width: 120,
    },
    {
      title: '场景',
      dataIndex: 'scene',
      key: 'scene',
      align: 'center',
      width: 115,
    },
    {
      title: '运营工具规则Id',
      dataIndex: 'opsToolRuleId',
      key: 'opsToolRuleId',
      align: 'center',
      width: 150,
    },
    {
      title: 'fromId',
      dataIndex: 'fromId',
      key: 'fromId',
      align: 'center',
      width: 130,

    },
    {
      title: 'appId',
      dataIndex: 'appId',
      key: 'appId',
      align: 'center',
      width: 120,

    },
    {
      title: '索引层fakeAppId',
      dataIndex: 'fakeAppId',
      key: 'fakeAppId',
      align: 'center',
      width: 150,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      align: 'center',
      width: 110,
    },
    {
      title: '规则类型',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      width: 120,
      filters: [
        { text: 'ScopeFilter', value: 'ScopeFilter' },
        { text: 'TodFilter', value: 'TodFilter' },
        { text: 'AllianceScopeFilter', value: 'AllianceScopeFilter' },
        { text: 'LowQualityFilter', value: 'LowQualityFilter' },
        { text: 'OpsToolFilter', value: 'OpsToolFilter' },
        { text: 'ExemptFilter', value: 'ExemptFilter' },
      ],
      onFilter: (value: string, record: any) => {
        return record.category.includes(value)
      },
    },
    {
      title: '是否下沉',
      dataIndex: 'sink',
      key: 'sink',
      align: 'center',
      width: 110,
      render(text: any) {
        return text === true ? '是' : '否'
      },
      // filters: [
      //   { text: '是', value: 'true' },
      //   { text: '否', value: 'false' },
      // ],
      // onFilter: (value: string, record: any) => {
      //   if (record.sink === value) {
      //     return true
      //   }


      // }
    },
    // {
    //   title: '下沉规则',
    //   dataIndex: 'sinkRules',
    //   key: 'sinkRules',
    //   align: 'center',
    //   width: 140,
    // },
    {
      title: '规则描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 280
    },
    {
      title: '豁免规则名称',
      dataIndex: 'exemptRuleName',
      key: 'exemptRuleName',
      align: 'center',
      width: 135,
    },
    {
      title: '用户分层',
      dataIndex: 'userLabel',
      key: 'userLabel',
      align: 'center',
      width: 135,
    },
    {
      title: '城市列表',
      dataIndex: 'cityList',
      key: 'cityList',
      align: 'center',
      width: 160,
      render(text: any) {
        return text && text.join(',')
      },
    },
    {
      title: '实验bucket',
      dataIndex: 'bucket',
      key: 'bucket',
      align: 'center',
      width: 150,
    },

  ];