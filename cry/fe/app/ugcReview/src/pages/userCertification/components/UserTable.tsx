import React, { useState } from 'react';
import { Button, Card, Pagination, Table } from 'antd';
const { Column } = Table;
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import { UserCertificationState } from '../models/index';
interface IUserTable {
  tableData: UserCertificationState;
  dispatch: Dispatch;
  loading: boolean;
  searchData: any;
  handleModify: (i: any) => void;
  handleDelete: (i: any) => void;
}
const UserTable: React.FC<IUserTable> = ({
  tableData,
  dispatch,
  loading,
  handleModify,
  handleDelete,
  searchData,
}) => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  // 点击修改传递当前行数据和修改弹窗标题
  function onModify(record: any) {
    record.userids = record.userid;
    handleModify(record);
  }
  function onDelete(userids: number) {
    let options = { userids, op: 'delete' };
    handleDelete(options);
  }
  // 分页页码改变
  function handlePageChange(page: number) {
    setPageIndex(page);
    window.scrollTo(0, 0);
    dispatch({
      type: 'certification/getUserCert',
      // 合并现有查询的参数
      payload: {
        ...searchData,
        offset: (page - 1) * 50,
        count: 50,
      },
    });
  }
  return (
    <>
      <Table
        dataSource={tableData.result}
        pagination={false}
        bordered
        loading={loading}
        rowKey={record => record.userid}
      >
        <Column title="uid" dataIndex="userid" />
        <Column title="昵称" dataIndex="nickname" />
        <Column title="标签" dataIndex="tag" />
        <Column title="备注" dataIndex="cert_message" />
        <Column title="称号" dataIndex="title" />
        <Column title="来源" dataIndex="source" />
        <Column title="城市" dataIndex="city" />
        <Column title="入驻时间" dataIndex="createAt" />
        <Column title="操作人" dataIndex="operator_name" />
        <Column
          title="操作"
          dataIndex="operate"
          width="80px"
          render={(text, record: any) => (
            <div className="flex-box">
              <Button
                type="primary"
                style={{ marginRight: '20px' }}
                onClick={() => onModify(record)}
              >
                修改
              </Button>
              <Button type="danger" onClick={() => onDelete(record.userid)}>
                删除
              </Button>
            </div>
          )}
        />
      </Table>
      <Card>
        当前页每页{tableData.count}条，一共{tableData.total}条数据
      </Card>
      <Pagination
        current={pageIndex}
        // defaultCurrent={1}
        pageSize={tableData.count}
        total={tableData.total}
        showQuickJumper
        onChange={handlePageChange}
        style={{ marginTop: '10px', textAlign: 'right' }}
      />
    </>
  );
};
// namespace: state
export default connect(({ certification: userCertification, user }: any) => ({
  userCertification,
  user,
}))(UserTable);
