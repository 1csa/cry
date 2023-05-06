import React from 'react';
import { Select } from 'antd';

export default function (map: Record<string, string>) {
  return Object.entries(map).map(([value, label]) => <Select.Option value={value} key={value}>{ label }</Select.Option>)
}
