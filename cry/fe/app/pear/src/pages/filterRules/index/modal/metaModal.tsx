import React, { useState } from 'react';

import { Button, Form, Modal, Select, Tag ,DatePicker, Tooltip, Icon, message} from 'antd';
import { SearchContentType } from '@/config/list.config';
import { getMetaRatioData } from "@/services/filterRules";
import { SearchApp, SearchScene } from '@/config/list.config';

import MetaLine from "./metaLine";
import moment from 'moment';
const MetaModal = ({ form, row,propsForm }: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [metaValue, setMetaValue] = useState<any>([])
  const [filterStage, setFilterStage] = useState<any>('kvPreFilterRatio')
  const [startTime, setStartTime] = useState<any>(moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD HH:mm'))
  // const [startTimes, setStartTimes] = useState<any>(moment(new Date()).subtract(31, 'days').format('YYYY-MM-DD'))
  const [endTime, setEndTime] = useState<any>(moment(new Date()).subtract(0, 'days').format('YYYY-MM-DD HH:mm'))
  const { getFieldDecorator ,validateFields} = propsForm;
  const {RangePicker} = DatePicker
  const handleClose = () => {
    setMetaValue([])
    setVisible(false);
    // setFilterStage('kvPreFilterRatio')
    propsForm.setFieldsValue({'filterStage':'kvPreFilterRatio'})
  };
  const handleDateChange  = (dates:any, dateStrings:any)=>{
    if (dates) {
        setStartTime(dateStrings[0])
        setEndTime(dateStrings[1])
        // console.log(dateStrings[0],dateStrings[1]);
        onhandleClick(dateStrings[0],dateStrings[1])
    }
   }
  const handClickMeta = (start:any,end:any)=>{
    propsForm.validateFields (async(errors: any, values: any) => {
      let startTime = new Date(start).getTime()
      let endTime = new Date(end).getTime()
      if (!errors) {
        if (values.scene !==undefined&& values.dataType!==undefined) {
              let data = {
                startTime,
                endTime,
                // ...values,
                dataType:values.dataType,
                scene:values.scene,
                appIdGroup:values.appIdGroup,
                filterStage:filterStage,
                type:0
              }
              const res:any = await getMetaRatioData(data)
              if (res.success) {
                  if (res.data) {
                    setMetaValue(handleValue(res.data))
                  }else{
                    message.error('返回的数据不存在！')
                  }
              }
               
          }else{
             message.warning('请选择端、场景、数据类型！')
          }
        setVisible(true)
      }
    });
   
  }
  // 按时间排序
  const  NumAscSort = (name:any)  =>{
    return function(o:any,p:any){  
    var a, b;  
    if (typeof o === "object" && typeof p === "object" && o && p) {  
      a = o[name];  
      b = p[name];  
      if (a === b) {  
        return 0;  
      }  
      if (typeof a === typeof b) {  
        return a < b ? -1 : 1;  
      }  
      return typeof a < typeof b ? -1 : 1;  
    }  
  }  
  }
  //将数据重新的组合一遍
  const handleValue = (value:any)=>{
    let arr:any =[]
    value.map((item:any)=>{
      arr.push(...item.ratioDataList)
      })
      arr.sort(NumAscSort('time'))
      // data = data.reverse()
      arr.map((item:any)=>{
      item.time = moment(Number(item.time)).format('YYYY-MM-DD HH:mm')
    })
    return arr
  }
  const onhandleClick =async (start:any,end:any)=>{
    let startTime = new Date(start).getTime()
    let endTime = new Date(end).getTime()
    validateFields (async(errors: any, values: any) => {
      if (!errors) {
        let data = {
          startTime,
          endTime,
          ...values,
          type:0
        }
        const res:any = await getMetaRatioData(data)
        if (res.success) {
          if (res.data) {
             setMetaValue(handleValue(res.data))
          }else{
            message.error('返回的数据不存在！')
          }
        }
      }
    });
  }
  const SearchType =[
    {
      value:'kvRecallFilterRatio',
      key:'kv召回过滤'
    },
      {
      value:'kvPreFilterRatio',
      key:'kv前置过滤'
    },
      {
      value:'knnRecallFilterRatio',
      key:'knn召回过滤'
    },
      {
      value:'knnPreFilterRatio',
      key:'knn前置过滤'
    },
      {
      value:'',
      key:'cb过滤'
    },
      {
      value:'',
      key:'aio过滤'
    },
      {
      value:'',
      key:'blender过滤'
    },
  ]
  return (
    <>
       <Button style={{ marginTop: 4, marginLeft: 20 }} type="primary"  onClick={()=>{
        handClickMeta(startTime,endTime)
       }}>
          场景比例
       </Button>
      <Modal visible={visible} onCancel={handleClose} footer={''} width='80%'>
        <Form layout='inline'>
           <Form.Item >
             <RangePicker
              defaultValue={[moment(startTime), moment(endTime)]}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              onChange={handleDateChange}
              allowClear={false}
              ranges={{
                '近3天': [moment().subtract(2, 'days'), moment()],
                '近一周': [moment().subtract(7, 'days'), moment()],
                '近两周': [moment().subtract(14, 'days'), moment()],
              }}
            />
           </Form.Item>
          <Form.Item>
            {getFieldDecorator('appIdGroup', {
              initialValue:'oppobrowser',
              // rules: [{ required: true, message: '端不能为空!', whitespace: true}],
            })(
              <Select style={{ width: 130 }} >
                {SearchApp.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('scene', {
              initialValue:'strict',
              // rules: [{ required: true, message: '场景不能为空!', whitespace: true}],
            })(
              <Select style={{ width: 130 }} >
                {SearchScene.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item  style={{ marginLeft: 8 }}>
              {getFieldDecorator('dataType', {
                initialValue: 'news',
                // rules: [{ required: true, message: '数据类型不能为空!', whitespace: true}],
              })(
                <Select style={{ width: 120 }} >
                  {SearchContentType.map(item => (
                    <Option value={item.value} key={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          <Form.Item  style={{ marginLeft: 8 }}>
              {getFieldDecorator('filterStage', {
                initialValue: filterStage,
              })(
                <Select style={{ width: 120 }} >
                  {SearchType.map(item => (
                    <Option value={item.value} key={item.key}>
                      {item.key}
                    </Option>
                  ))}
                </Select>,
              )}
          </Form.Item>
          <Form.Item  style={{ marginLeft: 8 }}>
          <Button style={{ marginTop: 4 }} type="primary" onClick={()=>{
            onhandleClick(startTime,endTime)
          }}>
            确定
          </Button>
          </Form.Item>
        </Form>
       <div style={{marginTop:50}}>
         <MetaLine value={metaValue}></MetaLine>
       </div>
      </Modal>
    </>
  );
};
export default MetaModal;
