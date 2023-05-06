import React from 'react';

import { Layout } from 'antd';

import { version } from '../../../package.json';

import './index.less';

const { Footer } = Layout;

const GlobalFooter = () => (
  <Footer className="global-footer">
    {new Date().getFullYear()} @ 一点资讯 V{version}
  </Footer>
);

export default GlobalFooter;
