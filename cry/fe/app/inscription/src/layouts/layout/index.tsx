import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

import AppHeader from '../header';
import AppSider from '../sider';

import { appConfig } from '@/config/app.config';
import { ModeProvider } from '@/hooks';
import './index.less';

export interface MainMenu {
  name: string;
  key: string;
  icon?: string;
  subMenu?: MainMenu[];
}

export interface LayoutProps {
  hasSidebar?: boolean;
  theme?: 'dark' | 'light';
  menus?: MainMenu[];
}

const { Header, Sider, Footer, Content } = Layout;

interface AppLogoProps {
  logo: string;
  name: string;
  collapsed?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ logo, name, collapsed = false }) => (
  <Link className="layout-left-logo" to="/">
    <img src={logo} alt="logo" />
    {collapsed ? null : <span>{name}</span>}
  </Link>
);

interface AppLayout {
  authes: string[];
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayout> = ({ children }) => {
  const { appName, logo } = appConfig;
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(col => !col);
  };

  return (
    <Layout className="layout">
      <Sider className="layout-left" collapsed={collapsed} width={180}>
        <AppLogo logo={logo} name={appName} collapsed={collapsed} />
        <AppSider />
      </Sider>
      <ModeProvider>
        <Layout className="layout-right">
          <Header className="layout-header">
            <AppHeader collapsed={collapsed} toggleSider={handleToggle} />
          </Header>
          <Content className="layout-content">{children}</Content>
          <Footer className="layout-footer">{`运营中台工具组 ${new Date().getFullYear()} @ 一点资讯`}</Footer>
        </Layout>
      </ModeProvider>
    </Layout>
  );
};

export default memo(AppLayout);
