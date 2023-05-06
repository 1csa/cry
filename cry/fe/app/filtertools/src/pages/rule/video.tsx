import React, { FC, useCallback, useState, useEffect, useRef} from 'react';
import {
  Card,
  Table,
  message,
  Button,
  Modal,
  Input,
  Form, Pagination
} from 'antd';
import request from '@/utils/request';
import axios from 'axios';
import AddCoverForm from '@/components/videoRule/addForm';
import { convertLevel } from '@/utils/convert_level';
import { LogInfo, defaultVideoRuleFormValue, videocolumns } from '@/config/constant';
import { getIsDev } from '@/utils/get_dev';
import { exportData } from '@/utils/export_data'
import { saveKibana, saveStaticLog } from '@/utils/log'


const isDev = getIsDev();
const defaultFormValue = defaultVideoRuleFormValue;
const { Search } = Input;
interface GenerationProps {
  form: { getFieldDecorator: any; validateFields: any; resetFields: any ;setFieldsValue:any};
  location: {query: any, params: any}
}
const VideoRule: FC<GenerationProps> = (props:GenerationProps) => {
  const column = [{
    title: '编号',
    dataIndex: 'ruleId',
    width: 80,
  },{
    title: '过滤规则',
    dataIndex: 'name',
  },{
    title: '说明',
    dataIndex: 'desc',
  },{
    title: '频道名单',
    dataIndex: 'channelList',
    width: 300,
    render: (text: any) => text.type + ':' + text.content,
  },{
    title: '操作',
    fixed: 'right',
    width: 100,
    render: (record: any) => (
      <span>
        <Button type="primary" size="small" icon="edit" onClick={() => editNewsRule(record)} style={{ marginBottom: '5px' }}>编辑</Button>
        <Button type="danger" size="small" icon="delete" onClick={() => deleteNewsRulePop(record)}>删除</Button>
      </span>
    )
  }];
  const [result, setResult] = useState<any[]>([]);
  const [resultExportVideo, setResultExportVideo] = useState<any[]>([]);
  const [threshold, setThreshold] = useState<Object>({});
  const [loading, setLoading] = useState<Boolean>(true);
  const [adddrawervisible, setAdddrawervisible]  = useState<Boolean>(false);
  const [defaultform, setDefaultform] = useState<Object>(defaultFormValue);
  const [disabledId, setDisabledId] = useState<Boolean>(false);
  const [disabledInput, setDisabledInput] = useState<Boolean>(false);
  const { getFieldDecorator,validateFields, resetFields , setFieldsValue} = props.form;
  const [current, setPage] = useState<any>(1)
  const [pageSize, setPageSize] = useState<any>(15)
  const [total, setTotal] = useState<any>(0)
  useEffect(() =>{
    getAllVideoThreshold();
    getAllVideoRulesExport()
    props.location.query.ruleName?searchRule():getAllVideoRules();
  },[])

  const getAllVideoRules = async (currents, pageSizes) => {
    const ret = await request.get(`/api/filtertools/getAllVideoRules?isdev=${isDev}&current=${currents ? currents : current}&pageSize=${pageSizes ? pageSizes : pageSize}`);
    if(ret.code === 0) {
      const filterResult = ret.result.data.filter( item => item.videoDelStatus !== true )
      setResult(filterResult);
      setPage(ret.result.currentPage)
      setPageSize(ret.result.pageSize)
      setTotal(ret.result.count)
      setLoading(false);
    } else {
      message.error(`统计数据获取失败,${'原因: '+ ret.message ? ret.message : ''},请刷新重试`);
      setResult([]);
    }
  }
  //获取所有视频导出的数据
  const getAllVideoRulesExport = async () => {
    const ret = await request.get(`/api/filtertools/getAllVideoRulesExport?isdev=${isDev}`);
    if(ret.code === 0) {
      const filterResult = ret.result.filter( (item:any) => item.videoDelStatus !== true )
      setResultExportVideo(filterResult)
    } else {
      message.error(`统计数据获取失败,${'原因: '+ ret.message ? ret.message : ''},请刷新重试`);
    }
  }
  const paginationChange = async(current, pageSize) => {
    setLoading(true);
    getAllVideoRules(current, pageSize)
  }
  const getAllVideoThreshold  = async () => {
    const ret = await request.get(`/api/filtertools/getAllVideoThreshold?isdev=${isDev}`);
    if(ret.code === 0) {
      let handleThreshold = {};
      delete ret.data[0]._id;
      delete ret.data[0].lastmodified;
      Object.keys(ret.data[0]).map( item => {
        handleThreshold[item] = convertLevel(ret.data[0][item]);
      })
      setThreshold(handleThreshold);
    } else {
      message.error(`图文阈值设置列表获取失败`);
      setThreshold([]);
    }
  }
  const addData = () => {
    setAdddrawervisible(true);
    setDefaultform(defaultFormValue);

  }
  const editNewsRule = (data: any) => {
    let obj = Object.assign({},data)
    if (data.channelList && data.channelList.content && typeof data.channelList.content !== 'string') {
      obj.channelList.content = data.channelList.content.join(',')
    }
    if (data.protect_source && typeof data.protect_source !== 'string') {
      obj.protect_source = data.protect_source.join(',')
    }
    if (data.src && typeof data.src !== 'string') {
      obj.src = data.src.join(',')
    }
    if (data.wm_ids && typeof data.wm_ids !== 'string') {
      obj.wm_ids = data.wm_ids.join(',')
    } else {
      obj.wm_ids = ''
    }
    setDefaultform(obj);
    setAdddrawervisible(true);
  }
  const deleteNewsRulePop = (data: any) => {
    Modal.confirm({
      title: 'Confirm',
      content: `确定删除规则《${data.name}》吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk(){
        deleteNewsRule(data)
      } ,
    });
  }

  const deleteNewsRule = async (data: any) => {
    const userName = localStorage.getItem('userName')
    const ret = await request.post(`/api/filtertools/deleteVideoRule?isdev=${isDev}`, {
      data: {
        'ruleId' : data.ruleId,
        userName
      }
    });
    const act = 'delete',
          value = data;
    value.location = window.location.href;
    value.debug = isDev ? 1:0;
    if (ret.code === 0) {
      const { log_domain, log_secret, video_rule_key}: any = LogInfo
      saveStaticLog(log_domain, log_secret, [{
        action: act,
        key: video_rule_key,
        value: value ? JSON.stringify(value) : '',
        fromid: '',
        comment: '',
      }])
      saveKibana(act,video_rule_key,value)
      let newresult: any[] = [];
      newresult = newresult.concat(result);
      newresult.splice(newresult.findIndex(item => item.ruleId === data.ruleId), 1);
      setResult(newresult);
      message.success('删除成功');
    } else {
      message.error('删除失败，请重试');
    }
  }
  const searchRule = async () => {
    setLoading(true)
    validateFields((err:any, value:any) => {
       let ruleName = props.location.query.ruleName
       let reqData = {}
       let port = 'searchVideoRule'
       setFieldsValue({'searchValue' : value.searchValue})
       setFieldsValue({'searchId' : value.searchId})
       ruleName && setDisabledId(true)
       if (disabledId && !disabledInput) { // 规则说明、名称判断逻辑
        port = 'searchVideoRule'
        reqData = {
          keywords: value.searchValue
        }
      } else if(!disabledId && disabledInput) { // id查询判断逻辑
        port = 'searchVideoRuleById'
        reqData = {
          id: value.searchId
        }
      } else if(ruleName) { // 规则校验平台跳转判断
        port = 'searchVideoRule'
        reqData = {
          keywords: ruleName
        }
      } else{ // 表单内字段值为空
        port = 'searchVideoRule'
        reqData = {
          keywords: value.searchValue
        }
      }
       request.post(`/api/filtertools/${port}?isdev=${isDev}`, {
        data: reqData
      }).then( res => {
        if (res.code === 0) {
          const newData = res.data.data.filter((item:any) => !item.videoDelStatus);
          if(newData.length > 0) {
            setResult(newData)
            setPage(res.data.currentPage)
            setPageSize(res.data.pageSize)
            setTotal(res.data.count)
            message.success('搜索成功');
          } else {
            setResult(newData);
            message.warning('暂无数据');
          }
          setLoading(false);
          if(ruleName) {
            delete props.location.query.ruleName
          }
        } else {
          setResult([]);
          setLoading(false);
          message.error('搜索失败，请重试');
        }
        // 无论搜索结果 所有值赋空
        setFieldsValue({'searchValue' : ''})
        setFieldsValue({'searchId': ''})
        // 解除搜索框禁用
        setDisabledId(false)
        setDisabledInput(false)
      })
    })
  };
  const onExportData = () => {
    exportData('视频过滤规则表', resultExportVideo, videocolumns);
  }
  // 避免使用方错误使用两个输入框导致报错
  const disabledIdFn = (e:any) => {
    let value = e.target.value
    if(value.length>0) {
      setDisabledId(true)
    } else {
      setDisabledId(false)
    }
  }
  // 同上
  const disabledInputFn = (e:any) => {
    let value = e.target.value
    if(value.length>0) {
      setDisabledInput(true)
    } else {
      setDisabledInput(false)
    }
  }
  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <div style={{ marginBottom: '10px',display:'flex',alignItems:'center' }}>
            <Button type="primary" style={{ marginRight: '10px' }} icon="file-add" onClick={addData} loading={loading}>添加数据</Button>
            <Button type="primary" icon="cloud-download" style={{ marginRight: '10px', background: '#48D1CC', borderColor: '#48D1CC' }} onClick={onExportData}>导出数据</Button>
            <Form style={{display:'flex' , alignItems:'center' , marginBottom : -3}}>
            <Form.Item
              style={{marginBottom : 0}}
              >
                {getFieldDecorator('searchId', {
                  initialValue: '',
                })(
                  <Input
                    placeholder='编号(id)查询'
                    style={{width: 120, marginRight: 10}}
                    onChange={disabledInputFn}
                    disabled={disabledId}
                  />
                )}
              </Form.Item>
              <Form.Item
              style={{marginBottom : 0}}
              >
                {getFieldDecorator('searchValue', {
                  initialValue: '',
                })(
                  <Input
                    placeholder='视频规则名称、说明查询'
                    style={{width: 180, marginRight: 10}}
                    onChange={disabledIdFn}
                    disabled={disabledInput}
                  />
                )}
              </Form.Item>
              <Button type="primary" icon="search" onClick={() => searchRule()}>
                  搜索
              </Button>
            </Form>
            <div style={{paddingLeft : 100}}>
              视频过滤规则: 共{result.length}条数据
            </div>
          </div>
          <Table
            columns={column}
            loading = {loading}
            dataSource={result}
            rowKey="_id"
            pagination={false}
          />
          <Pagination
            style={{ float: "right", padding: 10 }}
            onChange={paginationChange}
            current={current}
            total={total}
            defaultPageSize={pageSize}
            // onShowSizeChange={onShowSizeChange}
          />
          <AddCoverForm
            adddrawervisible={adddrawervisible}
            setAdddrawervisible={setAdddrawervisible}
            setResult={setResult}
            result={result}
            defaultform={defaultform}
            threshold={threshold}
            isDev={isDev}
          />
        </Card>
      </div>
    </>
  );
};
const GenerationDemo = Form.create({ name: 'Check_other' })(VideoRule);
export default GenerationDemo
