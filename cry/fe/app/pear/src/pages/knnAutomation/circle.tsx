import React from 'react';
import { Card } from 'antd';

import './index.less';

const Circle = () => {
  return (
    <div className="circle">
      <Card bordered={false} className="circle-Card">
        knn 圈库
      </Card>
    </div>
  );
};

export default Circle;
