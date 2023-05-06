import React from 'react';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import Authority from '@/components/Authority';
import appConfig from '@/config/app.config';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';

const { layout } = appConfig;

const LayoutComponent: React.FC = props => (
  <ConfigProvider locale={zhCN}>
    <Authority>
      {layout.hasSidebar ? (
        <SidebarLayout theme={layout.theme}>{props.children}</SidebarLayout>
      ) : (
        <BasicLayout theme={layout.theme}>{props.children}</BasicLayout>
      )}
    </Authority>
  </ConfigProvider>
);

export default LayoutComponent;
