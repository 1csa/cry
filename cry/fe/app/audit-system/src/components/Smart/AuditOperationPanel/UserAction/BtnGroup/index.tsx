import React from 'react';

import { Button } from 'antd';

import './index.less';

interface BtnGroupProps {
  btnsData: any[];
  getIndex: (index: number) => void;
}
// @ts-ignore
const BtnGroup: React.FC<BtnGroupProps> = ({ btnsData, getIndex }) => {
  return btnsData.map(({ label, status, code }, index) => (
    <Button
      key={code}
      onClick={() => getIndex(index)}
      type={status === 1 ? 'primary' : 'default'}
      danger={status === 1}
      disabled={status === 2}
      style={{ marginRight: 10, marginBottom: 10 }}
    >
      {label}
    </Button>
  ));
};

export default BtnGroup;
