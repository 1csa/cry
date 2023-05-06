import React, { useEffect } from 'react';
import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';
import appConfig from '@/config/app/app.config';
import request from '@/utils/request'

import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

const { layout } = appConfig;

const LayoutComponent: React.FC = props => {
  return (
    <ConfigProvider locale={zh_CN}>
      <Authority>
        {layout.hasSidebar ? (
          <SidebarLayout theme={layout.theme}>{props.children}</SidebarLayout>
        ) : (
          <BasicLayout theme={layout.theme}>{props.children}</BasicLayout>
        )}
      </Authority>
    </ConfigProvider>
  )
};

export default LayoutComponent;
