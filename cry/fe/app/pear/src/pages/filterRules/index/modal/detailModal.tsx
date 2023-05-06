import React, { useState, useEffect } from 'react';
import { Modal, Form, Tag, Divider, Typography, Tooltip, Icon, Row, Col } from 'antd';
import './index.less'
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
            <h4>规则信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="规则名称:">
                <strong>{row.ruleName}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="运营工具规则id:">
                <strong>{row.opsToolRuleId}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} push={1}>
              <Form.Item label="规则类型:">
                <strong>{row.category}</strong>
              </Form.Item>
            </Col>
             <Col span={12} push={1}>
              <Form.Item label="是否下沉:">
                <strong>{row.sink?'是':'否'}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} push={1}>
              <Form.Item label="描述信息:">
                <strong>{row.description}</strong>
              </Form.Item>
            </Col>
          </Row>
          <div>
            <h4>生效端场景信息</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="端:">
                <strong>{row.appId}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="场景:">
                <strong>{row.scene}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="数据类型:">
                <strong>{row.dataType}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="频道id:">
                <strong>{row.fromId}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="appId:">
                <strong>{row.appId}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="fakeAppId:">
                <strong>{row.fakeAppId?row.fakeAppId:"空"}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="生效城市:">
                <strong>{row.cityList?row.cityList:"空"}</strong>
              </Form.Item>
            </Col>
             <Col span={13} push={1}>
              <Form.Item label="实验bucket:">
                <strong>{row.bucket?row.bucket:'空'}</strong>
              </Form.Item>
            </Col>
          </Row>
          <div>
            <h4>过滤比率信息（前一天，千分比）</h4>
            <p className="inLineBorder"></p>
          </div>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="kv前置过滤:">
                <strong>{row.kvPreFilterRatio}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="kv召回过滤:">
                <strong>{row.kvRecallFilterRatio}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="knn前置过滤:">
                <strong>{row.knnPreFilterRatio}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="knn召回过滤:">
                <strong>{row.knnRecallFilterRatio}</strong>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11} push={1}>
              <Form.Item label="cb过滤:">
                <strong>{row.onlineFilterRatio}</strong>
              </Form.Item>
            </Col>
            <Col span={13} push={1}>
              <Form.Item label="aio过滤:">
                <strong>{row.onlineFilterRatio}</strong>
              </Form.Item>
            </Col>
            <Row>
              <Col span={11} push={1}>
                <Form.Item label="blender过滤:">
                  <strong>{row.onlineFilterRatio}</strong>
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
