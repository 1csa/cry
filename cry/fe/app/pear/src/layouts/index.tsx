import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';

import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';
import appConfig from '@/config/app.config';

moment.locale('zh-cn');

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
