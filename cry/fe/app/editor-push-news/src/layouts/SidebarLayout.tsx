import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'dva';

import { AuthProvider } from '@/hooks';
import { getCurrentRoute } from '@/utils';

import { LayoutProps } from '@/config/app/app.d';
import appConfig from '@/config/app/app.config';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import { editorauthSelector, toolauthSelector } from '@/selectors/account';

const defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;
const defaultOpenKeys = [defaultSelectedKeys[0]];

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ theme, children }) => {
  const dispatch = useDispatch();
  const editor_authes = useSelector(editorauthSelector);
  const tool_authes = useSelector(toolauthSelector);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSider = () => {
    setCollapsed(col => !col);
  };

  useEffect(() => {
    // 获取推送的权限
    dispatch({
      type: 'accountEnum/getAccountAuth',
      payload: {},
    });

    // // 获取工具的权限及工具信息
    // dispatch({
    //   type: 'accountEnum/getToolAuth',
    //   payload: {},
    // });

    // 获取收藏的常用分类
    // dispatch({
    //   type: 'accountEnum/getAccountCates',
    //   payload: {},
    // });
    dispatch({
      type: 'accountEnum/getAccountInfo',
      payload: {},
    });
  }, []);

  return (
    <AuthProvider value={{ editor_authes, tool_authes }}>
      <Layout className="sidebar-layout" style={{ marginLeft: collapsed ? '80px' : '220px' }}>
        <GlobalSider defaultOpenKeys={[]} defaultSelectedKeys={defaultSelectedKeys} theme={theme} collapsed={collapsed} />
        <Layout className="sidebar-layout-main">
          <GlobalHeader collapsed={collapsed} toggleSider={toggleSider} />
          <Layout.Content className="sidebar-layout-main-content">{children}</Layout.Content>
          <GlobalFooter />
        </Layout>
      </Layout>
    </AuthProvider>
  );
};

export default SidebarLayout;
