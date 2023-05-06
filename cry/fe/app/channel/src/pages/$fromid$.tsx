import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch, Callback, ConnectState } from '@/models/connect';
import { authSelectors, siderSelectors, topNewsSelectors } from '@/selectors';
import { authDispatches, siderDispatches, topNewsDispatches } from '@/dispatches';
import { RecProps } from '@/config/topNews';
import Sider from '@/components/Sider';
import TopList from '@/components/TopList';
import Preview from '@/components/Preview';
import RecList from '@/components/RecList';
import { FavsProps } from '@/config/sider';
import { message } from 'antd';
import { hasAuth } from '@/utils/dev_helper';

import './index.less';
interface IndexProps {
  auth: Array<number>;
  favs: Array<FavsProps>;
  categoryList: Array<string>;
  getChannelAuthByUserid: (data?: any, success?: Callback, fail?: Callback) => void;
  getFavsByUserid: (data?: any, success?: Callback, fail?: Callback) => void;
  getChannelProps: (data: string, success?: Callback, fail?: Callback) => void;
  getTopNewsByFromid: (data: string, success?: Callback, fail?: Callback) => void;
  getRecNewsByFromid: (params: RecProps, success?: Callback, fail?: Callback) => void;
  getCategoryList: (data?: string, success?: Callback, fail?: Callback) => void;
}

const Index: React.FC<IndexProps> = ({
  auth,
  favs,
  categoryList,
  getChannelAuthByUserid,
  getFavsByUserid,
  getChannelProps,
  getTopNewsByFromid,
  getCategoryList,
  getRecNewsByFromid,
}) => {
  const { fromid } = useParams<{ fromid: string }>();

  useEffect(() => {
    if (!auth || !auth.length) {
      getChannelAuthByUserid();
    }
    if (!favs || !favs.length) {
      getFavsByUserid();
    }
    // if (fromid === 'homepage' && !categoryList.length) {
    //   getCategoryList()
    // }
    getCategoryList();
  }, []);

  useEffect(() => {
    console.log('test20210816')
    if (auth.length > 0) {
      if (!hasAuth(auth, fromid)) {
        message.warning('您暂无权限访问此频道内容！');
        setTimeout(() => {
          window.location.href = `http://${window.location.host}/app/channel/`;
        }, 1000);
        // router.push('/');
        return;
      }
    }
  }, [auth]);

  useEffect(() => {
    if (fromid) {
      getChannelProps(fromid);
      getTopNewsByFromid(fromid);
      getRecNewsByFromid({ fromid });
    }
  }, [fromid]);

  return (
    <>
      <div className="main-content">
        {/* 频道 */}
        <Sider />
        {/* 推荐内容源 */}
        <RecList />
        {/* 置顶列表 */}
        <TopList />
        {/* 文章详情 */}
        <Preview />
      </div>
    </>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  auth: authSelectors.auth(state),
  favs: siderSelectors.favs(state),
  categoryList: topNewsSelectors.categoryList(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getChannelAuthByUserid: authDispatches.getChannelAuthByUserid(dispatch),
  getFavsByUserid: siderDispatches.getFavsByUserid(dispatch),
  getChannelProps: topNewsDispatches.getChannelProps(dispatch),
  getTopNewsByFromid: topNewsDispatches.getTopNewsByFromid(dispatch),
  getRecNewsByFromid: topNewsDispatches.getRecNewsByFromid(dispatch),
  getCategoryList: topNewsDispatches.getCategoryList(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
