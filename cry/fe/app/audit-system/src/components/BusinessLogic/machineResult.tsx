import React from 'react';

import { Tag } from 'antd';

import { isJSON } from '@/utils/dev_helper';

// 解析数美字段
export const parseDescription = (machineResult: any) => {
  const { description = '' } = isJSON(machineResult?.antiFrandResult?.detail) ? JSON.parse(machineResult.antiFrandResult.detail) : {};
  return description ? <Tag>数美：{description}</Tag> : null;
};
