import React, { useState } from 'react';

import { Form, Modal, Tag, DatePicker, Tooltip, Icon, Row, Col } from 'antd';
import { getRuleRatioData } from "@/services/filterRules";
// import type {RangePickerProps}  from 'antd/es/date-picker';
import ScaleLine from './scaleLine';
import './index.less'
import moment from 'moment';
const ScaleModal = ({ form, row }: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [scaleValue, setScaleValue] = useState<any>([])
  const [startTime, setStartTime] = useState<any>(moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD HH:mm'))
  // const [startTimes, setStartTimes] = useState<any>(moment(new Date()).subtract(31, 'days').format('YYYY-MM-DD'))
  const [endTime, setEndTime] = useState<any>(moment(new Date()).subtract(0, 'days').format('YYYY-MM-DD HH:mm'))
  const { getFieldDecorator } = form;
  const { RangePicker } = DatePicker;
 
  const handleClose = () => {
    setVisible(false);
  };
  //   //将数据重新的组合一遍
  // const handleValue = (value:any)=>{
  //   let arr:any =[]
  //   value.map((item:any)=>{
  //     arr.push(item)
  //     })
  //     arr.sort(NumAscSort('time'))
  //     // data = data.reverse()
  //     arr.map((item:any)=>{
  //     item.time = moment(Number(item.time)).format('YYYY-MM-DD HH:mm')
  //   })
  //   return arr
  // }
  const getRuleRatioDataList =async(startTime:any,endTime:any)=>{
    let data = {
      primaryId:row.primaryId,
      startTime:new Date(startTime).getTime(),
      endTime:new Date(endTime).getTime(),
      type: 0
    }
     const res:any = await getRuleRatioData(data)
    if(res.success === true){
      res.data.ratioDataList.sort(NumAscSort('time'))
      res.data.ratioDataList.map(((item:any)=>{
        item.time = moment(Number(item.time)).format('YYYY-MM-DD HH:mm')
      }))
     setScaleValue(res.data.ratioDataList)
    }
  }
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
  const handleDateChange = (dates:any, dateStrings:any)=>{
    if (dates) {
        setStartTime(dateStrings[0])
        setEndTime(dateStrings[1])
        getRuleRatioDataList(dateStrings[0],dateStrings[1])
    }
  }
  const handleClick = ()=>{
    getRuleRatioDataList(startTime,endTime)
    setVisible(true)
  }
  return (
    <>
      <a onClick={handleClick}>{`${row.kvPreFilterRatio} / ${row.kvRecallFilterRatio}`}</a>
      <Modal visible={visible} onCancel={handleClose} footer={''} width='65%'>
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
          // onOk={onOk}
        />
        
        <div style={{marginTop:40}}>
          <div className='title'><strong>{row.ruleName}</strong></div>
          <ScaleLine values={scaleValue} ></ScaleLine>
        </div>
      </Modal>
    </>
  );
};
export default Form.create()(ScaleModal);