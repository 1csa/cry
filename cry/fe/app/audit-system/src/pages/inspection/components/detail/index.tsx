import React, { useState } from 'react';
import moment from 'moment';

import { Modal, Descriptions, Typography, Spin, message } from 'antd';

import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';

import { FlagPassAndReject, FlagScore, BusinessTypeOptions, defaultType, TypeOptions } from '../config';

import { createTask } from '@/services/inspection';

// 小数 转 百分数
const decimal2Percent = (num: number) => `${(num * 100).toFixed(0)}%`;

interface DetailProps {
  type?: 'detail' | 'confirm'; // 详情 | 创建确认 default: 'detail'
  toggleVisible: () => void;
  data: any; // 详情数据
  createSuccessCallback?: () => void;
}

const Detail: React.FC<DetailProps> = ({ type = 'detail', toggleVisible, data, createSuccessCallback }) => {
  const isConfirm = type === 'confirm';
  const modalFooter = isConfirm ? {} : { footer: null };

  const {
    amountList,
    amountPass,
    amountReject,
    dateRange: [startDate, endDate],
    inspectionPeopleDetailDTOS,
    mark,
    operatorNames,
    partZoneId,
    partZoneName,
    ratioList,
    ratioPass,
    ratioReject,
    sourceBusinessId,
    sourceBusinessName,
    sourceBusinessUnitId,
    sourceBusinessUnitName,
    sum,
    targetBusinessId,
    targetBusinessName,
    targetBusinessUnitId,
    targetBusinessUnitName,
    type: samplingType = defaultType,
  } = data;

  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    const { errorno, data: resData } = await requestAsyncRes(() => createTask(data));
    setLoading(false);
    if (errorno === 0) {
      message.success('创建质检任务成功！');
      typeof createSuccessCallback === 'function' && createSuccessCallback();
      toggleVisible();
    }
  };

  const handleCancel = () => {
    toggleVisible();
  };

  // 质检任务ID
  const idInfo = [
    {
      label: '质检任务ID',
      value: '',
    },
  ];

  const ratioType = [
    {
      label: '通过抽检比例',
      value: decimal2Percent(ratioPass ?? 0),
    },
    {
      label: '拒绝抽检比例',
      value: decimal2Percent(ratioReject ?? 0),
    },
  ];

  const amountType = [
    {
      label: '通过抽检条数',
      value: amountPass ?? 0,
    },
    {
      label: '拒绝抽检条数',
      value: amountReject ?? 0,
    },
  ];

  const scoreRatioType = ratioList?.map((item: number, index: number) => ({
    label: `${index}分抽检比例`,
    value: decimal2Percent(item ?? 0),
  }));

  const scoreAmountType = amountList?.map((item: number, index: number) => ({
    label: `${index}分抽检条数`,
    value: item,
  }));

  // 通过拒绝 | 分数 默认值-通过拒绝
  const flag = BusinessTypeOptions.find((item: any) => item.value === sourceBusinessUnitId)?.flag ?? FlagPassAndReject;

  // 抽检数据
  let samplingAmount = [];
  if (flag === FlagPassAndReject) {
    if (samplingType === 'ratio') {
      samplingAmount = ratioType;
    } else if (samplingType === 'amount') {
      samplingAmount = amountType;
    }
  } else if (flag === FlagScore) {
    if (samplingType === 'ratio') {
      samplingAmount = scoreRatioType;
    } else if (samplingType === 'amount') {
      samplingAmount = scoreAmountType;
    }
  }

  // 抽检基础信息
  const info = [
    {
      label: '所属业务',
      value: sourceBusinessName,
    },
    {
      label: '所属子业务',
      value: sourceBusinessUnitName,
    },
    {
      label: '审核时间',
      value: `${moment(startDate).format('YYYY-MM-DD')} - ${moment(endDate).format('YYYY-MM-DD')}`,
    },
    {
      label: '抽检名单',
      value: operatorNames.join('、'),
    },
    {
      label: '抽检方式',
      value: TypeOptions.find((item: any) => item.value === samplingType)?.label,
    },
    ...samplingAmount,
    {
      label: '备注',
      value: mark,
    },
  ];

  // 抽检 -> 目标
  const target = [
    {
      label: '子业务',
      value: targetBusinessUnitName,
    },
    {
      label: '分区',
      value: partZoneName,
    },
  ];

  // 抽检条数 具体到人员
  const seperator =
    inspectionPeopleDetailDTOS?.map((item: any) => ({
      label: item.operatorName,
      value: item.inspectionNumber,
    })) ?? [];

  // 抽检条数 具体到人员
  const amount = [
    {
      label: '总共',
      value: sum,
    },
    ...seperator,
  ];

  return (
    <Modal
      title={`质检任务${isConfirm ? '创建确认' : '详情'}`}
      visible
      width={900}
      onOk={handleOk}
      onCancel={handleCancel}
      bodyStyle={{ padding: '10px 20px' }}
      destroyOnClose
      confirmLoading={loading}
      {...modalFooter}
    >
      <Spin spinning={loading}>
        {idInfo[0].value ? (
          <Descriptions>
            {idInfo.map((item: any) => (
              <Descriptions.Item key={item.label} label={item.label}>
                <Typography.Link type="danger">{item.value}</Typography.Link>
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : null}

        <Descriptions title="质检范围">
          {info.map((item: any) => (
            <Descriptions.Item key={item.label} label={item.label}>
              <Typography.Link type="danger">{item.value}</Typography.Link>
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Descriptions title="抽检到">
          {target.map((item: any) => (
            <Descriptions.Item key={item.label} label={item.label}>
              <Typography.Link type="danger">{item.value}</Typography.Link>
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Descriptions title="抽检条数如下">
          {amount.map((item: any) => (
            <Descriptions.Item key={item.label} label={item.label}>
              <Typography.Link type="danger">{item.value}</Typography.Link>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default Detail;
