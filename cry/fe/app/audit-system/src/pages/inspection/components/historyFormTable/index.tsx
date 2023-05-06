import React, { useEffect, useState } from 'react';

import { Card, message, Space, Typography, Divider, Spin } from 'antd';

import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';
import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import BusinessFormItemCascader from '@/components/Smart/BusinessFormItemCascader';
import CreateDrawer from '../createDrawer';
import Detail from '../detail';

import { ContentType } from '@/data/constants';

import { DATE_FORMAT_SS } from '@/utils/dev_helper';

import { taskHistoryList, taskDetail, releaseTask as releaseTaskAPI } from '@/services/inspection';
import { configResponsive } from 'ahooks';

// 质检任务状态
const status = [
  { label: '等待初始化', value: 'INIT_WAIT', canRelease: 1 },
  { label: '正在初始化中', value: 'INIT_DOING', canRelease: 0 },
  { label: '初始化完成', value: 'INIT_FINISH', canRelease: 1 },
  { label: '初始化错误', value: 'INIT_ERROR', canRelease: 0 },
  { label: '重试', value: 'INIT_RETRY', canRelease: 0 },
  { label: '任务已完成', value: 'TASK_COMPLETE', canRelease: 0 },
  { label: '任务进行中', value: 'TASK_DOING', canRelease: 1 },
  { label: '任务已经释放', value: 'TASK_RELEASED', canRelease: 0 },
];

const contentType = 'inspection';

const formModel: Array<any> = [
  {
    type: 'component',
    renderComponent: React.createElement(BusinessFormItemCascader, {
      material_type: [ContentType[contentType]],
      isSearch: true,
      renderLevel: 2,
      // callback: (value: any, casForm: any) =>
      //   handleCascaderItem && handleCascaderItem(value, casForm),
    }),
  },
  {
    label: '创建时间',
    name: 'insertTime',
    type: 'rangePicker',
    timeKey: ['createStart', 'createEnd'],
    formateTime: DATE_FORMAT_SS,
  },
  {
    label: '任务状态',
    name: 'status',
    sourceData: status,
    type: 'select',
  },
  {
    type: 'component',
    renderComponent: React.createElement(AuditUserSelect, {
      selectProps: {
        label: '被质检人姓名',
        name: 'checkeUserId',
      },
    }),
  },
  {
    label: '任务ID',
    name: 'id',
    type: 'text',
  },
  {
    type: 'component',
    renderComponent: React.createElement(AuditUserSelect, {
      selectProps: {
        label: '质检人姓名',
        name: 'operatorId',
      },
    }),
  },
  {
    label: '查询',
    type: 'button',
    buttonName: '历史查询按钮',
  },
];
interface TaskListProps {
  from?: 'create' | 'list'; // 页面源头 创建-create(缺省值) | 历史-list 会影响接口的分发
}

