import React, { ReactNode, useCallback } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Tabs, Tooltip, Row, Button } from 'antd';
import { DataObjProps, TopItemProps, RecItemProps } from '@/config/topNews';
import { topNewsSelectors } from '@/selectors';
import { formatNumber } from '@/utils/dev_helper';

import './index.less';

const { TabPane } = Tabs;

interface PreviewProps {
  doc: TopItemProps | RecItemProps;
}

const Preview: React.FC<PreviewProps> = ({ doc }) => {
  // create data map
  const createDataMap = useCallback((data: DataObjProps) => {
    return [
      {
        key: 'ViewDoc',
        name: '分发',
        tooltip: '(后端曝光,包括浏览器-3屏)',
        value: formatNumber(data.ViewDoc) || 0,
      },
      {
        key: 'RViewDoc',
        name: '实际曝光',
        tooltip: '(前端曝光)',
        value: formatNumber(data.RViewDoc) || 0,
      },
      {
        key: 'ClickDoc',
        name: '点击',
        tooltip: '',
        value: formatNumber(data.ClickDoc) || 0,
      },
      {
        key: '',
        name: '点击率',
        tooltip: '(点击/实际曝光)',
        value: Math.floor((1000 * (data.ClickDoc || 0)) / (data.RViewDoc || 1)) / 10 + '%',
      },
      {
        key: 'AddComment',
        name: '评论',
        tooltip: '',
        value: formatNumber(data.AddComment) || 0,
      },
      {
        key: '',
        name: '评论率',
        tooltip: '(评论/点击数)',
        value: Math.floor((100000 * (data.AddComment || 0)) / (data.ClickDoc || 1)) / 10 + '‱',
      },
      {
        key: 'ShareDoc',
        name: '分享',
        tooltip: '',
        value: formatNumber(data.ShareDoc) || 0,
      },
      {
        key: '',
        name: '分享率',
        tooltip: '(分享/点击数)',
        value: Math.floor((100000 * (data.ShareDoc || 0)) / (data.ClickDoc || 1)) / 10 + '‱',
      },
      {
        key: 'Like',
        name: '收藏',
        tooltip: '',
        value: formatNumber(data.Like) || 0,
      },
      {
        key: '',
        name: '收藏率',
        tooltip: '(收藏/点击数)',
        value: Math.floor((100000 * (data.Like || 0)) / (data.ClickDoc || 1)) / 10 + '‱',
      },
      {
        key: 'ThumbUp',
        name: '点赞',
        tooltip: '',
        value: formatNumber(data.ThumbUp) || 0,
      },
      {
        key: 'AvgDwell',
        name: '次均时长',
        tooltip: '(正文页停留总时长/点击数)',
        value: Math.round(data.AvgDwell) || 0 + '秒',
      },
      {
        key: 'Cntdwell',
        name: '停留次数',
        tooltip: '',
        value: formatNumber(data.Cntdwell) || 0,
      },
      {
        key: 'AvgCntdwell',
        name: '次均停留时长',
        tooltip: '(正文页停留总时长/停留次数)',
        value: Math.round(data.AvgCntdwell) || 0 + '秒',
      },
      {
        key: 'Duration',
        name: '视频本身时长',
        tooltip: '',
        value: data.Duration + '秒',
      },
    ];
  }, []);

  // render doc data
  const renderDocData = (data: DataObjProps): ReactNode =>
    createDataMap(data).map((item: any) =>
      item.tooltip ? (
        <Tooltip key={item.key} placement="top" title={item.tooltip}>
          <span>{`${item.name}: ${item.value}`}</span>
        </Tooltip>
      ) : (
        <span key={item.key}>{`${item.name}: ${item.value | 0}`}</span>
      ),
    );

  return (
    <div className="main-preview">
      <div className="iframeshow">
        <iframe
          title="doc preview iframe"
          id="ifr-article"
          allowFullScreen={true}
          // src={doc.docid ? `http://www.yidianzixun.com/article/${doc.docid}?s=vivobrowser&appid=vivobrowser` : ''}
          // src={doc.docid ? `http://www.yidianzixun.com/article/${doc.docid}?s=pandora` : ''}
          src={doc.docid ? `http://pandora.yidian-inc.com/article/${doc.docid}` : ''}
          // src={doc.docid ? `http://pandora.yidian-inc.com/article/${doc.docid}?hl=1` : ''}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  doc: topNewsSelectors.currentTopItem(state),
});

export default connect(mapStateToProps, null)(Preview);
