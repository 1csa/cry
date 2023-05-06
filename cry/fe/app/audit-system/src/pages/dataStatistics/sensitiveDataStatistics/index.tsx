import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

import { Card, message, Button } from 'antd';

import CustomizeTable from '@/components/Smart/BasicTable/CustomizeTable';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';

import initFormSchema from './viewModel/formModel';
import { columns } from './viewModel/tableColumn';

import { fetchSharkJobId, fetchSharkProgress, fetchSharkResult } from '@/services/dataStatistics';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';

import { formateTime, DATE_FORMAT_DD } from '@/utils/dev_helper';
import appConfig from '@/config/app.config';

interface queryIdAndTaskId {
  queryId: string;
  taskId: string;
}

const Sensitive = () => {
  const basicFormRef = useRef<IHandler>(null);

  // 进度
  const progressRef = useRef<number>(0);

  /**
   * 针对页面初始化formModel 需要在初始化的时候将ref转发到initFormSchema中
   * 再由initFormSchema传给业务表单组件 调用其onReset方法
   * @param value
   * @returns
   */
  const getFormModel = (value: any) => {
    return initFormSchema(value, basicFormRef?.current);
  };

  const [formModel, setFormModel] = useState<any[]>(getFormModel([102])); // 初始化form表单

  /**
   * 选择时间之后处理
   * @param date 开始和结束时间
   * @returns
   */
  const transDate = (date: number | string) => formateTime(typeof date === 'number' ? Math.floor(date) : moment(date).valueOf(), DATE_FORMAT_DD);

  const [loading, setLoading] = useState<boolean>(false);
  const [downloadDisabled, setDownloadDisabled] = useState<boolean>(true);

  // form 提交
  const handleBasicFormSearch = (value: any) => {
    const { word, partitionId, ...options } = value;
    if (!Object.values(options).every(e => e)) {
      message.warning('查询参数不完整！');
      return false;
    }
    const { material_type, ...params } = value;
    params.startDate = transDate(params.startDate);
    params.endDate = transDate(params.endDate);
    queryQueryIdTaskId(params);
  };

  // 获取 queryId & taskId
  const [queryTaskId, setQueryTaskID] = useState<queryIdAndTaskId>({
    queryId: '',
    taskId: '',
  });

  // 获取 taskId queryId
  const queryQueryIdTaskId = async (params: any) => {
    // 状态重置
    progressRef.current = 0;
    setDownloadDisabled(true);
    setLoading(true);
    const { errorno, data } = await requestAsyncRes(() => fetchSharkJobId(params));
    if (errorno === 0) {
      setQueryTaskID(data as queryIdAndTaskId);
    } else {
      setLoading(false);
    }
  };

  // 获取 查询进度 0 - 100 %
  const queryProgress = async () => {
    const { errorno, data = 0 } = await requestAsyncRes(() => fetchSharkProgress(queryTaskId));
    if (errorno === 0) {
      const progress = typeof data === 'number' ? data : 0;
      progressRef.current = progress;
    } else {
      setLoading(false);
    }
  };

  // 定时器 查询进度
  useEffect(() => {
    let timer: any = 0;
    const { queryId = '', taskId = '' } = queryTaskId;
    if (queryId && taskId) {
      timer = setInterval(() => {
        if (progressRef.current >= 100) {
          query();
          clearInterval(timer);
          return;
        }
        queryProgress();
      }, 1000);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [JSON.stringify(queryTaskId)]);

  const [tableList, setTableList] = useState<any[]>([]);
  // 获取列表数据  前提 拿到 queryId taskId & 任务进度 100 %
  const query = async () => {
    const { queryId = '' } = queryTaskId;
    const { errorno, data } = await requestAsyncRes(() => fetchSharkResult({ queryId }));
    setLoading(false);
    if (errorno === 0) {
      setTableList(data as []);
      setDownloadDisabled(false);
    }
  };

  const handleCascaderItem = (value: number[]) => {
    if (value.length) {
      basicFormRef?.current?.onReset();
      setFormModel(getFormModel(value));
    }
  };

  // 导出...
  const handleExport = () => {
    const { queryId = '', taskId = '' } = queryTaskId;
    const time = moment().format('YYYYMMDD_HHmmss');
    const name = `敏感词_${time}`;
    const url = `${appConfig.MANUAL_AUDIT_URL}/shark/query/down?queryId=${queryId}&taskId=${taskId}&name=${name}`;
    console.log(url);
    window.open(url, '_blank');
  };

  return (
    <div className="data-statistics main-content">
      <Card>
        <BasicForm
          onSearch={handleBasicFormSearch}
          handleCascader={handleCascaderItem}
          formDataModel={formModel}
          ref={basicFormRef}
          layout="inline"
          initialValues={{
            insertTime: [moment().subtract(31, 'days'), moment().subtract(0, 'days')],
          }}
          loading={loading}
        />
      </Card>

      <Card>
        <Button className="mb20" type="primary" onClick={handleExport} disabled={downloadDisabled}>
          导出
        </Button>
        <CustomizeTable columns={columns} data={tableList} rowKey="id" pagination={{}} loading={loading} />
      </Card>
    </div>
  );
};

export default Sensitive;
