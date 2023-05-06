import React, { useState, useEffect, ReactNode, createRef, useRef } from 'react';
import { Button, Card, Table, Typography, message, Modal, Tag, Row, Col, Result, Icon } from 'antd';
import * as userpackageService from '@/services/userpackageService';
import { UserTagProps, DocListProps, SearchFormProps } from '@/config/userpackage/userpackage';
import { defaultSearch, defaultUserTag } from '@/config/userpackage/userpackage.config';
import Countdown, { zeroPad } from 'react-countdown';
import { getCookieByName } from '@/utils/utils';
import TaskForm from './taskForm';
import DocViewDialog from '@/components/DocViewDialog';

import './index.less';

const { Text } = Typography;

type DocModelValue = {
  visible: boolean;
  docId: string;
};
type docIdsType = string[];
interface CheckableTagProps {
  docIdsList: docIdsType;
  docId: string;
  checked?: boolean;
  changecallback: (val: docIdsType) => void;
}

const CheckableTag: React.FC<CheckableTagProps> = props => {
  const { docIdsList, docId, changecallback, checked: checked1, ...otherProps } = props;
  console.log('🚀 ~ file: index.tsx ~ line 29 ~ checked1', checked1);
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    checked1 ? setChecked(true) : setChecked(false);
  }, []);
  const handleChange = (checked: boolean) => {
    setChecked(checked);
    const doclist = docIdsList;
    let currentDocId = docId;
    if (checked) {
      doclist.push(currentDocId);
    } else {
      doclist.splice(
        doclist.findIndex((item: string) => item === currentDocId),
        1,
      );
    }
    changecallback && changecallback(doclist);
  };
  return (
    <Tag.CheckableTag {...otherProps} checked={checked} onChange={handleChange}>
      {checked ? '已选' : '选择'}
    </Tag.CheckableTag>
  );
};

