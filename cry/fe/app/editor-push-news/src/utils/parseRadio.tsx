import React from 'react';
import { Radio } from 'antd';

export default function (map: Record<string, string>) {
  return Object.entries(map).map(([value, label]) => <Radio value={value} key={value}>{ label }</Radio>)
}
