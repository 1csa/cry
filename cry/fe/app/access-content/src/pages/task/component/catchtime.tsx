import React, { useState } from 'react';
import {
  Select, Row, Col
} from 'antd';
import {CATCH_TIME_CONFIG, CATCH_TIME_ITEM_NAME} from '../../../config/constant';
const {Option} = Select;
// 图文配置

interface CatchTimeProps{
  onChange?: (value: any) => void
  value?: any
}
const CatchTime: React.FC<CatchTimeProps> = ({onChange, value}) => {
  const handleSelectChange = (item: any, key?: any) => {
    var catchTime = Object.assign({}, value);
        catchTime[key] = + item;

    onChange && onChange(catchTime)
  }
  const getFields = (): any => {
    const children: Array<any> = [];
    Object.keys(CATCH_TIME_CONFIG).forEach((key: string) => {
      const OPTIONS = CATCH_TIME_CONFIG[key];
      // console.log(value);
      children.push(<Col span={8} key={key}>
        {CATCH_TIME_ITEM_NAME[key]} :&nbsp;
        <Select style={{width: 100}} value={value && value[key]} onChange={(value: any) => handleSelectChange(value, key)}>
          {OPTIONS.map((option: any) =>
          <Option key = {option} value={option}>
            {`${option}天`}
          </Option>)}
        </Select>
      </Col>);
    });
    return children;
  }
  return (<>
    <Row gutter={4}>
      {getFields()}
    </Row>
  </>);
}

export default CatchTime;
