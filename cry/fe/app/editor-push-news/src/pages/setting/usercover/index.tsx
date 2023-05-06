import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { Form, Input, Select, DatePicker } from 'formik-antd';
import { Formik } from 'formik';
import { Button, Card, Table, Tooltip, Divider, Popconfirm, message, Modal, Descriptions } from 'antd';
import { Dispatch, UserModelState } from '@/models/connect';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { UserSetProps, SearchFormProps, EmailListProps } from '@/config/userset/userset';
import { PaginationProps } from 'antd/lib/pagination';
import * as UsersetService from '@/services/usersetService';
import * as Utils from '@/utils/utils';

import 'antd/dist/antd.css';
import "./index.less";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const DescriptionsItem = Descriptions.Item;

interface UserSetListProps {
  dispatch: Dispatch;
  user: UserModelState;
}

interface SearchParamProps {
  userSetIdOrName: string;
  authorEmails: Array<string>;
  startTimeStamp: number | undefined;
  endTimeStamp: number | undefined;
}

const formItemLayout = {
  labelCol: { sm: { span: 2 } },
  wrapperCol: { sm: { span: 6 } },
};

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 6, offset: 2 } },
};

const detailMap = {
  gender: '性别',
  age: '年龄',
  lbsProfile: '地域选择',
  lbsTier: '城市级别',
  lbsBlock: '敏感区域',
  sct: '兴趣标签(图文)',
  vsct: '兴趣标签(视频)',
};