const UserPackage: React.FC = () => {
  // 任务领取页
  const [defaultPage, setDefaultPage] = useState<boolean>(true);
  // loading
  const [loading, setLoading] = useState<boolean>(false);
  // taskSearch
  const [taskSearch, setTaskSearch] = useState<SearchFormProps>(defaultSearch);
  // 已选用户包
  const [userTagSelected, setUserTagSelected] = useState<UserTagProps>(defaultUserTag);
  // 领取列表
  const [docList, setDocList] = useState<Array<DocListProps>>([]);
  // 任务id
  const [taskId, setTaskId] = useState<string>('');
  // 今日已添加
  const [todayIncre, setTodayIncre] = useState<number>(0);
  // 选中的任务
  const [docIdsList, setDocIdsList] = useState<Array<string>>([]);
  // submit modal visible
  const [visible, setVisible] = useState<boolean>(false);
  // 任务中
  const [tasking, setTasking] = useState<boolean>(false);
  // 倒计时时间戳
  const [countDownTime, setCountDownTime] = useState<number>(60 * 60 * 1000);
  // 文章预览弹窗
  const [docModelValue, setDocModelValue] = useState<DocModelValue>({ visible: false, docId: '' });
  //查询form实例子
  const taskFormRef = useRef<any>();

  useEffect(() => {
    handleQueryTagTaskHistory();
  }, []);

  const columns = [
    {
      title: 'docid',
      dataIndex: 'docId',
      key: 'docId',
      width: 180,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: '30%',
      render: (text: string, record: DocListProps) => (
        <a
          onClick={() => {
            setDocModelValue({
              visible: true,
              docId: record.docId,
            });
          }}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '点击次数',
      dataIndex: 'click',
      key: 'click',
    },
    {
      title: '大类',
      dataIndex: 'primaryLabelName',
      key: 'primaryLabelName',
    },
    {
      title: '小类',
      dataIndex: 'subLabelName',
      key: 'subLabelName',
    },
    {
      title: 'source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '操作',
      key: 'operate',
      width: 140,
      render: (text: any, record: DocListProps): ReactNode => {
        return (
          <CheckableTag
            docIdsList={docIdsList}
            docId={record.docId}
            checked={record.checked}
            changecallback={(val: string[]) => {
              setDocIdsList(val);
              window.localStorage.setItem('docIdsList', val.join());
            }}
          />
        );
      },
    },
  ];

  // 查询历史任务
  const handleQueryTagTaskHistory = async () => {
    const { code, data, msg } = await userpackageService.queryTagTaskHistory();
    if (code === 0 && data) {
      const { taskInfo, docList = [] } = data;
      const value = {
        primaryLabel: taskInfo.primaryLabelName,
        subLabel: taskInfo.subLabelName,
        userTagCode: taskInfo.userTagCode,
      };
      taskFormRef.current.setFormValue(value);
      setTaskSearch(Object.assign(taskSearch, value));
      // 已选数据回显
      const historyDocIdsList = window.localStorage.getItem('docIdsList')?.split(',') || [];
      docList.map((item: DocListProps) => {
        historyDocIdsList.map(i => {
          i == item.docId && (item.checked = true);
        });
      });
      setDocList(docList);
      setDocIdsList(historyDocIdsList);
      setTaskId(taskInfo.taskId);
      setTasking(true);
      setCountDownTime(taskInfo.expirationTime);
      setDefaultPage(false);
    }
  };

  // 查询并设置form参数
  const handleSearchTask = async (values: SearchFormProps) => {
    setTaskSearch(Object.assign(taskSearch, values));
    handleFetchTask(values);
  };
  // 领取任务
  const handleFetchTask = async (values: SearchFormProps) => {
    setLoading(true);
    setDefaultPage(false);
    const { code, data, msg } = await userpackageService.queryTagDocList(values);
    setLoading(false);
    if (code === 0) {
      if (data.docList.length) {
        setDocList(data.docList);
        setTaskId(data.taskId);
        setTasking(true);
      } else {
        message.warning('当前条件下没有任务');
      }
    } else if (code === 103) {
      message.error('无任务，请重新领取');
    } else {
      message.error('任务领取失败:' + msg);
    }
  };

  // 提交前二次确认
  const handleFetchBeforeSubmit = async () => {
    const { code, data, msg } = await userpackageService.queryTagSubmit({ taskId: taskId });
    if (code === 0) {
      setTodayIncre(data.todayIncre);
      setVisible(true);
    } else {
      message.error(msg);
    }
  };

  // 提交
  const handleSubmit = async () => {
    const params = { taskId: taskId, docIds: docIdsList.join() };
    const { code, data, msg } = await userpackageService.tagnNotarize(params);
    if (code === 0) {
      taskFormRef.current.handleFetchUserTagList();
      Modal.confirm({
        title: '提交成功',
        okText: '返回主页',
        cancelText: '继续领取',
        icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
        okButtonProps: {
          type: 'default',
        },
        cancelButtonProps: {
          type: 'primary',
        },
        onOk() {
          initData();
          resetForm();
        },
        // 继续领取
        onCancel() {
          initData();
          handleFetchTask(taskSearch);
          taskFormRef.current.selectUserTagChange(taskSearch.userTagCode);
        },
      });
      setVisible(false);
    } else {
      message.error(msg);
    }
  };

  // 释放
  const handleReleaseTask = async () => {
    const { code, data, msg } = await userpackageService.releaseTask(taskId);
    if (code === 0) {
      // message.success(msg);
    } else {
      message.error(msg);
    }
  };
  // 倒计时
  type time = {
    hours: number;
    minutes: number;
    seconds: number;
  };
  const renderer = ({ hours, minutes, seconds }: time) => {
    return (
      <Text type="danger">
        {zeroPad(hours)}时{zeroPad(minutes)}分{zeroPad(seconds)}秒
      </Text>
    );
  };

  // 取消
  const handleCancelTask = () => {
    Modal.confirm({
      title: '取消提醒',
      content: '如果取消任务，会导致当前任务进度失效，需要重新领取，请确认！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        handleReleaseTask();
        initData();
        resetForm();
      },
      onCancel() {},
    });
  };

  const handleOvertimeAlert = () => {
    Modal.error({
      title: '过期提醒',
      content: '由于未能在规定时间内提交，你的任务已经过期，请重新领取',
      onOk() {
        handleReleaseTask();
        initData();
        resetForm();
      },
    });
  };

  const initData = () => {
    setTasking(false);
    setDocList([]);
    setDocIdsList([]);
    window.localStorage.removeItem('docIdsList');
  };

  const resetForm = () => {
    taskFormRef.current.onReset();
    setDefaultPage(true);
  };

  return (
    <div className="userpackage">
      <Card className="userpackage-search">
        <TaskForm
          wrappedComponentRef={taskFormRef}
          userTagSelected={userTagSelected}
          tasking={tasking}
          onUserTagChange={value => setUserTagSelected(value)}
          onSubmit={values => handleSearchTask(values)}
        />
      </Card>
      <div className="userpackage-content">
        {defaultPage ? (
          <Result icon={<Icon type="smile" theme="twoTone" twoToneColor="#b9b9b9" />} title="请领取任务!" className="result-info" />
        ) : (
          <Table
            columns={columns}
            dataSource={docList}
            rowKey={(render: DocListProps) => render.docId}
            bordered
            pagination={false}
            loading={loading}
            scroll={{ y: '100%' }}
          />
        )}
      </div>
      {tasking && (
        <div className="userpackage-footer">
          <Row type="flex" justify="end" align="middle" className="footer-fixed">
            <Col style={{ textAlign: 'right', marginRight: '10px' }}>
              你需要在
              <Countdown date={Date.now() + countDownTime} renderer={renderer} onComplete={() => handleOvertimeAlert()} />
              内提交
            </Col>
            <Col>共{docList.length}条</Col>
            <Col>
              <Button onClick={() => handleCancelTask()}>取消</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => handleFetchBeforeSubmit()}>
                提交
              </Button>
            </Col>
          </Row>
        </div>
      )}
      <Modal title="提交确认" visible={visible} onOk={handleSubmit} onCancel={() => setVisible(false)}>
        <p>
          新增目标用户包: <Text type="danger">{userTagSelected?.userTagName}</Text>
        </p>
        <p>此用户包今天已添加条数： {todayIncre}条</p>
        <p>本次新增条数： {docIdsList.length}条</p>
        {/* <p>{docIdsList.join()}</p> */}
      </Modal>
      <DocViewDialog {...docModelValue} onClose={() => setDocModelValue({ visible: false, docId: '' })} />
    </div>
  );
};

export default UserPackage;
