import React, { useState, ReactNode, ChangeEvent, useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import { SubmitButton, Checkbox, ResetButton, FormikDebug, Form, FormItem } from 'formik-antd';
import { message, Button, Row, Col, Select, Input, DatePicker, Divider } from 'antd';
import LogsItem from '../../components/LogsItem';
import './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

function validateRequired(value: string) {
  return value ? undefined : 'required';
}

const ChannelLog = () => {
  // render tag options
  const renderTagOptions = useCallback(
    (): ReactNode =>
      Object.entries({}).map(([key, value]) => (
        <Option key={key} value={key}>
          {/* {value} */}
        </Option>
      )),
    [],
  );
  const handleUpdateSelectValue = (key: string, val: string | Array<string>): void => {
    // const tempDoc = { ...doc };
    // tempDoc[key] = val;
    // updateTopItem(index, tempDoc);
  };

  const handleResetOrder = () => {};

  const onChangeTime = () => {};

  const handleSearch = () => {};

  const mock = [
    { docid: '0PQJvynO', editorEventLevel: 'eventL3', last_update_ts: 1615893646881 },
    { docid: '0Q99yEhJ', group: '1' },
    { docid: '0Q99jsF0', group: '1' },
    { docid: '0Q992111', count: '1' },
  ];

  const renderItem = () => {
    return mock.map((item, index) => (
      <LogsItem
        data={item}
      />

    ))
  }

  return (
    <div>
      {/* <Row style={{ margin: '20px' }} justify="center" align="middle" wrap={false}>
        <Col span={4} className="col1" flex={2}>
          <div className="menuTitle">频道:</div>
          <Select
            className="top-item-op-select"
            style={{ width: 140 }}
            size="small"
            // defaultValue={}
            onChange={(val: string) => handleUpdateSelectValue('tag', val)}
            placeholder=""
          >
            {renderTagOptions()}
          </Select>
        </Col>
        <Col span={4} className="col1" flex={2}>
          <div className="menuTitle">docid:</div>
          <Input
            className="top-item-op-input"
            style={{ width: 140 }}
            size="small"
            placeholder="请输入docid"
            onPressEnter={handleResetOrder}
          />
        </Col>
        <Col span={4} className="col1" flex={2}>
          <div className="menuTitle">操作人:</div>
          <Input
            className="top-item-op-input"
            style={{ width: 140 }}
            size="small"
            placeholder="请输入操作人"
            onPressEnter={handleResetOrder}
          />
        </Col>
        <Col span={6} className="col1" flex={3}>
          <div className="menuTitle">保存时间:</div>
          <RangePicker
            onChange={onChangeTime}
            placeholder={['开始时间', '结束时间']}
            format="YYYY-MM-DD"
          />
        </Col>
        <Col span={3} className="col1" flex={2}>
          <Button type="primary" size="small" onClick={handleSearch}>
            搜索
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row
        style={{ margin: '50px', backgroundColor: '#BFBFBF', padding: '20px' }}
        justify="space-around"
        align="middle"
        wrap={false}
      >
        <Col span={3} className="col2">
          保存时间
        </Col>
        <Col span={2} className="col2">
          操作人
        </Col>
        <Col span={2} className="col2">
          操作排序
        </Col>
        <Col span={2} className="col2">
          强置顶
        </Col>
        <Col span={2} className="col2">
          轮播
        </Col>
        <Col span={4} className="col2">
          热点
        </Col>
      </Row>
      {renderItem()} */}
    </div>
  );
};

export default ChannelLog;
