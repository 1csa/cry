import React, { useState, useCallback, ReactNode } from 'react';
import { TopItemProps, DataObjProps, RecItemProps } from '@/config/topNews';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { formatNumber } from '@/utils/dev_helper';
import { Row, Tooltip } from 'antd';
import './index.less';

interface IProps {
  doc: TopItemProps | RecItemProps;
}

const DocData = (props: IProps) => {
  // 数据展开收起
  const [showDataMore, setShowDataMore] = useState<boolean>(false);
  const { doc } = props;

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
        key: 'ClickRate',
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
        key: 'AddCommentRate',
        name: '评论率',
        tooltip: '(评论/点击数)',
        value: Math.floor((100000 * (data.AddComment || 0)) / (data.ClickDoc || 1)) / 10 + '%',
      },
      {
        key: 'ShareDoc',
        name: '分享',
        tooltip: '',
        value: formatNumber(data.ShareDoc) || 0,
      },
      {
        key: 'ShareRate',
        name: '分享率',
        tooltip: '(分享/点击数)',
        value: Math.floor((100000 * (data.ShareDoc || 0)) / (data.ClickDoc || 1)) / 10 + '%',
      },
      {
        key: 'Like',
        name: '收藏',
        tooltip: '',
        value: formatNumber(data.Like) || 0,
      },
      {
        key: 'CollectRate',
        name: '收藏率',
        tooltip: '(收藏/点击数)',
        value: Math.floor((100000 * (data.Like || 0)) / (data.ClickDoc || 1)) / 10 + '%',
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
      // {
      //   key: 'Duration',
      //   name: '视频本身时长',
      //   tooltip: '',
      //   value: data.Duration + '秒'
      // }
    ];
  }, []);
  const renderDocData = (data: DataObjProps): ReactNode =>
    createDataMap(data)
      .slice(0, 4)
      .map((item: any) =>
        item.tooltip ? (
          <Tooltip key={item.key} placement="top" title={item.tooltip} style={{ marginRight: 8 }}>
            <span style={{ marginLeft: 8 }}>{`${item.name}: ${item.value}`}</span>
          </Tooltip>
        ) : (
          <span style={{ marginLeft: 8 }} key={item.key}>{`${item.name}: ${item.value}`}</span>
        ),
      );
  const renderDocDataMore = (data: DataObjProps): ReactNode =>
    createDataMap(data)
      .slice(4)
      .map((item: any) =>
        item.tooltip ? (
          <Tooltip key={item.key} placement="top" title={item.tooltip} style={{ marginRight: 8 }}>
            <span style={{ marginLeft: 8 }}>{`${item.name}: ${item.value}`}</span>
          </Tooltip>
        ) : (
          <span key={item.key} style={{ marginLeft: 8 }}>{`${item.name}: ${item.value}`}</span>
        ),
      );

  return (
    <div className="top-item-data">
      {doc.data && (
        <Row style={{ marginBottom: 8 }} align="middle">
          <div>数据统计周期为近7日数据（含今日）</div>
          <div
            className="showBtn"
            onClick={() => {
              setShowDataMore(!showDataMore);
            }}
          >
            {showDataMore ? '收起' : '展开'}数据
            {showDataMore ? (
              <UpOutlined style={{ marginLeft: 5 }} />
            ) : (
              <DownOutlined style={{ marginLeft: 5 }} />
            )}
          </div>
        </Row>
      )}
      {doc.data && doc.data.app_all && (
        <Row style={{ marginBottom: 8 }}>
          <Tooltip placement="top" title="客户端内文章表现数据">
            [app 整体]
          </Tooltip>
          {renderDocData(doc.data.app_all as DataObjProps)}
        </Row>
      )}
      {doc.data && doc.data.all && (
        <Row style={{ marginBottom: 8 }}>
          <Tooltip
            placement="top"
            title="包括客户端、大B（四大浏览器：华为、小米、OPPO、VIVO）、小B(其他小流量浏览器及合作方）的数据"
          >
            [所有分发]
          </Tooltip>
          {renderDocData(doc.data.all as DataObjProps)}
        </Row>
      )}
      {doc.data && doc.data.app_channel && (
        <Row style={{ marginBottom: 8 }}>
          <Tooltip placement="top" title="客户端中当前频道内文章的表现数据">
            [app 频道内]
          </Tooltip>
          {renderDocData(doc.data.app_channel as DataObjProps)}
        </Row>
      )}
      {showDataMore && (
        <>
          {doc.data && doc.data.app_all && (
            <Row style={{ marginBottom: 8 }}>
              <Tooltip placement="top" title="客户端内文章表现数据">
                [app 整体]
              </Tooltip>
              {renderDocDataMore(doc.data.app_all as DataObjProps)}
            </Row>
          )}
          {doc.data && doc.data.all && (
            <Row style={{ marginBottom: 8 }}>
              <Tooltip
                placement="top"
                title="包括客户端、大B（四大浏览器：华为、小米、OPPO、VIVO）、小B(其他小流量浏览器及合作方）的数据"
              >
                [所有分发]
              </Tooltip>
              {renderDocDataMore(doc.data.all as DataObjProps)}
            </Row>
          )}
          {doc.data && doc.data.app_channel && (
            <Row style={{ marginBottom: 8 }}>
              <Tooltip placement="top" title="客户端中当前频道内文章的表现数据">
                [app 频道内]
              </Tooltip>
              {renderDocDataMore(doc.data.app_channel as DataObjProps)}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default DocData;