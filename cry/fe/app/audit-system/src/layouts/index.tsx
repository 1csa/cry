import React, { useEffect } from 'react';
import { useDispatch } from 'dva';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';

import appConfig from '@/config/app.config';

const { layout } = appConfig;

interface LayoutComponentProps {
  children: React.ReactChildren;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'commonLogic/fetchGlobalAdminMenu',
      payload: {
        isEmpty: true,
      },
    });
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <Authority>
        {layout.hasSidebar ? (
          <SidebarLayout theme={layout.theme}>{children}</SidebarLayout>
        ) : (
          <BasicLayout theme={layout.theme}>{children}</BasicLayout>
        )}
      </Authority>
    </ConfigProvider>
  );
};

export default LayoutComponent;
