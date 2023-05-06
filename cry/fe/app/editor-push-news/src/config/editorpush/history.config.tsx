import * as React from 'react';
import { ColumnProps } from 'antd/es/table';
import { Tag } from 'antd';

import { hot_level_map, business_map, platform_map } from '@/data';
import { PushHistoryItem, HistoryFormScreen } from './history';
import { pushStateObj } from './push.config';

export const PushHistoryColumn: (catelist: Record<string, string>) => ColumnProps<PushHistoryItem>[] = catelist => {
  return [
    {
      title: '文章ID/标题/摘要',
      dataIndex: 'pushContent',
      width: 180,
      render: (_, { head, news, doc_id }) => (
        <>
          <h3>{doc_id}</h3>
          <p className="ant-table-cell" title={head}>
            <a href={`http://www.yidianzixun.com/article/${(doc_id.trim())}`} target="_blank">
              {head}
            </a>
          </p>
          <p className="ant-table-cell" title={news}>
            {news}
          </p>
        </>
      ),
    },
    // {
    //   title: '文章ID',
    //   dataIndex: 'doc_id',
    //   width: 100,
    // },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 102,
    },
    // {
    //   title: '推送ID(老|新)',
    //   dataIndex: 'push_id',
    //   width: 138,
    //   render: (_, { push_id, new_push_id }) => (
    //     <>
    //       <p>老：{push_id || '---'}</p>
    //       <p>新：{new_push_id || '---'}</p>
    //     </>
    //   ),
    // },
    {
      title: '推送类别及热点级别',
      dataIndex: 'typeAndCate',
      width: 160,
      render: (_, { type, hot_level }) => (
        <>
          <p>{type}</p>
          <p>{hot_level ? hot_level_map[hot_level] : '--'} </p>
        </>
      ),
    },
    {
      title: '分类',
      dataIndex: 'cate',
      width: 80,
      render: text => catelist[text],
    },
    {
      title: '圈选标签',
      dataIndex: 'channel',
      render: text => (
        <>
          {Array.isArray(text) &&
            text.map(tag => (
              <div>
                <Tag color="blue" key={tag} style={{ margin: '0 4px 4px 0' }}>
                  {tag}
                </Tag>
              </div>
            ))}
        </>
      ),
    },
    {
      title: '排除标签',
      dataIndex: 'exclude_channel',
      render: text => (
        <>
          {Array.isArray(text) &&
            text.map(tag => (
              <div>
                <Tag color="red" key={tag} style={{ margin: '0 4px 4px 0' }}>
                  {tag}
                </Tag>
              </div>
            ))}
        </>
      ),
    },
    {
      title: '交集标签',
      dataIndex: 'inter_channel',
      render: text => (
        <>
          {Array.isArray(text) &&
            text.map(tag => (
              <div>
                <Tag color="blue" key={tag} style={{ margin: '0 4px 4px 0' }}>
                  {tag}
                </Tag>
              </div>
            ))}
        </>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
    },
    {
      title: '高优',
      dataIndex: 'xm_priority',
      width: 52,
      // render: text => (text === 1 ? '是' : text === 0 ? '否' : '--'),
      render: (record, dataObj: any) => {
        const { oppo_pay = '', xm_priority = '' } = dataObj
        if (oppo_pay === 1 && xm_priority === 0) {
          return <span>oppo</span>
        } else if (oppo_pay === 0 && xm_priority === 1) {
          return <span>小米</span>
        } else if (oppo_pay === 1 && xm_priority === 1) {
          return <div>oppo <br></br> 小米</div>
        } else {
          return <span>否</span>
        }
      },
    },
    {
      title: '推送数据',
      dataIndex: 'push_stat',
      render: (record, dataObj) => {
        const useSortKey = dataObj['useSortKey'] || ''
        if (record) {
          // let arrKey = Object.keys(record);
          let arrKey = ["click_uv", "click_pv", "real_click_rate", "arrive_uv", "arrive_pv", "view_uv", "view_pv", "real_convert_rate"]
          return <>
            {arrKey.length &&
              arrKey.map(tag => (
                <div>
                  <Tag color={tag === useSortKey ?  'red' : 'blue'}  key={tag} style={{ margin: '0 4px 4px 0', }}>
                    {
                      pushStateObj[tag]}:
                      {['click_rate', 'convert_rate', 'real_click_rate', 'real_convert_rate'].includes(tag) ? (parseInt(record[tag] * 1000000 + '') / 10000) + '%' : parseInt(record[tag]) }
                  </Tag>
                </div>
              ))}
          </>
        } else {
          return ''
        }
      },
    },
  ];
};

export const InitialFormScreen: HistoryFormScreen = {};