const TaskList: React.FC<TaskListProps> = ({ from = 'create' }) => {
  const [initFormModel, setInitFormModel] = useState<any>(formModel);

  const createSuccessCallback = () => {
    query({ pageNumber: 1 });
  };

  const formValuesRef = React.useRef({});
  /**
   * 查询按钮获取参数以及执行方法
   * @param values 子组件返回的form字段数据
   */
  const handleBasicFormSearch = (values: any) => {
    // console.log(values);
    formValuesRef.current = values;
    query({ pageNumber: 1 });
  };

  const PAGE_SIZE: number = 20;
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    size: PAGE_SIZE,
    total: 0,
  });

  /**
   * 页码切换方法
   * @param page 页码
   * @param size 当前页数据量
   */
  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    query({ pageNumber: page, pageSize: size });
  };

  // 详情 逻辑
  const [detailVisible, setDetailVisible] = useState(false);
  const toggleDetailVisible = () => {
    setDetailVisible(!detailVisible);
  };

  // 详情数据
  const [detailData, setDetailData] = useState({});
  // 展示详情
  const goDetail = async (taskId: number | string) => {
    const { errorno, data } = await requestAsyncRes(() => taskDetail({ taskId }));
    if (errorno === 0) {
      setDetailData(data);
      toggleDetailVisible();
    }
  };

  const [releaseIndex, setReleaseIndex] = useState<number | ''>('');
  // 释放任务
  const releaseTask = async (event: any) => {
    const { id: taskId, index } = event.target.dataset;
    if (typeof releaseIndex === 'number') {
      // @ts-ignore
      message.warning(`请稍等！正在释放任务ID: ${data[releaseIndex]?.id}`);
      return;
    }
    setReleaseIndex(Number(index));
    const { errorno } = await requestAsyncRes(() => releaseTaskAPI({ taskId }));
    if (errorno === 0) {
      setReleaseIndex('');
      message.success(`任务：${taskId} 释放成功`);
      const { current: pageNumber, size: pageSize } = pagination;
      query({ pageNumber, pageSize });
    }
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // 获取列表数据
  const query = async ({ pageNumber = 1, pageSize = PAGE_SIZE }) => {
    setLoading(true);
    const { errorno, data } = await requestAsyncRes(() => taskHistoryList({ ...formValuesRef.current, pageNumber, pageSize, from }));
    setPagination({
      // @ts-ignore
      current: data?.page ?? 1,
      // @ts-ignore
      size: data?.size ?? 0,
      // @ts-ignore
      total: data?.countAll ?? 0,
    });
    setLoading(false);
    if (errorno === 0) {
      // @ts-ignore
      setData(data?.data as []);
    }
  };

  useEffect(() => {
    query({
      pageNumber: 1,
      pageSize: PAGE_SIZE,
    });
  }, []);

  // columns 映射 列表 | 创建
  const columns = React.useMemo(() => {
    const columnsCreate = [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '所属业务/子业务',
        dataIndex: 'business',
        key: 'business',
        render: (_: any, record: any) => `${record.targetBusinessName} / ${record.targetBusinessUnitName}`,
      },
      {
        title: '抽检源业务/源子业务',
        dataIndex: 'origin',
        key: 'origin',
        render: (_: any, record: any) => `${record.sourceBusinessName} / ${record.sourceBusinessUnitName}`,
      },
      {
        title: '质检时间段',
        dataIndex: 'dateRange',
        key: 'dateRange',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '待审/总量',
        dataIndex: 'amount',
        key: 'amount',
        render: (_: any, record: any) => `${record.taskWaitCount} / ${record.taskTotalCount}`,
      },
      {
        title: '内容明细',
        dataIndex: 'detail',
        key: 'detail',
        width: 200,
      },
      {
        title: '创建人/时间',
        dataIndex: 'taskCreateInformation',
        key: 'taskCreateInformation',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 160,
        render: (_: any, record: any, index: number) => {
          const disabled = !status.find((item: any) => item.value === record.statusCode)?.canRelease ?? true;
          return (
            <Space split={<Divider type="vertical" />}>
              <Typography.Link onClick={() => goDetail(record.id)}>任务详情</Typography.Link>
              <Spin spinning={index === releaseIndex}>
                {/* <Typography.Link type="danger" disabled={disabled} data-taskId={record.id} data-index={index} onClick={() => releaseTask(record.id, index)}> */}
                <Typography.Link type="danger" disabled={disabled} data-id={record.id} data-index={index} onClick={releaseTask}>
                  释放
                </Typography.Link>
              </Spin>
            </Space>
          );
        },
      },
    ];

    const columnsList = [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '所属业务/子业务',
        dataIndex: 'business',
        key: 'business',
        render: (_: any, record: any) => `${record.targetBusinessName} / ${record.targetBusinessUnitName}`,
      },
      {
        title: '质检时间段',
        dataIndex: 'dateRange',
        key: 'dateRange',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '正确率-总体/明细',
        dataIndex: 'ratio',
        key: 'ratio',
        width: 200,
        render(_: any, record: any) {
          return `${record.allQualifiedRate ?? ''} / ${record.detailQualifiedRate ?? ''}`;
        },
      },
      {
        title: '创建人/时间',
        dataIndex: 'taskCreateInformation',
        key: 'taskCreateInformation',
      },
      {
        title: '完成时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
      },
      {
        title: '质检人',
        dataIndex: 'operators',
        key: 'operators',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (_: any, record: any) => {
          return (
            <Space split={<Divider type="vertical" />}>
              <Typography.Link onClick={() => goDetail(record.id)}>任务详情</Typography.Link>
            </Space>
          );
        },
      },
    ];
    const columns = {
      create: columnsCreate,
      list: columnsList,
      default: columnsCreate,
    };

    return columns[from] || columns.default;
  }, [from, releaseIndex]);

  return (
    <>
      {from === 'create' ? <CreateDrawer createSuccessCallback={createSuccessCallback} /> : null}
      {from === 'list' ? (
        <Card bordered={false}>
          <BasicForm
            initialValues={{}}
            layout="inline"
            formDataModel={initFormModel}
            onSearch={value => handleBasicFormSearch(value)}
            loading={loading}
          />
        </Card>
      ) : null}

      <Card bordered={false} className="table-card-wrapper">
        <CustomizeTable columns={columns} data={data} rowKey="id" pagination={pagination} loading={loading} handleChange={handlePageChange} />
      </Card>
      {detailVisible && <Detail toggleVisible={toggleDetailVisible} data={detailData} />}
    </>
  );
};

export default TaskList;
