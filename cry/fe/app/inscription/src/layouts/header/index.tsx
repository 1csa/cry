import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, Avatar, Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/es/switch';

import { ConnectState, UserModelState } from '@/types/connect';
import { DEBUG_MODE_DEV, DEBUG_MODE_PROD } from '@/types/app';
import { appConfig } from '@/config/app.config';
import { useModeContext } from '@/hooks';
import { YIcon } from '@/components';

import './index.less';

const MenuItem = Menu.Item;

interface HeaderProps extends UserModelState {
  collapsed: boolean;
  toggleSider: () => void;
}

const Header: React.FC<HeaderProps> = ({ email, username, collapsed, toggleSider }) => {
  const { onModeChange } = useModeContext();
  const [isDev, setIsdev] = useState<boolean>();

  const menu = (
    <Menu className="action-menu-dropdown">
      <MenuItem>
        <YIcon type="mail" />
        <span>{email}</span>
      </MenuItem>
      <Menu.Divider />
      <MenuItem>
        <YIcon type="rollback" />
        <a href="/">返回 Pandora 工具平台</a>
      </MenuItem>
    </Menu>
  );

  const handleModeChange: SwitchChangeEventHandler = checked => {
    setIsdev(checked);
    onModeChange(checked ? DEBUG_MODE_PROD : DEBUG_MODE_DEV);
  };

  useEffect(() => {
    setIsdev( REAL_ENV === DEBUG_MODE_PROD);
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <YIcon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={toggleSider} />
      </div>

      <div className="header-right">
        <Switch
          checked={isDev}
          checkedChildren="切换到开发版"
          unCheckedChildren="切换到正式版"
          onChange={handleModeChange}
        />
        <a href={appConfig.helpDoc}>关于Inscription</a>
        <Dropdown className="header-right-avatar" overlay={menu}>
          <span>
            <Avatar size="small" src="//s.go2yd.com/a/thead_meiguoduizhang.png" />
            <span>{username}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  ...user,
}))(Header);
