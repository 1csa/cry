import React, { useEffect } from 'react';
import moment from 'moment';

import { Button, Row, Col } from 'antd';
import { Formik } from 'formik';
import { Form, FormItem, Select, DatePicker, Input, Radio } from 'formik-antd';

import { parseradio, parseselect } from '@/utils';
import { comp_hotpot_map, comp_app_map, comp_sortway_map, comp_status_map } from '@/data';

import { SearchProps } from '@/config/competitor/competitor';
import { defaultSearch } from '@/config/competitor/competitor.config';

interface ScreenForm {
  screen: SearchProps;
  onConfirm: (screens: SearchProps) => void;
}

export const ScreenForm: React.FC<ScreenForm> = React.memo(({ screen, onConfirm }) => {
  return (
    <Formik initialValues={screen} enableReinitialize onSubmit={values => onConfirm(values)}>
      <Form className="competitor-screen" labelAlign="left" colon={false} labelCol={{ xxl: 4, xl: 6 }} wrapperCol={{ xxl: 20, xl: 18 }}>
        <Row gutter={8}>
          <Col span={6}>
            <FormItem name="date" label="推送时间">
              <DatePicker.RangePicker
                name="date"
                showTime={{ format: 'HH:mm:ss' }}
                ranges={{
                  最近1天: [moment().subtract(1, 'days'), moment()],
                  最近3天: [moment().subtract(3, 'days'), moment()],
                  最近7天: [moment().subtract(7, 'days'), moment()],
                  最近15天: [moment().subtract(15, 'days'), moment()],
                  最近30天: [moment().subtract(30, 'days'), moment()],
                }}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem name="app_name" label="客户端">
              <Select name="app_name" mode="multiple" allowClear maxTagCount={1}>
                {parseselect(comp_app_map)}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem name="hotspot" label="热点类型">
              <Select name="hotspot" allowClear>
                {parseselect(comp_hotpot_map)}
              </Select>
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem name="pub_status" label="状态">
              <Select name="pub_status" allowClear>
                {parseselect(comp_status_map)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <FormItem name="kws" label="关键词">
              <Input name="kws" placeholder="请输入关键词" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem name="device_id" label="设备号">
              <Input name="device_id" placeholder="请输入 IMEI" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem name="order" label="排序方式">
              <Radio.Group name="order">{parseradio(comp_sortway_map)}</Radio.Group>
            </FormItem>
          </Col>
          <Col span={6}>
            <Button className="competitor-screen-op" size="small" type="primary" icon="search" htmlType="submit">
              筛 选
            </Button>
          </Col>
        </Row>
      </Form>
    </Formik>
  );
});
