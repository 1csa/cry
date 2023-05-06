import React, { useState, useEffect, ReactNode } from 'react';
import PageHeader from '@/components/PageHeader';
import { Form, Input, Select } from 'formik-antd';
import { Formik } from 'formik';
import { Button, Card, Table, Divider, Popconfirm, message, Modal, Tag } from 'antd';
import { SearchFormProps, AccountProps, AccountFormProps, Partial } from '@/config/account/account';
import { PaginationProps } from 'antd/lib/pagination';
import { connect } from 'dva';
import { Dispatch, ConnectState, AccountModelState, AuthModelState } from '@/models/connect';
import * as Utils from '@/utils/utils';
import * as Validate from '@/validation/account';
import * as AccountService from '@/services/accountService';
import { Auth_Account_Manager } from '@/config/account/account.config';

import 'antd/dist/antd.css';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
// axios.defaults.withCredentials = true

const formItemLayout = {
  labelCol: { sm: { span: 2 } },
  wrapperCol: { sm: { span: 6 } },
};

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 6, offset: 2 } },
};

interface AccountEnumProps {
  dispatch: Dispatch;
  account: AccountModelState;
  auth: AuthModelState;
}

const permissionEnumMap: Record<string, string> = {
  all: '全量个性化',
  all_break: '全量突发',
  auto: '局部个性化',
  auto_break: '局部突发',
  userid: '用户-ID',
  appids: 'APP-ID',
};

