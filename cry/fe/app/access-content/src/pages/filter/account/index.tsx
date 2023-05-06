import React, { useState, useEffect } from 'react';
import {
  Card,
  Divider,
  Table,
  Button,
  Modal,
  Input,
  Row,
  Col
} from 'antd';

// import './index.less';
interface AccountProps {}
interface AccountModelProps {
  visible: boolean,
  onCancel: () => void
}
const Account: React.FC<AccountProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const columns = [{
    title: '账号',
    dataIndex: 'name',
    key: 'name',
  },{
    title: '添加时间',
    dataIndex: 'age',
    key: 'age',
  },{
    title: '添加人员',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '操作',
    dataIndex: 'Action',
    key: 'Action',
    render: (text, record)=> {
      return <a>删除</a>
    }
  }];
  return (
    <>
      <div className="main-content">
        <Divider orientation="left">通用过滤条件</Divider>
        <div>
          <Button type="primary" onClick={()=>setVisible(true)}>新增</Button>
        </div>
        <Table columns={columns}/>
        <AccountModel visible={visible} onCancel={()=>setVisible(false)}/>
      </div>
    </>
  );
}

const AccountModel: React.FC<AccountModelProps> = ({
  visible,
  onCancel
}) => {
  const [account, setAccount] = useState<string>('');
  const onSaveAccount = () => {
    console.log(account, '=====');
  }
  const onAccountChange = (e) => {
    const account = e.target.value
    setAccount(account);
  }
  return (
    <Modal
      title="新增账号"
      visible={visible}
      onCancel={() => onCancel()}
      cancelText="取消"
      okText="保存"
      onOk={onSaveAccount}
    >
      <Row>
        <Col span={3}>账号: </Col>
        <Col span={21}>
          <Input
            onChange={onAccountChange}
            value={account}
            placeholder="多个账号请用英文逗号分隔"
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default Account;
