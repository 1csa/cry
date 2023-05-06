import React, { useEffect, useState } from 'react';
import { PAGE_SIZE, SEARCH_TOP_NEWS } from '@/config/constant';
import Axios from 'axios';
import { message } from 'antd';

export const useGetAuditDoc = (param: { [key: string]: any }, dep: any[]) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [docs, setDocs] = useState<any[]>([]);
  useEffect(() => {
    getAuditDocs();
  }, dep);
  const getAuditDocs = async () => {
    setLoading(true);
    const params = Object.assign({}, param, {
      operation_state: param.state || '0',
      operations: param.operations || param.operation || '',
      score: param.scores || -1,
      count: PAGE_SIZE,
      sort: param.sort || 'createAt',
    });
    delete params.state;
    const { data } = await Axios.get(SEARCH_TOP_NEWS, { params });
    if (data.code === 0 || data.status === 'success') {
      setCount(data.total);
      data.result.forEach(function(item) {
        item.action = item.operation;
        if (item.reason.length === 0) {
          item.reason = [''];
        } else if (item.reason.length === 1) {
          item.reason = [item.reason];
        } else {
          item.reason = item.reason.split(',');
        }
        item.reason.forEach(function(rsn, index) {
          if (rsn.indexOf('其他') > -1) {
            item.other_reason = rsn.split(':')[1];
            item.reason[index] = '其他';
          }
        });
        if (item.low_quality_reason.length === 0) {
          item.low_quality_reason = [''];
        } else if (item.low_quality_reason.length === 1) {
          item.low_quality_reason = [item.low_quality_reason];
        } else {
          item.low_quality_reason = item.low_quality_reason.split(',');
        }
        item.low_quality_reason.forEach(function(rsn, index) {
          if (rsn.indexOf('其他') > -1) {
            item.other_reason = rsn.split(':')[1];
            item.low_quality_reason[index] = '其他';
          }
        });
        if (item.high_quality_reason && item.high_quality_reason.length) {
          let topReason = item.high_quality_reason.split(':');
          item['high_quality_reason'] = topReason[0];
          item['top_reason'] = topReason[1];
        }
      });
      setDocs(data.result);
    } else {
      message.error(message.error(`数据请求失败,${data.reason ? '原因: ' + data.reason : ''}`));
    }
    setLoading(false);
  };
  return { loading, count, docs, setCount, setDocs };
};
