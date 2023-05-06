import React from 'react';
import moment from 'moment';

import { getUserReviewTag } from '@/components/BusinessLogic';
import { releaseTypeResult } from '@/data/constants';
import appConfig from '@/config/app.config';
import { ToInitButtonGroupType } from '@/types';

type RiskType = {
  cn: string;
};

const eventTrs = {
  receive_task: 'machineAuditPath',
  machine_audit_finish: 'keywordRisks',
  commit_task: 'auditResult',
  release_task: 'releaseType',
};

const remarkTemplate = {
  machineAuditPath: (record: any) => {
    // 进审 【业务方】进行【图文负反馈审核】/【视频负反馈审核】
    return <span>{record.businessUnitName}</span>;
  },
  keywordRisks: (record: any) => {
    // 机审 【机审结果】【机审模型】【机审标签】（【关键词模块】 习近平/习大大；【低俗模块】：0.57；）

    // 易盾审核完成有reason的话用reason，没有的话走之前的逻辑
    const { keywordRisks, reason } = record.extraJson;
    const realData = keywordRisks ? (typeof keywordRisks === 'string' ? JSON.parse(keywordRisks) : keywordRisks) : [];
    const words = realData.length ? realData.map((item: RiskType) => item.cn).join('、') : '';
    return (
      <span>
        {record.businessUnitName} {reason ? reason : words}
      </span>
    );
  },
  auditResult: (record: any) => {
    const { partitionName, auditRisks, auditResult } = record.extraJson;
    const auditTag =
      auditResult && Array.isArray(auditResult?.labels) && auditResult?.labels?.length
        ? auditResult?.labels.map((item: ToInitButtonGroupType) => item.label)
        : auditRisks
        ? auditRisks.map((item: RiskType) => {
            return Object.keys(getUserReviewTag(record.businessContentTypeId))?.length
              ? getUserReviewTag(record.businessContentTypeId)[item.cn]
              : item.cn;
          })
        : [];
    // 人审 XXXXX分区，文章通过不展示/低俗
    return (
      <span>
        {partitionName ? `${partitionName}，` : ''}
        {auditTag.length > 0 && auditTag.join('、')}
      </span>
    );
  },
  releaseType: (record: any) => {
    // 释放 结束审核，XXX主动释放至XXXXXX分区/任务超时，暴雪系统释放至XXXXXX分区
    const { releaseType, partitionName } = record.extraJson;
    return (
      <span>
        {releaseTypeResult[releaseType].replace('XXX', record.operatorName)} {partitionName}
      </span>
    );
  },
};

const getLogColumns = () => {
  return [
    {
      title: '开始时间-结束时间',
      dataIndex: 'stamp',
      key: 'stamp',
      render: (text: number, record: any) => {
        return (
          <>
            <span>{record.startTime}</span> ～
            <br />
            <span> {record.endTime}</span>
          </>
        );
      },
    },
    {
      title: '耗时',
      dataIndex: 'elapsed',
      key: 'elapsed',
      render: (time: number) => {
        return <span>{moment.utc(time).format('HH:mm:ss')}s</span>;
      },
    },
    {
      title: '审核结果',
      dataIndex: 'resultText',
      key: 'resultText',
      render: (resultText: number, record: any) => {
        return record.result ? resultText : '-';
      },
    },
    {
      title: '审核阶段',
      dataIndex: 'eventDescription',
      key: 'eventDescription',
      render: (eventDescription: string, record: any) => {
        return (
          <span>
            {eventDescription}
            {record.stageText ? ` - ${record.stageText}` : null}
          </span>
        );
      },
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      render: (operatorName: string) => {
        return operatorName ? operatorName : appConfig.appName;
      },
    },
    {
      title: '备注',
      dataIndex: 'extraJson',
      key: 'extraJson',
      render: (extraJson: Object, record: any) => {
        return <span>{remarkTemplate[eventTrs[record.event.toLowerCase()]](record)}</span>;
      },
    },
  ];
};

export { getLogColumns };
