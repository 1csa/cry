import React from 'react';

import { Layout } from 'antd';
// @ts-ignore
import { version } from '../../../package.json';

import './index.less';

const GlobalFooter = () => {
  return (
    <Layout.Footer className="global-footer">
      {new Date().getFullYear()} @ 一点资讯 v{version || '1.0.0'}
    </Layout.Footer>
  );
};

export default GlobalFooter;
