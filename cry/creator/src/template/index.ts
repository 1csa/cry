const combination = (name: string) => {
  const interfaceName = `I${name}`;
  return `
import React from 'react';
import './index.less';
import { Card } from 'antd';

interface ${interfaceName} {}

const ${name}: React.FC<${interfaceName}> = () => {
  return (
    <div className="main-content">
      <Card bordered={false} className="index-card">
        新页面
      </Card>
    </div>
  );
};

export default ${name};
  `;
};
export default combination;
