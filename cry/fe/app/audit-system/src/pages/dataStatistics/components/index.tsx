/**
 * 数据统计页面

- 业务统计 businessDataStatistics
- 人工审核统计 manualReviewDataStatistics

两个页面公用components的page页面级组件
 */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

import { Chart, LineAdvance } from 'bizcharts';
import { Button, Card, message } from 'antd';

import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';
import Iconfont from '@/components/Dumb/Iconfont';

import { IPanelStatisProps } from '../businessDataStatistics/viewModel/panelStatistics';
// import initFormSchema from './formModel';
import initFormSchema from './formModel2'; // 不清楚 formModel 在其他地方是否用了，所以不动之前的

import { fetchReceiveTotal, fetchReceiveCount, fetchAuditTotal, fetchAuditorCount } from '@/services/dataStatistics';
import fetchAsyncRes from '@/components/BusinessLogic/fetchAsyncRes';  

import { formateTime, DATE_FORMAT_DD } from '@/utils/dev_helper';
import { exportToCsv } from '@/utils/exportJsonToCSV';

import './index.less';

interface LineTypes {
  dt: string;
  labelName: string;
  count: number;
}

interface IDataStatisticsProps {
  columnsTotal: any;
  columnsPartition: any;
  panelStatistics: IPanelStatisProps[]; // 标识 - 业务数据面板 | 人审数据面板
  theSecondExportBtn?: Boolean;
}

