import React from 'react';
import moment from 'moment';
import { actionType, wordStatus, status } from './constants';
import { DATE_FORMAT_SS, DATE_FORMAT_DD } from '@/utils/dev_helper';

// 设置生效状态
const statusMap = (now: number, startTime: number, endTime: number) => {
  if (now <= startTime) {
    return wordStatus.notEffect;
  } else if (startTime < now && now < endTime) {
    return wordStatus.effect;
  } else if (now >= endTime) {
    return wordStatus.expired;
  }
};

// 渲染审核指令的文字
const renderActionType = (val: number) => {
  return (
    actionType.find((ele: any) => {
      if (ele.value === val) {
        return ele;
      }
    })?.label ?? ''
  );
};

// 渲染bus-sub
const renderSubBusiness = (item: any) => {
  return item.map((ele: any, index: number) => {
    return (
      <div
        key={
          ele.actionTableModels[0] &&
          ele.businessName +
            ele.businessName +
            index +
            ele.actionTableModels[0].businessName +
            ele.actionTableModels[0].subName
        }
        className="sub-buisness"
      >
        {ele.businessName} -{' '}
        {ele.actionTableModels
          .map((val: any) => {
            return val.subName;
          })
          .join('、')}
      </div>
    );
  });
};

// 序列化生效名称
const formateEffectiveInfo = (list: any[], wordId: number) => {
  return (
    Array.isArray(list) &&
    list.length &&
    list.map((ele: any, index: number) => {
      return (
        <div className="group-item" key={index + wordId || 0 + ele.subName || ''}>
          <div className="action-type">{renderActionType(ele.actionType)}</div>
          <div className="sub-bus-item">{renderSubBusiness(ele.actionTableModels || [])}</div>
        </div>
      );
    })
  );
};

const getColumns = (operation?: any) => {
  const head = [
    {
      title: '审核词',
      // width: 100,
      dataIndex: 'word',
      key: 'word',
      fixed: 'left',
    },
    {
      title: '豁免词',
      // width: 100,
      dataIndex: 'exemptWord',
      key: 'exemptWord',
    },
    {
      title: '审核词分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      // width: 150,
    },
    {
      title: '审核指令 - 生效业务方 - 生效区域',
      dataIndex: 'actionTable',
      key: 'actionTable',
      width: 400,
      render: (text: any, record: any) => {
        return (
          <div className="aggregate-data">
            {(record?.actionTable || record?.actionTableModelList) &&
              formateEffectiveInfo(
                record.actionTable || record.actionTableModelList,
                record?.wordId + 1 * 0.2,
              )}
          </div>
        );
      },
    },
    {
      title: '生效时间',
      dataIndex: 'startTime',
      key: 'enableTime',
      // width: 360,
      render: (text: any, record: any) => {
        return (
          <span>
            {moment(record.startTime).format(DATE_FORMAT_DD)} ——{' '}
            {moment(record.endTime).format(DATE_FORMAT_DD)}
          </span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: 150,
      render: (text: any, record: any) => {
        // 不是编辑页面 用当前时间判断
        if (!location.search) {
          // const now: number = new Date().getTime();
          // return (
          //   <>{status(now, moment(record.startTime).valueOf(), moment(record.endTime).valueOf())}</>
          // );
          return <>{status.find(item => item.value === text)?.label ?? ''}</>;
        } else {
          return (
            <>
              {statusMap(
                moment(record.updateTime).valueOf(),
                moment(record.startTime).valueOf(),
                moment(record.endTime).valueOf(),
              )}
            </>
          );
        }
      },
    },
  ];
  const end = [
    {
      title: '操作人',
      dataIndex: 'operationUName',
      key: 'operationUName',
      render: (text: any, record: any) => {
        return <div className="aggregate-data">{record.operationUName}</div>;
      },
      // width: 150,
    },
    {
      title: '提交时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      // width: 180,
      render: (text: any, record: any) => {
        return (
          <span>
            {record.updateTime
              ? moment(record.updateTime).format(DATE_FORMAT_SS)
              : moment(record.createTime).format(DATE_FORMAT_SS)}
          </span>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      // width: 150,
    },
  ];
  if (operation) {
    return [...head, ...end, ...[operation]];
  } else {
    return [...head, ...end];
  }
};

export default getColumns;