const UserSetList: React.FC<UserSetListProps> = ({ dispatch, user }) => {
  // email list data
  const [emailList, setEmailList] = useState<EmailListProps[]>([]);
  // table loading
  const [loading, setLoading] = useState<boolean>(false);
  // table data
  const [userSetList, setUserSetList] = useState<UserSetProps[]>([]);
  const [userSetListTotal, setUserSetListTotal] = useState<number>(0);
  // page
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 10,
    total: userSetListTotal,
    current: 1,
  });
  // detail modal visible
  const [visible, setVisible] = useState<boolean>(false);
  // current detail
  const [currentDetail, setCurrentDetail] = useState<UserSetProps>({});

  // did mount
  useEffect(() => {
    getAuthorEmailList();
    getUserSetList();
  }, []);

  // columns
  const columns = [
    {
      title: '群组Id',
      key: 'index',
      width: 75,
      dataIndex: 'userSetId',
      align: 'center',
    },
    {
      title: '群组名',
      dataIndex: 'userSetAliasName',
      key: 'userSetAliasName',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 100,
      render: (text: any, render: any) => {
        return (
          <Tooltip placement="top" title={render.author}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '用户量级',
      dataIndex: 'userEstimateFull',
      key: 'userEstimateFull',
      width: 150,
      render: (text: any) => {
        return text ? Utils.formatNumberRgx(text) : '计算中';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (text: any) => {
        return Utils.transferDate(text);
      },
    },
    {
      title: '更新时间',
      dataIndex: 'userEstimateUpdateTimeFull',
      key: 'userEstimateUpdateTimeFull',
      width: 150,
      render: (text: any) => {
        return Utils.transferDate(text);
      },
    },
    {
      title: '操作',
      key: 'operate',
      width: 150,
      render: (text: any, record: any) => {
        return (
          <span>
            <a onClick={() => handleGetDetail(record)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除 ${record.userSetAliasName} 群组吗?`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDelete(record.userSetId)}
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

  // click search
  const handleSearch = (values: SearchFormProps): void => {
    const { userSetIdOrName, authorEmails, timeStamp } = values;
    let searchObj = {
      userSetIdOrName,
      authorEmails,
      startTimeStamp: timeStamp.length ? Utils.tranferDateTime(timeStamp[0], false) : undefined,
      endTimeStamp: timeStamp.length ? Utils.tranferDateTime(timeStamp[1], true) : undefined,
    };
    getUserSetList(searchObj);
  };

  // delete
  const handleDelete = async (userSetId: number) => {
    const { header } = await UsersetService.deleteUserset({ id: userSetId });
    if (header.code === 0) {
      message.success('删除成功!');
      getUserSetList();
    } else {
      message.error(`删除失败,${header.message}!`);
    }
  };

  // get email options
  const getAuthorEmailList = async () => {
    const { header, data } = await UsersetService.getEmailList();
    if (header.code === 0) {
      setEmailList(data);
    } else {
      message.error('获取创建人下拉列表失败!');
    }
  };

  // search request
  const getUserSetList = async (values?: SearchParamProps) => {
    setLoading(true);
    // console.log(values)
    const { header, data } = await UsersetService.getUsersetList(values);
    if (header.code === 0) {
      setUserSetList(data);
      setUserSetListTotal(data.length);
      setLoading(false);
    } else {
      setLoading(false);
      message.error('搜索失败!');
    }
  };

  const handleGetDetail = (record: UserSetProps): void => {
    setVisible(true);
    setCurrentDetail(record);
  };

  return (
    <div className="usercover">
      <PageHeader currentMenu="圈定人群管理" currentSubMenu="列表" />
      <Card className="usercover-content">
        <Formik initialValues={{ userSetIdOrName: '', authorEmails: [], timeStamp: [] }} onSubmit={values => handleSearch(values)}>
          {() => (
            <Form {...formItemLayout}>
              <FormItem name="userSetIdOrName" label="用户群组">
                <Input name="userSetIdOrName" placeholder="请输入群组ID或群组名" />
              </FormItem>
              <FormItem name="authorEmails" label="创建人">
                <Select name="authorEmails" mode="multiple" placeholder="请输入创建人姓名或邮箱" optionFilterProp={'children'}>
                  {emailList.map(item => {
                    return <Option key={item.email}>{item.emailNickName + '(' + item.email + ')'}</Option>;
                  })}
                </Select>
              </FormItem>
              <FormItem name="timeStamp" label="创建时间">
                <RangePicker
                  name="timeStamp"
                  ranges={{
                    今天: [moment(), moment()],
                    最近3天: [moment().subtract(3, 'days'), moment()],
                    最近7天: [moment().subtract(7, 'days'), moment()],
                    最近15天: [moment().subtract(15, 'days'), moment()],
                    最近30天: [moment().subtract(30, 'days'), moment()],
                  }}
                />
              </FormItem>
              <FormItem {...tailFormItemLayout} name="operate">
                <Button type="primary" icon="search" htmlType="submit">
                  搜索
                </Button>
                <Button style={{ marginLeft: '20px' }} type="primary" icon="plus" onClick={() => router.push('/setting/usercover/add')}>
                  新增
                </Button>
                {/* <Link to="/setting/userset/add">
                  </Link> */}
              </FormItem>
            </Form>
          )}
        </Formik>
        <Table
          columns={columns}
          dataSource={userSetList}
          rowKey={(render: UserSetProps) => render.userSetId + ''}
          bordered
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      <Modal title="群组详情" visible={visible} width={1000} footer={null} onCancel={() => setVisible(false)}>
        <Descriptions column={2}>
          <DescriptionsItem label="群组 id">{currentDetail.userSetId}</DescriptionsItem>
          <DescriptionsItem label="用户量级">{Utils.formatNumberRgx(currentDetail.userEstimateFull)}</DescriptionsItem>
          <DescriptionsItem label="群组名(英文)">{currentDetail.userSetName}</DescriptionsItem>
          <DescriptionsItem label="群组名(中文)">{currentDetail.userSetAliasName}</DescriptionsItem>
          <DescriptionsItem label="创建人">{currentDetail.author}</DescriptionsItem>
          <DescriptionsItem label="创建时间">{Utils.transferDate(currentDetail.createTime)}</DescriptionsItem>
          <DescriptionsItem label="更新时间">{Utils.transferDate(currentDetail.userEstimateUpdateTimeFull)}</DescriptionsItem>
        </Descriptions>
        <Divider orientation="left">圈选规则</Divider>
        <Descriptions column={2}>
          {Array.isArray(currentDetail.dimensions) &&
            currentDetail.dimensions.map((item: any) => {
              if (item.properties && item.properties.threshold) {
                return (
                  <DescriptionsItem key={item.key} label={detailMap[item.key] || item.key}>
                    {item.interests.join('、') + '（阈值：' + item.properties.threshold.split('/')[2] + '）'}
                  </DescriptionsItem>
                );
              } else {
                return (
                  <DescriptionsItem key={item.key} label={detailMap[item.key] || item.key}>
                    {item.interests.join('、')}
                  </DescriptionsItem>
                );
              }
            })}
        </Descriptions>
      </Modal>
    </div>
  );
};

export default connect()(UserSetList);
