import React, { useEffect } from 'react';
import { Layout, Icon, Dropdown, Menu, Avatar, Tooltip, Switch, message } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import appConfig from '@/config/app.config';
import { getIsDev } from '@/utils/get_dev';
import './index.less';

const { Header } = Layout;
const MenuItem = Menu.Item;
const isDev: boolean = getIsDev();

interface GlobalHeaderProps {
  collapsed: boolean;
  toggleSider: () => void;
  user: UserModelState;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = props => {
  const { currentUser = {} } = props.user;
  useEffect(() => {
    userNameToLocal()
  }, [])

  const userNameToLocal = () => {
    localStorage.setItem('userName', currentUser.name)
  }

  const menu = (
    <Menu className="action-menu-dropdown">
      <MenuItem>
        <Icon type="mail" />
        {currentUser.email}
      </MenuItem>
      <Menu.Divider />
      <MenuItem>
        <Icon type="rollback" />
        <a href="/">返回 Pandora 工具平台</a>
      </MenuItem>
    </Menu>
  );

  const changeIsDev = () => {
    if (isDev) {
      message.warning({
        content: '切换到线上环境后操作请谨慎',
        duration: 1,
        onClose() {
          localStorage.setItem("isDev", String(!isDev));
          window.location.reload();
        }
      })
    } else {
      localStorage.setItem("isDev", String(!isDev));
      window.location.reload();
    }
  };

  return (
    <Header className="global-header">
      <div className="action-left-menus">
        <Icon
          className="sider-trigger"
          type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={props.toggleSider}
        />
        <a href="http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=74271583" target="_black">使用说明</a>
      </div>
      <div className="action-menus">
        测试环境：<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={isDev} onChange={changeIsDev} />
        <Dropdown className="action-menu" overlay={menu}>
          <span>
            <Avatar
              size="small"
              src={currentUser.avatar || '//s.go2yd.com/a/thead_meiguoduizhang.png'}
            />
            <span>{currentUser.name}</span>
          </span>
        </Dropdown>
        {appConfig.helpDoc ? (
          <Tooltip placement="bottom" title="使用文档">
            <a className="action-menu" href={appConfig.helpDoc} target="__blank">
              <Icon type="question-circle" />
            </a>
          </Tooltip>
        ) : null}
      </div>
    </Header>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(GlobalHeader);
