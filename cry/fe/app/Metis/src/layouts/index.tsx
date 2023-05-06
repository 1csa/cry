import React, {useState , useEffect} from 'react';
import Authority from '@/components/Authority';
import BasicLayout from './BasicLayout';
import SidebarLayout from './SidebarLayout';
import appConfig from '@/config/app.config';

import handleStatisticsRequest from 'scan-statistics';

const { layout } = appConfig;

const LayoutComponent: React.FC = props => (
  useEffect(() => {
    let obj = {
      email: '',
      userName: '',
      browserUrl: location.href,
      env: '',
      platform: 'metis',
    };
    const isProd = location.host.indexOf('http://zeus.v.yidian-inc.com') > -1 ? true : false;
    if (isProd) {
      obj['env'] = 'prod';
    } else {
      obj['env'] = 'dev';
    }
    const userName = localStorage.userName
    const email = localStorage.user

    obj['userName'] = userName;
    obj['email'] = email;
    if (location.host.indexOf('localhost') < 0) {
      // 本地开发  不用发送请求
      handleStatisticsRequest(obj, 'http://10.126.155.163:1151/scanStatic/addScanInfo');
    }
  }, [location.href]),
  <Authority>
    {layout.hasSidebar ? (
      <SidebarLayout theme={layout.theme}>{props.children}</SidebarLayout>
    ) : (
      <BasicLayout theme={layout.theme}>{props.children}</BasicLayout>
    )}
  </Authority>
);

export default LayoutComponent;
