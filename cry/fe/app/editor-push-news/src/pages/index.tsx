import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, Input, Select, DatePicker, Switch } from 'formik-antd';
import { Card, Button, Table, Divider, Tag, message, Modal } from 'antd';
import { Dispatch, UserModelState } from '@/models/connect';
import { connect } from 'dva';
// import moment from 'moment'
import { ColumnProps } from 'antd/es/table';
import { PushHistoryProps } from '@/config/pushHistory/pushHistory';
import { PaginationProps } from 'antd/lib/pagination';
import PageHeader from '@/components/PageHeader';
import * as Utils from '@/utils/utils';
import * as Validate from '@/validation/push';
import * as PushService from '@/services/pushService';

import './index.less';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface PushHistoryListProps {
  dispatch: Dispatch;
  user: UserModelState;
}

// todo
interface SearchParamProps {
  [propName: string]: any;
}

const formItemLayout = {
  labelCol: { sm: { span: 2 } },
  wrapperCol: { sm: { span: 6 } },
};

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 6, offset: 2 } },
};

const PushHistoryList: React.FC<PushHistoryListProps> = ({ dispatch, user }) => {
  // table loading
  const [loading, setLoading] = useState<boolean>(false);
  // table data
  const [pushHistoryList, setPushHistoryList] = useState<PushHistoryProps[]>([]);
  const [pushHistoryListCount, setPushHistoryListCount] = useState<number>(0);
  // page
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 10,
    total: pushHistoryListCount,
    current: 1,
  });
  // modal visible
  const [visible, setVisible] = useState<boolean>(false);
  // current edit push
  const [currentEditPush, setCurrentEditPush] = useState<PushHistoryProps>();

  const history = useHistory();

  const columns: ColumnProps<PushHistoryProps>[] = [
    {
      title: '#',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text: any, record: any, index: number): number => {
        return (pagination.current! - 1) * pagination.pageSize! + index + 1;
      },
    },
    {
      title: '标题',
      dataIndex: 'head',
      key: 'head',
      width: 200,
      fixed: 'left',
      render: (text: any, record: any) => {
        return (
          <a href={`https://www.yidianzixun.com/article/${record.docid}`} target="_blank">
            {text}
          </a>
        );
      },
    },
    {
      title: '摘要',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: any, record: any) => {
        return (
          <a href={`https://www.yidianzixun.com/article/${record.docid}`} target="_blank">
            {text}
          </a>
        );
      },
    },
    {
      title: '推送类别',
      dataIndex: 'userids',
      key: 'userids',
      width: 130,
    },
    {
      title: 'push_type_name',
      dataIndex: 'push_type_name',
      key: 'push_type_name',
      width: 150,
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: '投放频道',
      dataIndex: 'channel',
      key: 'channel',
      width: 400,
      render: (text: any, record: any) => {
        return text.map((item: any) => {
          return (
            <Tag key={item} color="#108ee9">
              {item}
            </Tag>
          );
        });
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 150,
    },
    {
      title: '操作',
      key: 'operate',
      width: 170,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <span>
            <a onClick={() => handlePause(record.pushID, record.docid)}>暂停</a>
            <Divider type="vertical" />
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => handleContinue(record.pushID, record.docid)}>恢复</a>
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    getHistoryList();
  }, []);

  // get push history
  const getHistoryList = async () => {
    const { status, data, reason } = await PushService.getPushHistory();

    if (status === 'success') {
      setPushHistoryList(data);
      setPushHistoryListCount(data.length);
    }
  };

  // change pagination
  const handleTableChange = (pagination: PaginationProps): void => {
    setPagination(pagination);
  };

  // pause push
  // docid only for save log ...
  // remember change push history list pause = true
  const handlePause = async (pushID: string, docid: string) => {
    const { status, msg } = await PushService.handlePause(pushID);
    if (status === 'success') {
      // todo savelog
      let tempPushHistoryList = pushHistoryList.map((item: any) => {
        if (item.pushID === pushID) {
          item.pause = true;
        }
        return item;
      });
      setPushHistoryList(tempPushHistoryList);

      message.success('暂停成功!');
    } else {
      message.error(`暂停失败 ${msg}!`);
    }
  };

  // continue push
  // remember change push history list pause = false
  const handleContinue = async (pushID: string, docid: string) => {
    const { status, msg } = await PushService.handleContinue(pushID);
    if (status === 'success') {
      // todo savelog
      let tempPushHistoryList = pushHistoryList.map((item: any) => {
        if (item.pushID === pushID) {
          item.pause = false;
        }
        return item;
      });
      setPushHistoryList(tempPushHistoryList);

      message.success('恢复成功!');
    } else {
      message.error(`恢复失败 ${msg}!`);
    }
  };

  // edit push
  const handleEdit = (record: PushHistoryProps): void => {
    setVisible(true);
    setCurrentEditPush(record);
  };

  // save edit push
  const save = async (values: { title: string; summary: string }) => {
    const { pushID = '' } = currentEditPush || {};
    const { status, msg } = await PushService.rename(pushID, values.title, values.summary);
    if (status === 'success') {
      // todo savelog
      let tempPushHistoryList = pushHistoryList.map((item: any) => {
        if (item.pushID === pushID) {
          item.head = values.title;
          item.title = values.summary;
        }
        return item;
      });
      console.log(tempPushHistoryList);
      setPushHistoryList(tempPushHistoryList);

      message.success('更新成功!');
      setVisible(false);
    } else {
      message.error(`更新失败 ${msg}!`);
    }
  };

  return (
    // <>
    //   <PageHeader currentMenu="推送列表" currentSubMenu="列表" />
    //   <Card style={{ margin: '0 20px' }}>
    //     <Button onClick={ () => history.push('/add')}>新增 push</Button>
    //     {/* search form */}
    //     <Formik
    //       initialValues={{ test: '' }}
    //       onSubmit={ (values) => console.log(values) }
    //     >
    //       {
    //         () => (
    //           <Form {...formItemLayout}>
    //             <FormItem name="test" label="test">
    //               <Input
    //                 name="test"
    //                 placeholder="不要点 点了也没反应"
    //               />
    //             </FormItem>
    //             <FormItem {...tailFormItemLayout} name="operate">
    //               <Button type="primary" icon="search" htmlType="submit">搜索</Button>
    //             </FormItem>
    //           </Form>
    //         )
    //       }
    //     </Formik>
    //     {/* <Table
    //       columns={ columns }
    //       dataSource={ pushHistoryList }
    //       rowKey={ (render: PushHistoryProps ) => render.push_id }
    //       bordered
    //       scroll={{ x: '100%' }}
    //       pagination={ pagination }
    //       loading={ loading }
    //       onChange={ handleTableChange }
    //     /> */}
    //   </Card>
    //   <Modal
    //     title="编辑 push"
    //     visible={ visible }
    //     width={ 600 }
    //     footer={ null }
    //     onCancel={ () => setVisible(false) }
    //   >
    //     <Formik
    //       initialValues={{ ignoreTitleLimit: false, title: currentEditPush.head, summary: currentEditPush.title }}
    //       onSubmit={ (values) => save(values) }
    //       enableReinitialize={ true }
    //     >
    //       {
    //         () => (
    //           <Form layout="vertical">
    //             <FormItem name="ignoreTitleLimit" label="去除标题字数限制">
    //               {/* todo */}
    //               <Switch
    //                 name="ignoreTitleLimit"
    //                 checkedChildren="是"
    //                 unCheckedChildren="否"
    //               />
    //             </FormItem>
    //             <FormItem name="title" label="标题" validate={ Validate.validateTitle }  required>
    //               <Input
    //                 name="title"
    //                 placeholder="请输入标题，不超过 18 字"
    //               />
    //             </FormItem>
    //             <FormItem name="summary" label="摘要" validate={ Validate.validateSummary }  required>
    //               <TextArea
    //                 name="summary"
    //                 placeholder="请输入摘要，不超过 62 字"
    //                 autoSize={{ minRows: 3, maxRows: 6 }}
    //               />
    //             </FormItem>
    //             <FormItem name="operate">
    //               <Button type="primary" icon="save" htmlType="submit">保存</Button>
    //             </FormItem>
    //           </Form>
    //         )
    //       }
    //     </Formik>
    //   </Modal>
    // </>
    <Card className="home" bordered={false}>
      <div className="home-welcome">欢迎使用推送管理系统</div>
    </Card>
  );
};

export default connect()(PushHistoryList);
