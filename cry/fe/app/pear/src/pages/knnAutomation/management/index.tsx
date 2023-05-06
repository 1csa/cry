// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Select, Input, Table, Tag, Modal, message, Popconfirm, Tooltip, Icon, message, Row, Col } from 'antd';

import Registered from '@/components/Registered/index';
import { SearchFactor } from '@/config/list.config';
import {
  getQueryList,
  getRegisterInfo,
  getRegistered,
  updateRegistered,
  getTaskFlow,
  fetchFactorDetail,
  fetchTypeDetail,
} from '@/services/knnAutomation';
import { ConnectState } from '@/models/connect';
import './index.less';
// 下线
import DownlineModal from './modal/downlineModal';
//扩缩容
import LoosenModal from './modal/modal.tsx';
//机器数量
import MachineNumModal from './modal/machineNumModal.tsx';
//性能
import PerformanceModel from './modal/performanceModel';
//详情
import DetailModal from './modal/detialModal';
const statusSet = {
  RED: {
    tag: <Tag color="#f50">RED</Tag>,
  },
  GREEN: {
    tag: <Tag color="#87d068">GREEN</Tag>,
  },
  YELLOW: {
    tag: <Tag color="rgb(228, 139, 22)">YELLOW</Tag>,
  },
  RUNNING: {
    tag: <Tag color="#108ee9">RUNNING</Tag>,
  },
};
const BuildstatusSet = {
  QUEUE: {
    tag: 'QUEUE',
  },
  ERROR: {
    tag: <Tag color="#f50">ERROR</Tag>,
  },
  UNKNOWN: {
    tag: 'UNKNOWN',
  },
  COMPLETE: {
    tag: 'COMPLETE',
  },
  ABORT: {
    tag: <Tag color="rgb(228, 139, 22)">ABORT</Tag>,
  },
  RUNNING: {
    tag: 'RUNNING',
  },
};

