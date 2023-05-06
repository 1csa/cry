import React, { useState, useEffect } from 'react';
import { Modal, Form, Tag, Divider, Typography, Tooltip, Icon, Row, Col } from 'antd';
interface DetailModelProps {
  form: any;
  row: any;
}

const DetailModel: React.FC<DetailModelProps> = ({ form, row }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleCancel = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Tag
        color="#108ee9"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setVisible(!visible);
        }}
      >
        详情
      </Tag>
      <Modal visible={visible} onCancel={handleCancel} footer={[]} width="600px">
        <Form layout="inline">
          <div>
            <h4>基本信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="type:">
                <strong>{row.type}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="中文名:">
                <strong>{row.cnName}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="负责人:">
                <strong>{row.owners[0]}</strong>
              </Form.Item>
            </Col>
          </Row>
          <div>
            <h4>业务信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="factor:">
                <strong>{row.factor}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="端:">
                <strong>{row.app}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="场景:">
                <strong>{row.scene}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="数据类型:">
                <strong>{row.dataType}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="流量状态:">
                <strong>{row.flowStatus}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="重要等级:">
                <strong>{row.level}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
             <Col span={24} push={1}>
              <Form.Item label="注册时间:">
                <strong>{row.createTime}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="描述:">
                <strong>{row.description}</strong>
              </Form.Item>
            </Col>
          </Row>
          
          <div>
            <h4>性能信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="factor性能状态:">
                <strong>{row.totalPerformanceColor}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="factor qps:">
                <strong>{row.totalQps}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="type性能状态:">
                <strong>{row.performanceColor}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="type qps:">
                <strong>{row.qps}</strong>
              </Form.Item>
            </Col>
          </Row>
          <div>
            <h4>构建信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="数据量:">
                <strong>{row.dataNum}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="构建状态:">
                <strong>{row.buildStatus}</strong>
              </Form.Item>
            </Col>
            <Row>
              <Col span={11} push={1}>
                <Form.Item label="构建间隔:">
                  <strong>{row.buildGap}</strong>
                </Form.Item>
              </Col>
              <Col span={13} push={1}>
                <Form.Item label="构建耗时:">
                  <strong>{row.buildLatency}</strong>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11} push={1}>
                <Form.Item label="构建成功数:">
                  <strong>{row.buildSuccessCount}</strong>
                </Form.Item>
              </Col>
              <Col span={13} push={1}>
                <Form.Item label="上次构建成功:">
                  <strong>{row.completeTime}</strong>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11} push={1}>
                <Form.Item label="机器数量:">
                  <strong>{row.machineNum}</strong>
                </Form.Item>
              </Col>
            </Row>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(DetailModel);
