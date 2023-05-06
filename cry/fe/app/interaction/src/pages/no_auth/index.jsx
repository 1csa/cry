import React from 'react';
import { Card } from 'antd';

export default () => {
  return (
    <div className="main-content-with-page-header">
      <Card bordered={false} style={{ minHeight: 280 }}>
        没有相应工具子权限，请申请相关权限
      </Card>
    </div>
  );
};
