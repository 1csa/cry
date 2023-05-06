import React from 'react';

import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';

interface YDInputNumberProps extends InputNumberProps {
  flag?: string;
}

const YDInputNumber: React.FC<Omit<YDInputNumberProps, 'formatter' | 'parser'>> = ({ flag = '', ...otherProps }) => {
  // @ts-ignore
  return <InputNumber {...otherProps} formatter={value => `${value}${flag}`} parser={value => value.replace(flag, '')} />;
};

export default YDInputNumber;
