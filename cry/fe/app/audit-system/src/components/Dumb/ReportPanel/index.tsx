import React from 'react';
import { Collapse } from 'antd';

import { formateTime } from '@/utils/dev_helper';
import CustomizeTable from '../../Smart/BasicTable/CustomizeTable';

const { Panel } = Collapse;

type TypeItem = {
  key: string;
  count: number;
};

interface IReportPanelData {
  reportType: Array<TypeItem>;
  dataSource: Array<any>;
}

const styleSheet = {
  display: 'flex',
  justifyContent: 'space-between',
};

const columns = [
  {
    title: '用户ID',
    dataIndex: 'userid',
    key: 'userid',
  },
  {
    title: '用户昵称',
    dataIndex: 'usernick',
    key: 'usernick',
  },
  {
    title: '用户反馈内容',
    dataIndex: 'fbcat',
    key: 'fbcat',
    render: (fbcat: Array<string>) => {
      return <span>{fbcat.join(',')}</span>;
    },
  },
  {
    title: '详情描述',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '反馈时间',
    dataIndex: 'stamp',
    key: 'stamp',
    render: (stamp: number) => {
      return <span>{formateTime(stamp)}</span>;
    },
  },
];

/**
 * 用户举报类型组件，参数举报类型以及对应的数量对象数组
 */
const ReportPanel: React.FC<IReportPanelData> = ({ reportType, dataSource }) => {
  const renderHeaderText = () => {
    let header: string = '';
    let newArr: Array<string> = Array.isArray(reportType) ? [...new Set(reportType.map(ele => ele.key))] : [];
    // 拼接数据字符串
    newArr.forEach((item: string, index: number) => {
      header = `${header}${item} ${index !== newArr.length - 1 ? '，' : ''}`;
    });
    return (
      <div style={styleSheet}>
        <span>{`用户举报类型：${header}`}</span>
      </div>
    );
  };

  return (
    <Collapse style={{ marginBottom: 20 }}>
      <Panel header={renderHeaderText()} key="1">
        <CustomizeTable columns={columns} data={dataSource} pagination={{}} rowKey="userid" />
      </Panel>
    </Collapse>
  );
};

export default ReportPanel;
