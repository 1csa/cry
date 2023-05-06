import React, { useState, useEffect } from 'react';
import { 
  Divider, 
  message as aliasMessage, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Upload, 
  Icon, 
  Button 
} from 'antd';
import { 
  taskTypes, 
  accountTypes, 
  importRelationship, 
  putAPI,
  libraryTypes, 
  timeTypes,
  taskTimeTypes,
  runTypes, 
  accountWays,
  accountLibraryTypes
} from '../../../config/constant';
import ConfigItem from '../component/configItem';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';
import { connect } from 'dva';
import { getQueryVariable } from '../../../utils/url_tool';
import request from '@/utils/request';
import router from 'umi/router';
import XLSX from 'xlsx';

import './index.less';

const { TextArea } = Input;

interface createPutConfigProps {
  form: any,
  dispatch: Dispatch,
  user: UserModelState
}

interface putConfigType {
  create_author: string,
  task_name: string,
  task_remarks: string,
  delivery_way: number,
  running_way: number,
  platform_store: number,
  delivery_config: any,
  posting_time: number,
  filter_word: any,
  filter_account: any,
  import_account: number,
  import_relationship: number,
  account_address: string,
  export_app: number,
  export_bucket: string,
  task_id: string,
  account_way: number
}



const createPutConfig: React.FC<createPutConfigProps> = ({ form, dispatch, user }) => {

  const [ fileList, setFileList ] = useState<any>([]);
  const [ uploading, setUploading ] = useState<boolean>(false);
  const [ siteList, setSiteList ] = useState<any>([]);
  const [ detailType, setDetailType ] = useState<string>(getQueryVariable('type'));
  const [ inputDisabled, setInputDisabled ] = useState<boolean>(false);
  const [ jobId, setJobId ] = useState<string>('');
  const [ rightFile, setRightFile ] = useState<boolean>(false);
  const [ deliveryArr, setDeliveryArr ] = useState<any>([]);
  const [ exportAppList, setExportAppList ] = useState<any>([]);

  const defaultConfig = {
    create_author: '',
    task_name: '',
    task_id: '',
    task_remarks: '',
    delivery_way: 1,
    account_way: 2,
    running_way: 1,
    platform_store: 1,
    delivery_config: (detailType === 'edit' || detailType === 'scan') ? [] : [{
      source_id: 1
    }],
    posting_time: 2,
    filter_word: '',
    filter_account: '',
    import_account: 1,
    import_relationship: 2,
    account_address: '',
    export_app: 1,
    export_bucket: ''
  }

  let [ configInfo, setConfigInfo ] = useState<putConfigType>(defaultConfig);
  const { getFieldDecorator } = form;

  const selectTaskType = (value: number) => {
    configInfo.delivery_way = value;
    if (configInfo.delivery_way === 2) {
      configInfo.account_way = 1;
      configInfo.posting_time = 1;
      configInfo.platform_store = 1;
      configInfo.delivery_config = [{
        source_id: 1
      }];
      runTypes[1].disabled = true;

    } else {
      configInfo.delivery_config = jobId ? deliveryArr : [{
        source_id: 1
      }];
      configInfo.account_way = 2;
      configInfo.posting_time = 2;
      if (!jobId) {
        configInfo.import_relationship = 1;
      }
      runTypes[1].disabled = false;
    }
    configInfo.running_way = 1;
    setConfigInfo({...configInfo});
  }

  const changeAccountWay = (e: any) => {
    configInfo.account_way = e.target.value;
    if (configInfo.account_way === 1) {
      configInfo.import_relationship = 1;
      importRelationship[0].disabled = false;
    } else {
      configInfo.import_relationship = 2;
      importRelationship[0].disabled = true;
    }
    setConfigInfo({...configInfo});

  }

  const changeRelationship = (e: any) => {
    configInfo.import_relationship = e.target.value;
    setConfigInfo({...configInfo});
  }

  const changeRunningWay = (e: any) => {
    configInfo.running_way = e.target.value;
    if (e.target.value === 1) {
      importRelationship[0].disabled = true;
    } else {
      importRelationship[0].disabled = false;
    }
    setConfigInfo({...configInfo});
  }

  const changeContentLibrary = (e: any) => {
    configInfo.platform_store = e.target.value;
    setConfigInfo({...configInfo});
  }

  const selectContentType = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['platform_type_id'] = value;
    setConfigInfo({...configInfo});
  }

  const selectSiteType = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['source_id'] = value;
    setConfigInfo({...configInfo});
  }

  const changeContentScore = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['score'] = value;
    setConfigInfo({...configInfo});
  }

  const changeCountAll = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['count_all'] = value;
    setConfigInfo({...configInfo});
  }
  const selectCategory = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['category_id'] = value;
    setConfigInfo({...configInfo});
  }
  const selectHotType = (value: number, index: number) => {
    configInfo.delivery_config[index - 1]['hot_type'] = value;
    setConfigInfo({...configInfo});
  }

  const selectExportApp = (value: number) => {
    configInfo.export_app = value;
  }
  const handleUpload = () => {
    if (rightFile) {
      let formData = new FormData();
      fileList.forEach((file: any) => {
        formData.append('excel', file);
      })
      setUploading(true);
      let url = configInfo.import_relationship === 1 ? putAPI.uploadOneToOneFile : putAPI.uploadRandomFile;
      request.post(url, {
        data: formData
      }).then((res)=> {
        if (res.code === 0) {
          setUploading(false);
          configInfo.account_address = res.data.redis_key;
          setConfigInfo({...configInfo});
          aliasMessage.success('上传成功');
        } 
      });
    }
  }

  const getSiteData = async () => {
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/getSiteList'
    });
    if (code === 0 || message === 'success') {
      setSiteList([...(data.sources || [])]);
    } else {
      setSiteList([...[]]);
      aliasMessage.error(`${message}`);
    }
  }

  const getExportApp = async () => {
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/getExportAppList'
    });
    if (code === 0 || message === 'success') {
      setExportAppList([...(data.export_apps || [])]);
    } else {
      setExportAppList([...[]]);
      aliasMessage.error(`${message}`);
    }
  }


  useEffect(() => {
    let id = getQueryVariable('id');
    setJobId(id);
    id !== '' && getTaskDetail(id);
    if (!id) {
      configInfo.import_relationship = 1;
    }
    getSiteData();
    let type = getQueryVariable('type');
    setDetailType(type);
    type === 'scan' ? setInputDisabled(true) : setInputDisabled(false);
    getExportApp();
    if(configInfo.delivery_way === 1) {
      importRelationship[0].disabled = false;
    } else {
      configInfo.account_way === 1 ? 
      importRelationship[0].disabled = false : 
      importRelationship[0].disabled = true
    }

  }, [])

  const getTaskDetail = async (id: string) => {
    const { code, message, data = [] } = await dispatch({
      type: 'putTaskList/getTaskDetail',
      payload: {
        id
      }
    });
    if (code === 0 || message === 'success') {
      if (detailType === 'copy') {
        delete data.task.account_address;
      }
      setDeliveryArr([...data.task.delivery_config]);
      data.task.filter_account = data.task.filter_account.join(',');
      data.task.filter_word = data.task.filter_word.join(',');
      setConfigInfo({...data.task});
      data.task.account_address && setFileList([{
        uid: '-1',
        name: `${data.task.account_address.split('_')[1]}`,
        status: 'done',
        url: ''
      }])
    }
  }

  const addConfig = () => {
    if (configInfo.delivery_config.length < 5) {
      configInfo.delivery_config.push({
        source_id: 1,
        score: 70
      })
      setConfigInfo({...configInfo});
    } else {
      aliasMessage.error('配置信息只能添加五条');
    }
    
  }

  const deleteItem = (index: number) => {
    configInfo.delivery_config.splice(index - 1, 1);
    setConfigInfo({...configInfo});
  }

  const cancelClick = () => {
    router.go(-1);
  }

  const downloadFile = () => {
    let data = configInfo.import_relationship === 1 ? 
    [["获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"]] : 
    configInfo.delivery_way === 2 && configInfo.account_way === 1 ? 
    [["获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"]] :
    [["median ID", "账号名称", "领域"]];  
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    let fileName = configInfo.import_relationship === 1 ? '一一对应模板.xlsx' : '随机打散模板.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  const saveTask = () => {
    
    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }
      let arr = configInfo.delivery_config;
      if (values['delivery_way'] === 1) {
        arr.forEach((item: any) => {
          if (values['platform_store'] === 1) {
            item['category_id'] = 1;
          }
          values['platform_store'] === 1 ? delete item.hot_type : delete item.score;
        })
      } else {
        arr.forEach((item: any) => {
          item.domain_id = 0;
        })
      }
      configInfo.delivery_config = [...arr];
      values['delivery_config'] = configInfo.delivery_config;
      values['account_address'] = configInfo.account_address;
      
      const reg = /^([\u0391-\uFFE5\d\w,])*([\u0391-\uFFE5\d\w]+)$/;
   
      if (values['filter_word'] && 
          values['filter_word'].match(reg) && 
          values['filter_word'].match(reg).length > 0) {
        let value = values['filter_word'].replace(/，/ig,',');
        values['filter_word'] = value.split(',');
      } else {
        values['filter_word'] && aliasMessage.error('请输入以逗号隔开的关键词');
      }
      if (values['filter_account'] && 
          values['filter_account'].match(reg) && 
          values['filter_account'].match(reg).length > 0) {
        let value = values['filter_account'].replace(/，/ig,',');
        values['filter_account'] = value.split(',');
      } else {
        values['filter_account'] && aliasMessage.error('请输入以逗号隔开的账号');
      }
      
      let { currentUser = {} } = user;
      if (values['delivery_way'] === 2 
        && values['account_way'] === 1) {
        delete values['delivery_config'];
      }

      if (values['filter_account'] == '') {
        values['filter_account'] = [];
      }
      if (values['filter_word'] == '') {
        values['filter_word'] = [];
      }

      if (detailType === 'edit') {
        values['operators'] = currentUser.name;
        values['job_id'] = jobId;
        const { code, errors, data } = await dispatch({
          type: 'putTaskList/editTask',
          payload: {
            jobId,
            ...values
          }
        });
        if (code === 0) {
          aliasMessage.success('编辑成功');
          router.go(-1);
        } else {
          aliasMessage.error(errors);
        }
      } else if (!detailType || detailType === 'copy'){
        values['create_author'] = currentUser.name;
        values['email_address'] = currentUser.email;
        const { code, message, data } = await dispatch({
          type: 'putTaskList/createTask',
          payload: {
            ...values
          }
        });
        if (code === 0) {
          aliasMessage.success('保存成功');
          router.go(-1);
        } else {
          aliasMessage.error(typeof message === 'string' ? message : message[0].msg);
        }

      }
      
    })
  }

  const uploadProps = {
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    beforeUpload: (file: any) => {
      if (file.size/(1024*1024) > 2) {
        aliasMessage.error('文件大小不能超过2M!');
        setRightFile(false);
        return;
      }

      // 通过FileReader对象读取文件
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          let result = event.target ? event.target.result : {};
          let workbook = XLSX.read(result, { type: 'binary' });
          let data: any[] = []; 
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            }
          }
          let arr = Object.keys(data[0]);
          if (configInfo.import_relationship === 1) {
            if (arr.toString() !== ["获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"].toString()) {
              aliasMessage.error('字段名称应为"获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"');
              setRightFile(false);
              return;
            } else {
              setRightFile(true);
            }
          } else {
            if (configInfo.delivery_way == 1 
              && arr.toString() !== ["median ID", "账号名称", "领域"].toString()) {
              aliasMessage.error('字段名称应为"median ID", "账号名称", "领域"');
              setRightFile(false);
              return;
            } else if (configInfo.delivery_way == 2
              && configInfo.account_way == 1
              && arr.toString() !== ["获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"].toString()){
              aliasMessage.error('字段名称应为"获取账号名称", "获取账号主页URL", "median ID", "账号名称", "领域", "来源"');
              setRightFile(false);
              return;
            } else if (configInfo.delivery_way == 1
              && configInfo.account_way == 2
              && arr.toString() !== ["median ID", "账号名称", "领域"].toString()) {
              aliasMessage.error('字段名称应为"median ID", "账号名称", "领域"');
              setRightFile(false);
              return;
            } else {
              setRightFile(true);
            }
          }
          
        } catch (e) {
          return;
        }
      };
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file);
      setFileList([...fileList, file]);
    },
    onRemove: (file: any) => {
      let arr = [...fileList];
      arr.splice(arr.findIndex((el)=> el.uid === file.uid), 1);
      setFileList([...arr]);
    }
  }

  const formItemLayout = {
    width: 1000
  };

  return (
    <div className="main-content">
      <p className="title">
        { detailType === 'scan' ? '查看任务' : detailType === 'edit' ? '编辑任务' : '新建任务' }
        <Button onClick={cancelClick} className="back" type="link">返回</Button>
      </p>
      <Divider />
      <Form {...formItemLayout} onSubmit={saveTask}>
        <div className="form-title">任务内容</div>
        { configInfo.task_id && detailType !== 'copy' ? 
          (<span className="label">任务ID:&nbsp;&nbsp;{configInfo.task_id}</span>) :
          (<></>)
        }
        <Form.Item label="任务名称">
          { getFieldDecorator('task_name', {
              initialValue: configInfo.task_name,
              rules: [{
                required: true,
                min: 1,
                max: 25,
                message: '必填项且最长可输入25位'
              }]
            })(
              <Input placeholder="请输入任务名称" style={formItemLayout} disabled={inputDisabled}/>
            )
          }
        </Form.Item>
        <Form.Item label="任务说明">
          { getFieldDecorator('task_remarks', {
              initialValue: configInfo.task_remarks,
              rules: [{
                required: true,
                min: 1,
                max: 200,
                message: '必填项且最长可输入200位'
              }]
            })(
              <Input placeholder="请输入任务说明" style={formItemLayout} disabled={inputDisabled}/>
            )
          }
        </Form.Item>
        <Form.Item label="任务方式">
          {getFieldDecorator('delivery_way', { 
            initialValue: configInfo.delivery_way,
            rules: [{
              required: true
            }]
          })(
            <Select placeholder="请选择任务方式" onChange={selectTaskType} style={formItemLayout} disabled={inputDisabled}>
            {
              taskTypes.map((item: any, index:number) => {
                return <Select.Option value={item.delivery_way} key={index}>{item.label}</Select.Option>
              })
            }
            </Select>
          )}
        </Form.Item>
        <Form.Item label="任务时间">
          {getFieldDecorator('running_way', {
            initialValue: configInfo.running_way,
            rules: [{
              required: true
            }]
          })(<Radio.Group options={runTypes} onChange={changeRunningWay} disabled={inputDisabled}/>)}
        </Form.Item>
        <div className="form-title">内容筛选</div>
        { configInfo.delivery_way === 1 ? (
          <Form.Item label="内容库">
          { getFieldDecorator('platform_store', { 
              initialValue: configInfo.platform_store,
              rules: [{
                required: true
              }]
            })(
              <Radio.Group options={libraryTypes} disabled={inputDisabled} onChange={changeContentLibrary}/>
            )
          }
          </Form.Item>
        ):(
          <Form.Item label="内容库">
          { getFieldDecorator('platform_store', { 
              initialValue: configInfo.platform_store,
              rules: [{
                required: true
              }]
            })(
              <Radio.Group options={accountLibraryTypes} disabled={inputDisabled} onChange={changeContentLibrary}/>
            )
          }
          </Form.Item>
        )}
        
        { configInfo.delivery_way === 2 ? (
          <Form.Item label="账号设置">
            { getFieldDecorator('account_way', { 
                initialValue: configInfo.account_way,
                rules: [{
                  required: true
                }]
              })(
                <Radio.Group options={accountWays} disabled={inputDisabled} onChange={changeAccountWay}/>
              )
            }
          </Form.Item>) : (<></>)
        }
        {
          configInfo.delivery_way === 1 ? (
            <Form.Item label="内容筛选时间">
              { getFieldDecorator('posting_time', { 
                  initialValue: configInfo.posting_time,
                  rules: [{
                    required: true
                  }]
                })
                (<Radio.Group options={timeTypes} disabled={inputDisabled}/>)
              }
            </Form.Item>
          ) : (
            <Form.Item label="发文时间">
              { getFieldDecorator('posting_time', { 
                  initialValue: configInfo.posting_time,
                  rules: [{
                    required: true
                  }]
                })
                (<Radio.Group options={taskTimeTypes} disabled={inputDisabled}/>)
              }
            </Form.Item>
          )
        }
        { configInfo.delivery_way === 1 ? (
            <p className="label-title">内容量设置:</p>
          ) : (<></>)
        }
        { 
          configInfo.account_way !== 1 && 
          configInfo.delivery_config.map((item: any, index:number) => {
            return <ConfigItem 
                    index={index+1} 
                    siteList={siteList} 
                    item={item} 
                    type={detailType}
                    taskType={configInfo.delivery_way}
                    platForm={configInfo.platform_store}
                    key={`item${index+1}`}
                    deleteItem={deleteItem}
                    selectSiteType={selectSiteType}
                    selectContentType={selectContentType}
                    changeContentScore={changeContentScore}
                    selectHotType={selectHotType}
                    selectCategory={selectCategory}
                    changeCountAll={changeCountAll}
                   ></ConfigItem>
          })
        }
        
        { configInfo.account_way !== 1 && 
          <Form.Item className="add-btn">
            <Button type="primary" disabled={inputDisabled} onClick={addConfig}>新增</Button>
          </Form.Item>
        }
        
        <div className="form-title">过滤内容</div>
        <Form.Item label="过滤以下关键词">
          { getFieldDecorator('filter_word', {
              initialValue: configInfo.filter_word
            })(<TextArea placeholder="请输入关键词,用逗号隔开" rows={4} style={formItemLayout} disabled={inputDisabled}/>)
          }
        </Form.Item>
        <Form.Item label="过滤以下账号">
          { getFieldDecorator('filter_account', {
              initialValue: configInfo.filter_account
            })(<TextArea placeholder="请输入关键词,用逗号隔开" rows={4} style={formItemLayout} disabled={inputDisabled}/>)
          }
        </Form.Item>
        <div className="form-title">导入账号</div>
        <Form.Item label="导入账号">
          {getFieldDecorator('import_account', { 
            initialValue: configInfo.import_account,
            rules: [{
              required: true
            }]
          })(<Radio.Group options={accountTypes} disabled={inputDisabled} />)}
        </Form.Item>
        <Form.Item label="导入关系">
          {getFieldDecorator('import_relationship', { 
            initialValue: configInfo.import_relationship,
            rules: [{
              required: true
            }]
          })(<Radio.Group options={importRelationship} disabled={inputDisabled} onChange={changeRelationship}/>)}
        </Form.Item>
        <Form.Item label="账号表" className="form-table">
          {getFieldDecorator('account_address', { 
            initialValue: configInfo.account_address,
            rules: [{
              required: true,
              message: '账号表不能为空'
            }]
          })(
          <div className="upload-area">
            <Upload {...uploadProps} fileList={fileList}>
              <Button disabled={inputDisabled}>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={!rightFile}
              loading={uploading}
              style={{ marginLeft: 10, marginTop: 4 }}
            > 
              {uploading ? '上传中...' : '开始上传'}
            </Button>
            <Button
              type="link"
              onClick={downloadFile}
              style={{ marginLeft: 10, marginTop: 4 }}
              > 
              下载模板
            </Button>
          </div> 
        )}
        </Form.Item>
        <div className="form-title">输出方</div>
        <Form.Item label="输出APP">
          {getFieldDecorator('export_app', { 
            initialValue: configInfo.export_app,
            rules: [{
              required: true,
              message: '请选择输出APP'
            }]
          })(
          <Select placeholder="请选择输出APP" onChange={selectExportApp} style={formItemLayout} disabled={inputDisabled}>
          {
            exportAppList.map((item: any, index:number) => {
              return <Select.Option value={item.export_app_id} key={index}>{item.export_app_name}</Select.Option>
            })
          }
          </Select>)}
        </Form.Item>
        {/* <Form.Item label="输出bucket">
          {getFieldDecorator('export_bucket', {
            initialValue: configInfo.export_bucket,
            rules: [{
              required: true,
              message: '请输入输出bucket'
            }]
          })(<Input placeholder="主端A实验" style={formItemLayout} disabled={inputDisabled}/>)}
        </Form.Item> */}
        <Form.Item className="wrap">
          <div className="wrap-bottom">
            <Button type="primary" onClick={saveTask} disabled={inputDisabled}>
              { detailType === 'edit' ? '修改' : '保存' }
            </Button>
            <Button onClick={cancelClick} className="cancel">取消</Button>
          </div>
        </Form.Item>
      </Form>
      
    </div>
  )
}

export default connect(({ user }: ConnectState) => ({
  user
}))(Form.create()(createPutConfig));