import React from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';
import appConfig from '@/config/app.config';

const { layout } = appConfig;

const LayoutComponent: React.FC = props => (
  <Authority>
    <ConfigProvider locale={zh_CN}>
      {layout.hasSidebar ? (
        <SidebarLayout theme={layout.theme}>{props.children}</SidebarLayout>
      ) : (
        <BasicLayout theme={layout.theme}>{props.children}</BasicLayout>
      )}
    </ConfigProvider>
  </Authority>
);

export default LayoutComponent;
