import React from 'react';
import { Button, Drawer } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { DrawerProps } from 'antd/es/drawer';

interface YScreen {
  label?: string;
  content: React.ReactNode;
  showDrawer: boolean;
  onShowDrawer: () => void;
  onCloseDrawer: () => void;
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  drawerProps?: Omit<DrawerProps, 'onClose' | 'visible'>;
}

const YScreen: React.FC<YScreen> = (
  { label = '筛选', content, showDrawer, onShowDrawer, onCloseDrawer, buttonProps, drawerProps }
) => {
  return (
    <>
      <Button size="small" onClick={onShowDrawer} {...buttonProps}>
        {label}
      </Button>
      <Drawer closable={false} width={550} visible={showDrawer} onClose={onCloseDrawer} {...drawerProps}>
        {content}
      </Drawer>
    </>
  );
};


export default React.memo(YScreen);