const Management = ({ form, user }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [addEdlVisible, setAddEdlVisible] = useState<boolean>(false);
  const [edotModelList, setEdotModelList] = useState<any>('');
  const [queryList, setQueryList] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(50);
  //性能状态
  const [performanceModelValue, setPerformanceModelValue] = useState<any>({});
  const [isPerformanceModel, setIsPerformanceModel] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [flag, setFlag] = useState<string>('');
  const [handDataList, setHandDataList] = useState<any>({
    factor: '',
    type: '',
    owners: 'owner',
  });
  const factorValue: any = useRef(null);
  const typeValue: any = useRef(null);
  const ownersValue: any = useRef(null);

  useEffect(() => {
    handGetQueryList();
  }, []);

  const handGetQueryList = async () => {
    setLoading(true);
    const res: any = await getQueryList({
      params: {
        owner: localStorage.getItem('user').split('@')[0],
      },
    });
    setLoading(false);
    if (res.success == true) {
      message.success('请求成功');
      setQueryList(res.data.factorTypeRunningArr);
    }
  };
  const handRegistered = () => {
    setVisible(true);
    setAddEdlVisible(true);
  };
  //库名
  const handType = async (row: any) => {
    setVisible(true);
    setAddEdlVisible(false);
    const res: any = await getRegisterInfo({ params: { type: row.type } });
    if (res.success == true) {
      setEdotModelList(res.data);
      message.success('请求成功');
    } else {
      message.error('请求失败');
    }
  };

  const addModal = async (flag: boolean, validateFieldsAndScroll: any) => {
    let username: string | null = localStorage.getItem('user');

    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res = await getRegistered({
          ...values,
          username: username?.split('@')[0],
          owners: values.owners.split(','),
        });
        if (res?.success === true) {
          message.success('注册成功');
          setVisible(flag);
          handGetQueryList();
        }
      }
    });
  };

  const editModal = async (flag: boolean, validateFieldsAndScroll: any) => {
    let username: string | null = localStorage.getItem('user');
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res = await updateRegistered({
          ...values,
          username: username?.split('@')[0],
          owners: Array.isArray(values.owners) ? values.owners : values.owners.split(','),
        });
        if (res?.success === true) {
          message.success('修改成功');
          setVisible(flag);
          handGetQueryList();
        }
      }
    });
  };

  const deleteModal = (flag: boolean) => {
    setVisible(false);
  };

  const handFactor = (value: any) => {
    setHandDataList((item: any) => ({
      ...item,
      factor: value,
    }));
  };

  const handTypes = (value: any) => {
    setHandDataList((item: any) => ({
      ...item,
      type: value,
    }));
  };
  const handOwner = (value: any) => {
    setHandDataList((item: any) => ({
      ...item,
      owners: value,
    }));
  };
  const handFactorSearch = async () => {
    setLoading(true);
    setPage(1);
    const res: any = await getQueryList({
      params: {
        [handDataList.factor || '']: factorValue.current.input.value,
        [handDataList.type || '']: typeValue.current.input.value,
        [handDataList.owners || '']: ownersValue.current.input.value,
      },
    });
    setLoading(false);
    if (res.success == true) {
      message.success('查询成功');
      setQueryList(res.data.factorTypeRunningArr);
    } else {
      message.error(`${res.reason || '请求失败'}`);
    }
  };

  const smallConfirm = async (data: any) => {
    let username: string | null = localStorage.getItem('user');
    let res = await getTaskFlow({
      factor: data.factor,
      type: data.type,
      flowStatus: 'EXP',
      author: username?.split('@')[0],
    });
    if (res?.success == true) {
      message.success('小流量配置成功');
      handGetQueryList();
    }
  };

  const allConfirm = async (data: any) => {
    let username: string | null = localStorage.getItem('user');
    let res = await getTaskFlow({
      factor: data.factor,
      type: data.type,
      flowStatus: 'MAJOR',
      author: username?.split('@')[0],
    });
    if (res?.success == true) {
      message.success('全量配置成功');
      handGetQueryList();
    }
  };
  const handleTableChange = async (pagination: any, filters: any, sorter: any) => {
    const { current } = pagination;
    setPage(current);
    setLoading(true);
    const res: any = await getQueryList({
      params: {
        ...filters,
        [handDataList.factor || '']: factorValue.current.input.value,
        [handDataList.type || '']: typeValue.current.input.value,
        [handDataList.owners || '']: ownersValue.current.input.value,
      },
    });
    setLoading(false);
    if (res.success == true) {
      message.success('查询成功');
      setQueryList(res.data.factorTypeRunningArr);
    } else {
      message.error(`${res.reason || '请求失败'}`);
    }
  };
  //性能的弹出框函数
  const PerformanceStatusModel = (data, flag, event) => {
    event?.preventDefault();
    setRowData(data);
    setFlag(flag);
    flag === 'factor' ? getFactorDetail(data) : getTypeDetail(data);
  };

  const PerformanceStatusModelClose = () => {
    setIsPerformanceModel(false);
  };

  const getFactorDetail = async (data: any) => {
    let datas = {
      type: data.type,
      factor: data.factor,
      appIdGroup: data.app,
      dataType: data.dataType,
    };
    const res: any = await fetchFactorDetail(datas);
    if (res.success === true) {
      setPerformanceModelValue(res.data);
      setIsPerformanceModel(true);
    } else {
      message.error(res.reason);
    }
  };
  const getTypeDetail = async (data: any) => {
    let datas = {
      factor: data.factor,
      type: data.type,
      appIdGroup: data.app,
      dataType: data.dataType,
    };
    const res: any = await fetchTypeDetail(datas);
    if (res.success === true) {
      setPerformanceModelValue(res.data);
      setIsPerformanceModel(true);
    } else {
      message.error(res.reason);
    }
  };

  const columns = [
    {
      title: 'Factor',
      dataIndex: 'factor',
      key: 'factor',
      align: 'center',
      fixed: 'left',
      width: 125,
      // render: (text: any, record: any, index: number) => {
      //   const start = page * pageSize - pageSize;
      //   const end = queryList.length > pageSize * page ? queryList.length : pageSize * page;
      //   const dealData = queryList.slice(start, end).length > 0 ? queryList.slice(start, end) : queryList;
      //   const obj = {
      //     children: text,
      //     props: { rowSpan: 1 },
      //   };
      //   let arr = dealData.filter(res => {
      //     return res.factor == record.factor;
      //   });
      //   if (index == 0 || (dealData[index - 1] && dealData[index - 1].factor != record.factor)) {
      //     obj.props.rowSpan = arr.length;
      //   } else {
      //     obj.props.rowSpan = 0;
      //   }
      //   return obj;
      // },

      render: (_, row, Tindex) => {
        let rowSpan = 1;
        let arrIndex = 0;
        queryList.forEach((item, Dindex) => {
          if (item.primaryId === row.primaryId) {
            arrIndex = Dindex; // 先获取Name所在的arr的Dindex
          }
        });
        if (Tindex === 0) {
          // 当值在多个页面出现时重新记录rowSpan
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor) {
                rowSpan += 1;
              }
            }
          });
        } else if (queryList[arrIndex].factor === queryList[arrIndex - 1].factor) {
          rowSpan = 0;
        } else {
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor) {
                rowSpan += 1;
              }
            }
          });
        }

        return {
          children: row.factor,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: '端',
      key: 'app',
      filters: [
        { text: '主B端', value: 'yidianb' },
        { text: 'B端', value: 'b' },
        { text: '主端', value: 'yidian_all' },
        { text: 'oppo浏览器', value: 'oppobrowser' },
        { text: 'vivo浏览器', value: 'vivobrowser' },
        { text: 'xiaomi浏览器', value: 'mibrowser' },
        { text: '小B端', value: 's3rd' },
      ],
      align: 'center',
      dataIndex: 'app',
      width: 120,
      // onFilter: (value: string, record) => record.app.startsWith(value),
      onFilter: (value: string, record) => {
        if (record.app === value) {
          return  record.app
        }
      },
      fixed: 'left',
      render(_, row, Tindex) {
        let rowSpan = 1;
        let arrIndex = 0;
        queryList.forEach((item, Dindex) => {
          if (item.primaryId === row.primaryId) {
            arrIndex = Dindex; // 先获取Name所在的arr的Dindex
          }
        });
        if (Tindex === 0) {
          // 当值在多个页面出现时重新记录rowSpan
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app) {
                rowSpan += 1;
              }
            }
          });
        } else if (queryList[arrIndex].factor === queryList[arrIndex - 1].factor && queryList[arrIndex].app === queryList[arrIndex - 1].app) {
          queryList.forEach(item => {
            if (item.factor === row.factor && item.app === row.app) {
              rowSpan = 0;
            }
          });
        } else {
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app) {
                rowSpan += 1;
              }
            }
          });
        }
        return {
          children: row.app,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: '数据类型',
      key: 'dataType',
      filters: [
        { text: '混合', value: 'mix' },
        { text: '用户', value: 'user' },
        { text: '图文', value: 'news' },
        { text: '视频', value: 'video' },
        { text: '小视频', value: 'micro_video' },
        { text: '音频', value: 'album' },
      ],
      
      align: 'center',
      dataIndex: 'dataType',
      width: 120,
      fixed: 'left',
      render(_, row, Tindex) {
        let rowSpan = 1;
        let arrIndex = 0;
        queryList.forEach((item, Dindex) => {
          if (item.primaryId === row.primaryId) {
            arrIndex = Dindex; // 先获取Name所在的arr的Dindex
          }
        });
        if (Tindex === 0) {
          // 当值在多个页面出现时重新记录rowSpan
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        } else if (
          queryList[arrIndex].factor === queryList[arrIndex - 1].factor &&
          queryList[arrIndex].app === queryList[arrIndex - 1].app &&
          queryList[arrIndex].dataType === queryList[arrIndex - 1].dataType
        ) {
          rowSpan = 0;
        } else {
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        }
        return {
          children: row.dataType,
          props: {
            rowSpan,
          },
        };
      },
    },

    {
      title: '总QPS',
      key: 'totalQps',
      align: 'center',
      dataIndex: 'totalQps',
      width: 80,
      fixed: 'left',
      render(_, row, Tindex) {
        let rowSpan = 1;
        let arrIndex = 0;
        queryList.forEach((item, Dindex) => {
          if (item.primaryId === row.primaryId) {
            arrIndex = Dindex; // 先获取Name所在的arr的Dindex
          }
        });
        if (Tindex === 0) {
          // 当值在多个页面出现时重新记录rowSpan
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        } else if (
          queryList[arrIndex].factor === queryList[arrIndex - 1].factor &&
          queryList[arrIndex].app === queryList[arrIndex - 1].app &&
          queryList[arrIndex].dataType === queryList[arrIndex - 1].dataType
        ) {
          rowSpan = 0;
        } else {
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        }
        return {
          children: row.totalQps,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: '总性能状态',
      key: 'totalPerformanceColor',
      align: 'center',
      dataIndex: 'totalPerformanceColor',
      width: 120,
      fixed: 'left',
      filters: [
        { text: 'GREEN', value: 'GREEN' },
        { text: 'YELLOW', value: 'YELLOW' },
        { text: 'RED', value: 'RED' },
      ],
        onFilter: (value: string, record: any) => {
        return record.totalPerformanceColor.includes(value)
      },
      //  onFilter: (value: string, record) => {
      //   if (record.totalPerformanceColor === value) {
        
      //     return  record.totalPerformanceColor
      //   }
      // },
      render(_, row, Tindex) {
        const renderStatus = statusSet[row.totalPerformanceColor];
        let rowSpan = 1;
        let arrIndex = 0;
        queryList.forEach((item, Dindex) => {
          if (item.primaryId === row.primaryId) {
            arrIndex = Dindex; // 先获取Name所在的arr的Dindex
          }
        });
        if (Tindex === 0) {
          // 当值在多个页面出现时重新记录rowSpan
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        } else if (
          queryList[arrIndex].factor === queryList[arrIndex - 1].factor &&
          queryList[arrIndex].app === queryList[arrIndex - 1].app &&
          queryList[arrIndex].dataType === queryList[arrIndex - 1].dataType
        ) {
          rowSpan = 0;
        } else {
          queryList.forEach((item, Dindex) => {
            if (Dindex > arrIndex) {
              if (item.factor === row.factor && item.app === row.app && item.dataType === row.dataType) {
                rowSpan += 1;
              }
            }
          });
        }
        return {
          children: renderStatus ? (
            <Button type="link" onClick={() => PerformanceStatusModel(row, 'factor')}>
              {renderStatus.tag}
            </Button>
          ) : (
            <Button type="link" onClick={() => PerformanceStatusModel(row, 'factor')}>
              {row.totalPerformanceColor}
            </Button>
          ),
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: '库名',
      key: 'type',
      align: 'center',
      dataIndex: 'type',
      fixed: 'left',
      width: 190,
      render: (text: any, row: any) => {
        return <a onClick={() => handType(row)}>{text}</a>;
      },
    },
    {
      title: 'qps',
      key: 'qps',
      align: 'center',
      dataIndex: 'qps',
      width: 85,
    },

    {
      title: '性能状态',
      key: 'performanceColor',
      align: 'center',
      dataIndex: 'performanceColor',
      width: 110,
      filters: [
        { text: 'GREEN', value: 'GREEN' },
        { text: 'YELLOW', value: 'YELLOW' },
        { text: 'RED', value: 'RED' },
      ],
       onFilter: (value: string, record: any) => {
        return record.performanceColor.includes(value)
      },
      render: (status: string, row: any) => {
        const renderStatus = statusSet[status];
        return renderStatus ? (
          <Button type="link" onClick={() => PerformanceStatusModel(row, 'type')}>
            {renderStatus.tag}
          </Button>
        ) : (
          status
        );
      },
    },
    {
      title: '场景',
      key: 'scene',
      filters: [
        { text: '普通', value: 'normal' },
        { text: '严格规范源', value: 'strict' },
        { text: '宽松规范源', value: 'loose' },
        { text: '更宽松规范源', value: 'relax_loose' },
        { text: '新热', value: 'recent_hot' },
        { text: '高热', value: 'hot' },
        { text: '高质量', value: 'high_quality' },
        { text: '废弃', value: 'discard' },
      ],
      align: 'center',
      dataIndex: 'scene',
      width: 130,
    },
    {
      title: '数据量',
      key: 'dataNum',
      align: 'center',
      dataIndex: 'dataNum',
      width: 85,
    },
    {
      title: '构建状态',
      key: 'buildStatus',
      align: 'center',
      dataIndex: 'buildStatus',
      filters: [
        {
          text: 'QUEUE',
          value: 'QUEUE',
        },
        {
          text: 'RUNNING',
          value: 'RUNNING',
        },
        {
          text: 'UNKNOWN',
          value: 'UNKNOWN',
        },
        {
          text: 'COMPLETE',
          value: 'COMPLETE',
        },
        {
          text: 'ABORT',
          value: 'ABORT',
        },
        {
          text: 'ERROR',
          value: 'ERROR',
        },
      ],
      render: (status: string) => {
        const renderStatus = BuildstatusSet[status];
        return renderStatus ? renderStatus.tag : status;
      },
    },
    {
      title: '流量状态',
      key: 'flowStatus',
      align: 'center',
      dataIndex: 'flowStatus',
      filters: [
        { text: '注册', value: 'REGISTER' },
        { text: '小流量', value: 'EXP' },
        { text: '全量', value: 'MAJOR' },
        { text: '下线', value: 'DISCARD' },
      ],
    },
    {
      title: '重要等级',
      filters: [
        { text: '核心', value: '5' },
        { text: '重要', value: '4' },
        { text: '中等', value: '3' },
        { text: '低', value: '2' },
        { text: '测试', value: '1' },
      ],
      align: 'center',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '构建间隔',
      key: 'buildGap',
      align: 'center',
      dataIndex: 'buildGap',
      filterDropdown: <p></p>,
      filterIcon: (
        <Tooltip placement="top" title="今日平均/昨日平均/近一周平均(h)">
          <Icon type="question-circle-o" />
        </Tooltip>
      ),
    },
    {
      title: '构建耗时',
      key: 'buildLatency',
      align: 'center',
      dataIndex: 'buildLatency',
      filterDropdown: <p></p>,
      filterIcon: (
        <Tooltip placement="top" title="今日平均/昨日平均/近一周平均(min)">
          <Icon type="question-circle-o" />
        </Tooltip>
      ),
    },
    {
      title: '构建成功数',
      key: 'buildSuccessCount',
      align: 'center',
      dataIndex: 'buildSuccessCount',
      filterDropdown: <p></p>,
      filterIcon: (
        <Tooltip placement="top" title="今日总数/昨日总数/近一周总数">
          <Icon type="question-circle-o" />
        </Tooltip>
      ),
    },
    {
      title: '上次构建成功',
      key: 'completeTime',
      align: 'center',
      dataIndex: 'completeTime',
    },

    {
      title: '中文名',
      align: 'center',
      key: 'cnName',
      dataIndex: 'cnName',
    },

    {
      title: '机器数量',
      key: 'machineNum',
      align: 'center',
      dataIndex: 'machineNum',
      render: (text: any, row: any) => {
        return <MachineNumModal row={row} text={text}></MachineNumModal>;
      },
    },
    {
      title: '过期时间',
      key: 'expireTime',
      align: 'center',
      dataIndex: 'expireTime',
    },
     {
      title: '注册日期',
      key: 'createTime',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '描述',
      key: 'description',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '负责人',
      key: 'owners',
      align: 'center',
      dataIndex: 'owners',
      render: (text: any, row: any) => {
        let fruitsObj = { ...text };
        var arr = [];
        for (let i in fruitsObj) {
          let o = {};
          o['name'] = fruitsObj[i];
          arr.push(o);
        }
        return arr.map((item: any) => {
          return <li>{item.name}</li>;
        });
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 300,
      render: (text: string, row: any) => {
        return (
          <div key={text}>
            <Popconfirm title="小流量" onConfirm={() => smallConfirm(text)} okText="确定" cancelText="取消">
              <Tag color="#108ee9" style={{ cursor: 'pointer' }}>
                小流量
              </Tag>
            </Popconfirm>
            <Popconfirm title="全量" onConfirm={() => allConfirm(text)} okText="确定" cancelText="取消">
              <Tag color="#108ee9" style={{ cursor: 'pointer' }}>
                全量
              </Tag>
            </Popconfirm>
            {/* <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => offlineConfirm(text)}>
              下线
            </Tag> */}
            <DownlineModal row={row} successCallback={handGetQueryList}></DownlineModal>
            <LoosenModal row={row} successCallback={handGetQueryList} user={user}></LoosenModal>
            <DetailModal row={row}></DetailModal>
          </div>
        );
      },
    },
  ];
  return (
    <div className="management">
      <Card bordered={false} className="management-Card">
        <div className="management-header">
          <Button type="primary" onClick={() => handRegistered()}>
            + 注册新库
          </Button>
          <div style={{ display: 'flex' }}>
            <Input.Group compact>
              <Select style={{ width: '35%' }} onChange={handFactor} allowClear={true}>
                {SearchFactor?.map((item: any) => {
                  return (
                    // @ts-ignore
                    <Select.Option value={item.text} key={item.key}>
                      {item.text}
                    </Select.Option>
                  );
                })}
              </Select>
              <Input style={{ width: '65%' }} ref={factorValue} allowClear={true} placeholder="输入关键字查找" />
            </Input.Group>
            <Input.Group compact style={{ marginLeft: 10 }}>
              <Select style={{ width: '35%' }} onChange={handTypes} allowClear={true}>
                {SearchFactor?.map((item: any) => {
                  return (
                    <Select.Option value={item.text} key={item.key}>
                      {item.text}
                    </Select.Option>
                  );
                })}
              </Select>
              <Input style={{ width: '65%' }} ref={typeValue} allowClear={true} placeholder="输入关键字查找" />
            </Input.Group>
            <Input.Group compact style={{ marginLeft: 10 }}>
              <Select style={{ width: '35%' }} onChange={handOwner} allowClear={true} defaultValue="owners">
                {SearchFactor?.map((item: any) => {
                  return (
                    <Select.Option value={item.text} key={item.key}>
                      {item.text}
                    </Select.Option>
                  );
                })}
              </Select>
              <Input
                style={{ width: '65%' }}
                ref={ownersValue}
                allowClear={true}
                placeholder="输入关键字查找"
                defaultValue={localStorage.getItem('user').split('@')[0]}
              />
            </Input.Group>
            <Button style={{ marginLeft: 5 }} type="primary" icon="search" onClick={handFactorSearch}>
              搜索
            </Button>
          </div>
        </div>
        <Registered
          visible={visible}
          addEdlVisible={addEdlVisible}
          addModal={addModal}
          editModal={editModal}
          deleteModal={deleteModal}
          edotModelList={edotModelList}
        />
        <Table
          columns={columns}
          dataSource={queryList}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => setPage(page),
            onShowSizeChange: (current, pageSize) => {
              setPage(1);
              setPageSize(pageSize);
            },
            showTotal: total => `共 ${total} 条`,
          }}
          scroll={{ x: 3300 }}
        />
        <PerformanceModel
          value={performanceModelValue}
          visible={isPerformanceModel}
          successCallback={PerformanceStatusModelClose}
          rowData={rowData}
          flag={flag}
        ></PerformanceModel>
      </Card>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Form.create()(Management));
