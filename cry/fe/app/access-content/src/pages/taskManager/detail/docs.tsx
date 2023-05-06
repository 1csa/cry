import React, { useEffect, useState } from 'react';
import { PageHeader, Table, Spin, message } from 'antd';
import {USE_STATUS_CN, PAGE_SIZE, PAGE} from '@/config/constant';
import {Link} from 'react-router-dom';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
interface DocsProps {
  location: any,
  dispatch: Dispatch,
}
const Docs: React.FC<DocsProps> = ({location, dispatch}) => {
  const id = location.query.id; // 子任务id
  const status = location.query.status; // 子任务状态
  const params = {count: PAGE_SIZE, page: PAGE, task_id: id};
  useEffect(()=>{
    requestDocs();
  },[id]);
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<any[]>();
  const [total, setTotal] = useState<number>(0);
  const requestDocs = async (page?: any) => {
    setLoading(true);
    if(!!page){
      params['page'] = page;
    }
    let {code, data, total} = await dispatch({
      type: 'TaskList/fecthDocs',
      payload: params
    });
    if(code === 0){
      setTotal(total);
      setDocs([...data]);
    }else {
      message.info(`docs获取失败, 请稍后重试`);
    }
    setLoading(false);
  }
  const onPageChange = (page: any) => {
    requestDocs(page);
  }
  const columns: Array<any> = [{
    title: 'docid',
    dataIndex: 'docid',
    key: 'docid'
  },{
    title: '本站连接',
    dataIndex: 'link',
    key: 'link',
    render: (text: string, record: any) => {
      return <span>{`https://www.yidianzixun.com/article/${record['docid']}`}</span>
    }
  },{
    title: '操作',
    dataIndex: 'Action',
    key: 'Action',
    render: (text: string, record: any) => {
      return <a href={`http://pandora.yidian-inc.com/tools/newseditor?id=${record['docid']}`} target="_blank">编辑</a>
    }
  }];
  const pagination = {
    defaultCurrent: PAGE,
    pageSize: PAGE_SIZE,
    onChange: onPageChange,
    total: total,
    current: PAGE
  };
  return <div className="main-content">
    <PageHeader title={`子任务id: ${id}, 状态: ${USE_STATUS_CN[status] || '未知状态'}`}/>
    <Spin spinning={loading}>
      <Table
        columns={columns}
        style={{marginTop: 10}}
        pagination={pagination}
        dataSource={docs}
        rowKey={record => record.docid}
        scroll={{ x: 800 }}
      />
    </Spin>

  </div>
}

export default connect()(Docs);
