import React from 'react';
import { Card } from 'antd';

export default () => {
  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          黑白名单管理
        </Card> 
      </div>  
    </>
  );
};