const AccountList: React.FC<AccountEnumProps> = ({ dispatch, account, auth }) => {
  // loading
  const [loading, setLoading] = useState<boolean>(false);
  // account data
  const [accountList, setAccountList] = useState<Array<AccountProps>>([]);
  const [accountListTotal, setAccountListTotal] = useState<number>(0);
  // page
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 10,
    total: accountListTotal,
    current: 1,
  });
  // add or edit
  const [isAdd, setIsAdd] = useState<boolean>(true);
  // account modal visible
  const [visible, setVisible] = useState<boolean>(false);
  // current account
  const [currentAccount, setCurrentAccount] = useState<Partial<AccountProps>>({});

  const { accountEnum } = account;

  useEffect(() => {
    handleSearch();
    if (!Object.keys(accountEnum).length) {
      dispatch({ type: 'accountEnum/getAccountEnum' });
    }
  }, []);

  useEffect(() => {
    let userAuths = auth?.currentAuth?.childAuths || [];
    if (userAuths && userAuths.length > 0 && !userAuths.includes(Auth_Account_Manager)) {
      location.href = `${location.origin}/app/editor-push-news/`;
    }
  }, [auth]);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (text: any, record: any, index: number): number => {
        return (pagination.current! - 1) * pagination.pageSize! + index + 1;
      },
    },
    {
      title: '账号',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '推送权限',
      dataIndex: 'switch',
      key: 'switch',
      render: (text: string) => {
        return <Tag color={text === 'open' ? 'green' : 'red'}>{text === 'open' ? '可推送' : '不可推送'}</Tag>;
      },
    },
    {
      title: '推送类别权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (text: string[]) =>
        text
          .filter(item => Object.keys(permissionEnumMap).includes(item))
          .map(item => {
            return <Tag key={item}>{permissionEnumMap[item]}</Tag>;
          }),
    },
    {
      title: '修改人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '修改时间',
      dataIndex: 'last_update_time',
      key: 'last_update_time',
    },
    {
      title: '操作',
      key: 'operate',
      render: (text: any, record: AccountProps): ReactNode => {
        return (
          <span>
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除 ${record.user_name} 账号吗?`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDelete(record.user_email)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  // change pagination
  const handleTableChange = (pagination: PaginationProps): void => {
    setPagination(pagination);
  };

  // search user_name
  const handleSearch = async (values: SearchFormProps = {}) => {
    setLoading(true);
    const { status, result, reason } = await AccountService.getEditorList(values.user_name);
    if (status === 'success') {
      setAccountList(result.editor_info);
      setAccountListTotal(result.count);
      setLoading(false);
    } else {
      setLoading(false);
      message.error('获取账号失败' + reason);
    }
  };

  // add
  const handleAdd = (): void => {
    setVisible(true);
    setIsAdd(true);
  };

  // edit
  const handleEdit = (record: AccountProps): void => {
    setVisible(true);
    setCurrentAccount(record);
    setIsAdd(false);
  };

  // delete
  const handleDelete = async (user_email: string) => {
    const { status } = await AccountService.removeEditor(user_email);
    if (status === 'success') {
      message.success('删除账号成功!');
      handleSearch();
    } else {
      message.error('删除账号失败!');
    }
  };

  // init form
  const initForm = (): AccountFormProps => {
    // console.log('init form', isAdd);
    return isAdd ? { user_email: '', switch: 'close', permission: [] } : (currentAccount as AccountProps);
  };

  // save
  const save = async (values: AccountFormProps) => {
    if (isAdd) {
      const { status, reason } = await AccountService.createEditor(values.user_email, values.permission, values.switch);
      if (status === 'success') {
        message.success('新增账号成功!');
        setVisible(false);
        handleSearch();
      } else {
        message.error(`新增账号失败: ${reason}!`);
      }
    } else {
      const { status, reason } = await AccountService.updateEditor(values.user_email, values.permission, values.switch);
      if (status === 'success') {
        message.success('更新账号成功!');
        setVisible(false);
        handleSearch();
      } else {
        message.error(`更新账号失败: ${reason}!`);
      }
    }
  };

  const renderPermissionOptions = (): ReactNode => {
    return accountEnum.permissionEnum
      .filter((item: any) => Object.keys(permissionEnumMap).includes(item.value))
      .map((item: any) => {
        return (
          <Option key={item.value} value={item.value}>
            {permissionEnumMap[item.label]}
          </Option>
        );
      });
  };

  return (
    <div className="account">
      <PageHeader currentMenu="账号管理" currentSubMenu="列表" />
      <Card className="account-content">
        <Formik initialValues={{ user_name: '' }} onSubmit={values => handleSearch(values)}>
          {() => (
            <Form {...formItemLayout}>
              <FormItem name="user_name" label="账号">
                <Input name="user_name" placeholder="请输入要查询的账号" />
              </FormItem>
              <FormItem {...tailFormItemLayout} name="operate">
                <Button type="primary" icon="search" htmlType="submit">
                  搜索
                </Button>
                <Button style={{ marginLeft: '20px' }} type="primary" icon="plus" onClick={handleAdd}>
                  新增
                </Button>
              </FormItem>
            </Form>
          )}
        </Formik>
        <Table
          columns={columns}
          dataSource={accountList}
          rowKey={(render: AccountProps) => render.user_name}
          bordered
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      <Modal title={isAdd ? '新增账号' : '编辑账号'} visible={visible} width={1000} footer={null} onCancel={() => setVisible(false)}>
        <Formik initialValues={initForm()} onSubmit={values => save(values)} enableReinitialize={true}>
          {({ handleReset }) => (
            <Form {...formItemLayout}>
              <FormItem name="user_email" label="账号邮箱" validate={Validate.validateUserEmail}>
                <Input name="user_email" style={{ width: '100%' }} placeholder="请输入邮箱" disabled={!isAdd} />
              </FormItem>
              <FormItem name="switch" label="推送权限" validate={Validate.validatePushAuth}>
                <Select name="switch" placeholder="请选择推送权限" style={{ width: '100%' }}>
                  <Option value="close">不可推送</Option>
                  <Option value="open">可推送</Option>
                </Select>
              </FormItem>
              <FormItem name="permission" label="推送类别" validate={Validate.validatePermission}>
                <Select name="permission" mode="multiple" placeholder="请选择推送类别" style={{ width: '100%' }}>
                  {renderPermissionOptions()}
                </Select>
              </FormItem>
              <FormItem {...tailFormItemLayout} name="operate">
                <Button type="primary" icon="save" htmlType="submit">
                  保存
                </Button>
                <Button type="primary" icon="rollback" style={{ marginLeft: '20px' }} onClick={handleReset}>
                  重置
                </Button>
              </FormItem>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default connect((state: ConnectState) => {
  return { account: state.accountEnum, auth: state.auth };
})(AccountList);
