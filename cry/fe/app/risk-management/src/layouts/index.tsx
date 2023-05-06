import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';

import handleStatisticsRequest from 'scan-statistics';

import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';
import appConfig from '@/config/app.config';
import zhCN from 'antd/es/locale/zh_CN';

const { layout } = appConfig;

const LayoutComponent: React.FC = props => {
  useEffect(()=>{
    handleScanStatistic(window.location.pathname)
  }, [window.location.pathname])

  const handleScanStatistic = (path: string) => {
    let obj = {
      email: '',
      userName: '',
      browserUrl: path,
      env: '',
      platform: 'risk',
    };
    const isProd = location.host.indexOf('zeus.v.yidian-inc.com/') > -1 ? true : false;
    if (isProd) {
      obj['env'] = 'prod';
    } else {
      obj['env'] = 'dev';
    }
    let userName = ''
    let email = ''
    let cookieArr = document.cookie.split(';')
    cookieArr.forEach(item => {
      let subArr = item.split('=')
      if (subArr[0].trim() === 'nickname') userName = decodeURI(subArr[1])
      if (subArr[0].trim() === 'badger_email') email = subArr[1]
    })
    obj['userName'] = userName;
    obj['email'] = email;
    handleStatisticsRequest(obj, 'http://10.126.155.163:1151/scanStatic/addScanInfo');
  }
  return (
    <Authority>
        <ConfigProvider locale={zhCN}>
          {layout.hasSidebar ? (
            <SidebarLayout theme={layout.theme}>{props.children}</SidebarLayout>
          ) : (
            <BasicLayout theme={layout.theme}>{props.children}</BasicLayout>
          )}
        </ConfigProvider>
    </Authority>
  );
}

export default LayoutComponent;