const DataStatistics: React.FC<IDataStatisticsProps> = ({ columnsTotal, columnsPartition, panelStatistics, theSecondExportBtn }) => {
  // 判断是哪个页面调用组件
  // true-业务数据面板 | false-人审数据面板
  const isBusinessData = panelStatistics.length > 0;
  const basicFormRef = useRef<IHandler>(null);
  const scale = {
    count: { min: 0 },
  };
  /**
   * 针对页面初始化formModel 需要在初始化的时候将ref转发到initFormSchema中
   * 再由initFormSchema传给业务表单组件 调用其onReset方法
   * @param value
   * @returns
   */
  const getFormModel = (value: any) => {
    // @ts-ignore
    const formModel = initFormSchema(value, basicFormRef?.current, isBusinessData);
    return !isBusinessData ? formModel : formModel.filter((e, index) => index !== 3);
  };

  const [queryParams, setQueryParams] = useState<object>({}); // 存储查询条件
  const [formModel, setFormModel] = useState<any[]>(getFormModel([102])); // 初始化form表单
  const [lineData, setLineData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<any[]>([]); // 第一个列表
  const [partitionCount, setPartitionCount] = useState<any[]>([]); // 第二个列表
  const [paginationTotal, setPaginationTotal] = useState<IPagination>({ size: 10 }); // 第一个列表的分页
  const [paginationPartition, setPaginationPartition] = useState<IPagination>({ size: 10 }); // 第二个列表的分页
  const [bannerStatisticsCount, setBannerStatisticsCount] = useState<IPanelStatisProps[]>(panelStatistics);

  // 把请求的参数保存起来
  const [useReqParams, setUseReqParams] = useState<Record<string, string>>({});

  /**
   * 选择时间之后处理
   * @param date 开始和结束时间
   * @returns
   */
  const transDate = (date: number | string) => formateTime(typeof date === 'number' ? Math.floor(date) : moment(date).valueOf(), DATE_FORMAT_DD);

  /**
   * 查询方法 设置参数以及调用接口
   * @param value 查询参数
   */
  const handleBasicFormSearch = (value: any) => {
    const { partitionId, auditorId, ...options } = value;
    if (!Object.values(options).every(e => e)) {
      message.warning('查询参数不完整！');
      return false;
    }

    const { material_type, ...params } = value;
    params.startDate = transDate(params.startDate);
    params.endDate = transDate(params.endDate);

    const { businessUnitId, ...others } = params;
    const newParams = isBusinessData
      ? params
      : {
          ...others,
          // businessUnitId: businessUnitId?.join(',') || '',
          businessUnitIds: businessUnitId?.join(',') || '',
        };

    setUseReqParams(Object.assign({}, newParams));
    setQueryParams(newParams);
    requestAllData(newParams);
  };

  const handleCascaderItem = (value: number[]) => {
    if (value.length) {
      basicFormRef?.current?.onReset();
      setFormModel(getFormModel(value));
    }
  };

  /**
   * 从接口里先过滤掉不需要的数据，然后再相加
   * @param data
   */
  const addListCount = (data: any[]) => {
    let countArr: number[] = [];
    const countKey = ['taskCount', 'finishCount', 'allowCount'];
    countKey.forEach(item => {
      countArr.push(data.filter(e => e[item]).reduce((pre, next) => pre + next[item], 0));
    });
    return countArr;
  };

  const initBannerStatisticsCount = (data: any[]) => {
    const totalCount = addListCount(data);
    bannerStatisticsCount.forEach((item: IPanelStatisProps, idx: number) => {
      item.count = totalCount[idx];
      // 审核完成率：审核完成量 / 进审量 * 100%
      if (idx === 3) {
        item.count = totalCount[0] > 0 ? (totalCount[1] / totalCount[0]) * 100 : 0;
      } else if (idx === 4) {
        // 审核通过率：审核通过量 / 审核完成量 * 100%
        item.count = totalCount[1] > 0 ? (totalCount[2] / totalCount[1]) * 100 : 0;
      }
    });
    setBannerStatisticsCount(bannerStatisticsCount);
  };

  const requestAllData = (options: any) => {
    // const { businessUnitId, ...others } = opts;
    // const options = {
    //   ...others,
    //   // businessUnitId: businessUnitId?.join(',') || '',
    //   businessUnitIds: businessUnitId?.join(',') || '',
    // };
    Promise.all([
      // 这里是不加page\size请求图表 全部的数据
      initTotalCount(options, data => {
        initBannerStatisticsCount(data);
        setLineData(initLineData(data));
      }),
      // 这个是加page size请求列表
      initTotalCount({ ...options, pageSize: 10, pageNumber: 1 }, (data, pag) => {
        setTotalCount(data);
        setPaginationTotal(pag!);
      }),
      initPartitionCount({ ...options, pageSize: 10, pageNumber: 1 }, (data, pag) => {
        setPartitionCount(data);
        setPaginationPartition(pag!);
      }),
    ]);
  };

  /**
   * 将接口返回的数据处理为 bizcharts 支持的格式
   */
  const initLineData = (data: any) => {
    const businessData = (ele: any): LineTypes[] => [
      {
        dt: ele.dt,
        labelName: '进审量',
        count: ele.taskCount,
      },
      {
        dt: ele.dt,
        labelName: '审核完成量',
        count: ele.finishCount,
      },
      {
        dt: ele.dt,
        labelName: '审核通过量',
        count: ele.allowCount,
      },
    ];
    const manualData = (ele: any): LineTypes[] => [
      {
        dt: ele.dt,
        labelName: '人均审核量',
        count: ele.avgAuditCount,
      },
    ];
    let result: LineTypes[] = [];
    data.slice().forEach((element: any) => {
      result = [...result, ...(isBusinessData ? businessData(element) : manualData(element))];
    });
    return result;
  };

  /**
   * 第一个表格的数据，只要是一些量
   * @param params
   * @param cb
   */
  const initTotalCount = async (params: any, cb?: (data: any[], pag?: IPagination) => void) => {
    const [err, data = [], pag = {}] = await fetchAsyncRes(() => (isBusinessData ? fetchReceiveTotal(params) : fetchAuditTotal(params)));
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    }
    cb && cb(data as any[], pag);
  };

  /**
   * 第二个表格的数据
   * @param params
   */
  const initPartitionCount = async (params: any, cb?: (data: any[], pag?: IPagination) => void) => {
    const [err, data = [], pag = {}] = await fetchAsyncRes(() => (isBusinessData ? fetchReceiveCount(params) : fetchAuditorCount(params)));
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    }
    cb && cb(data as any[], pag);
  };

  const newInitPartitionCount = async (params: any, cb?: (data: any[], pag?: IPagination) => void) => {
    const [err, data = [], pag = {}] = await fetchAsyncRes(() => (isBusinessData ? fetchReceiveCount(params) : fetchAuditorCount(params)));
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    }
    cb && cb(data as any[], pag);
  };

  useEffect(() => {
    return () => {
      bannerStatisticsCount.forEach((item: IPanelStatisProps) => {
        item.count = 0;
      });
      setBannerStatisticsCount(bannerStatisticsCount);
    };
  }, []);

  const handleTheSecondExport = () => { 
    setLoading(true)
    newInitPartitionCount({ ...useReqParams, pageSize: paginationPartition.total, pageNumber: 1 }, (data, pag) => {
      exportToCsv(columnsPartition, data, '人审数据');
      setLoading(false)
    });
  };

  return (
    <div className="data-statistics main-content">
      <Card>
        <BasicForm
          onSearch={v => handleBasicFormSearch(v)}
          handleCascader={handleCascaderItem}
          formDataModel={formModel}
          ref={basicFormRef}
          layout="inline"
          initialValues={{
            insertTime: [moment().subtract(31, 'days'), moment().subtract(0, 'days')],
          }}
        />
      </Card>
      <Card title="大盘统计" className="mt20">
        {isBusinessData ? (
          <div className="big-count-panel">
            {bannerStatisticsCount.map((item: IPanelStatisProps, index: number) => {
              return (
                <div className="tc" key={`${item.label}-${index}`}>
                  <div className="count">{item.label}</div>
                  <h2 className="title">{index <= 2 ? item.count : `${item.count.toFixed(2) || 0}%`}</h2>
                  <Iconfont name={item.iconName} className={`count-${index + 1}`} />
                </div>
              );
            })}
          </div>
        ) : null}
        <Chart scale={scale} padding={[30, 20, 80, 40]} autoFit height={320} data={lineData}>
          <LineAdvance shape="smooth" point position="dt*count" color="labelName" />
        </Chart>
      </Card>
      <Card>
        <CustomizeTable
          columns={columnsTotal}
          data={totalCount}
          rowKey="id"
          pagination={{ ...paginationTotal, pageSizeOptions: ['10', '20', '50', '500'] }}
          handleChange={(page: PageChangeFnType[0], size?: PageChangeFnType[1]) =>
            initTotalCount({ ...queryParams, pageNumber: page, pageSize: size }, (data, pag) => {
              setTotalCount(data);
              setPaginationTotal(pag!);
            })
          }
        />
      </Card>
      <Card>
        {theSecondExportBtn && (
          <Button
            style={{
              float: 'right',
              marginBottom: '10px',
            }}
            loading={loading}
            disabled={!partitionCount.length}
            type="primary"
            onClick={handleTheSecondExport}
          >
            导出
          </Button>
        )}
        <CustomizeTable
          columns={columnsPartition}
          data={partitionCount}
          rowKey="id"
          pagination={paginationPartition}
          handleChange={(page: PageChangeFnType[0], size?: PageChangeFnType[1]) =>
            initPartitionCount({ ...queryParams, pageNumber: page, pageSize: size }, (data, pag) => {
              setPartitionCount(data);
              setPaginationPartition(pag!);
            })
          }
        />
      </Card>
    </div>
  );
};

export default DataStatistics;
