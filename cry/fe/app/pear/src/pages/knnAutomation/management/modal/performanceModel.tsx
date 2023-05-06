import React, { useState, useEffect } from 'react';
import { Modal, Form, Tag, Divider, Typography, Tooltip, Icon, Row, Col } from 'antd';

interface PerformanceModelProps {
  form: any;
  visible: boolean;
  value: any;
  rowData: any;
  successCallback: () => void;
  flag: string;
}

const PerformanceModel: React.FC<PerformanceModelProps> = ({ form, value, successCallback, visible, rowData, flag }) => {
  const { Title } = Typography;
   
  const statusSet = {
    RED: '#c00',
    GREEN: '#87d068',
    YELLOW: '#E48B16',
  };
  const handleOk = () => {
    successCallback();
  };
  const handleCancel = () => {
    successCallback();
  };
  const dataNumConvert = (num: number) => {
    if (num>100000) {
      return `${(num / 10000).toFixed(0)}w`
    }else {
      return num > 10000 ? `${(num / 10000).toFixed(1)}w` : num;
    }
    // return num > 10000 ? `${(num / 10000).toFixed(1)}w` : num;
  };
  const URL = 'http://mon.yidian-inc.com/d/O5cJu3IVk/knn-service-xin-zhi-biao-jian-kong?';

  // const ss = ()=>{
  //   qps: `${URL}orgId=1&from=now-3h&to=now&var-factor=model2news-ks&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=2`,
  //   异常率: `${URL}orgId=1&from=now-3h&to=now&var-factor=model2news-ks&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=3`,
  //   耗时: `${URL}orgId=1&from=now-3h&to=now&var-factor=model2news-ks&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=4`,
  //   空结果率: `${URL}orgId=1&from=now-3h&to=now&var-factor=model2news-ks&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=5`,
  //   召回量: `${URL}orgId=1&from=now-3h&to=now&var-factor=model2news-ks&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=5`,
  //   机器指标: `http://mon.yidian-inc.com/d/sync-axe2047/zhu-ji-jian-kong-yidian-serving-index-knn-operator-prod?orgId=1&from=now-3h&to=now`,
  //   库量: `${URL}orgId=1&from=now-3h&to=now&var-factor=*&var-type=graph-vb-strict-news&var-appIdGroup=*&var-scene=*&var-dataType=*&fullscreen&panelId=8`,
  // };
  const URLFactor = (factor: any, type: any, num: number, time: string, dataType: string, app: any) => {
    if (app === 'b' || app === 'yidianb') {
      let url = `${URL}orgId=1&from=now-${time}&to=now&var-factor=${factor}&var-type=${type}&var-appIdGroup=*&var-scene=*&var-dataType=${dataType}`;
      return url;
    } else {
      let url = `${URL}orgId=1&from=now-${time}&to=now&var-factor=${factor}&var-type=${type}&var-appIdGroup=${app}&var-scene=*&var-dataType=${dataType}`;
      return url;
    }
  };
  const machineScore = `http://mon.yidian-inc.com/d/sync-axe2047/zhu-ji-jian-kong-yidian-serving-index-knn-operator-prod?orgId=1&from=now-3h&to=now`;
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
      title={
        <h4 style={{ marginBottom: 0 }}>
          {'性能指标'} {rowData.factor} / {rowData.app}-{rowData.scene}-{rowData.dataType} {flag === 'factor' ? '' : `/ ${rowData.type}`}
        </h4>
      }
      width={850}
    >
      <div className="BusinessThreshold">
        <Title level={4} style={{ marginLeft: '5%' }}>
          业务阀值
        </Title>
        <Form>
          <Form.Item label="查询耗时">
            {value.earlyIndicator && (
              <a
                href={
                  flag === 'factor'
                    ? URLFactor(rowData.factor, '*', 4, '3h', rowData.dataType, rowData.app)
                    : URLFactor(rowData.factor, rowData.type, 4, '3h', rowData.dataType, rowData.app)
                }
                target="_blank"
              >
                <Tag color={statusSet[value.volatilityColor.businessLatencyColor]} className="tagclass" style={{ width: 150 }}>
                  {value.earlyIndicator.latency}/{value.businessThreshold.businessExpectLatency}
                </Tag>
              </a>
            )}
          </Form.Item>
          <Form.Item label="异常率">
            {value.earlyIndicator && (
              <a
                href={
                  flag === 'factor'
                    ? URLFactor(rowData.factor, '*', 3, '3h', rowData.dataType, rowData.app)
                    : URLFactor(rowData.factor, rowData.type, 3, '3h', rowData.dataType, rowData.app)
                }
                target="_blank"
              >
                <Tag color={statusSet[value.volatilityColor.businessExceptionRatioColor]} className="tagclass" style={{ width: 150 }}>
                  {value.earlyIndicator.exceptionRatio}/{value.businessThreshold.businessExpectExceptionRatio}
                </Tag>
              </a>
            )}
          </Form.Item>
          <Form.Item label="空结果率">
            {value.earlyIndicator && (
              <a
                href={
                  flag === 'factor'
                    ? URLFactor(rowData.factor, '*', 5, '3h', rowData.dataType, rowData.app)
                    : URLFactor(rowData.factor, rowData.type, 5, '3h', rowData.dataType, rowData.app)
                }
                target="_blank"
              >
                <Tag color={statusSet[value.volatilityColor.businessEmptyRatioColor]} className="tagclass" style={{ width: 150 }}>
                  {value.earlyIndicator.emptyRatio}/{value.businessThreshold.businessExpectEmptyRatio}
                </Tag>
              </a>
            )}
          </Form.Item>
          <Row style={{ marginTop: 70 }}>
            <Col span={24} push={4}>
              <Form.Item label="指标值说明: "> 近1h/注册配置预期值</Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="ServiceFluctuation">
        <Title level={4} style={{ marginLeft: '5%' }}>
          服务波动
        </Title>
        <Form>
          <Row>
            <Col span={11}>
              <Form.Item label="查询耗时">
                {value.earlyIndicator && (
                  <a
                    href={
                      flag === 'factor'
                        ? URLFactor(rowData.factor, '*', 4, '7d', rowData.dataType, rowData.app)
                        : URLFactor(rowData.factor, rowData.type, 4, '7d', rowData.dataType, rowData.app)
                    }
                    target="_blank"
                  >
                    <Tag color={statusSet[value.volatilityColor.latencyColor]} className="tagclass" style={{ width: 148 }}>
                      {value.earlyIndicator.latency}/{value.earlierIndicator.latency}/{value.earliestIndicator.latency}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="异常率">
                {value.earlyIndicator && (
                  <a
                    href={
                      flag === 'factor'
                        ? URLFactor(rowData.factor, '*', 3, '7d', rowData.dataType, rowData.app)
                        : URLFactor(rowData.factor, rowData.type, 3, '7d', rowData.dataType, rowData.app)
                    }
                    target="_blank"
                  >
                    <Tag color={statusSet[value.volatilityColor.exceptionRatioColor]} className="tagclass" style={{ width: 148 }}>
                      {value.earlyIndicator.exceptionRatio}/{value.earlierIndicator.exceptionRatio}/{value.earliestIndicator.exceptionRatio}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="空结果率">
                {value.earlyIndicator && (
                  <a
                    href={
                      flag === 'factor'
                        ? URLFactor(rowData.factor, '*', 5, '7d', rowData.dataType, rowData.app)
                        : URLFactor(rowData.factor, rowData.type, 5, '7d', rowData.dataType, rowData.app)
                    }
                    target="_blank"
                  >
                    <Tag color={statusSet[value.volatilityColor.emptyRatioColor]} className="tagclass" style={{ width: 148 }}>
                      {value.earlyIndicator.emptyRatio}/{value.earlierIndicator.emptyRatio}/{value.earliestIndicator.emptyRatio}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="机器评分">
                {value.earlyIndicator && (
                  <a href={machineScore} target="_blank">
                    <Tag color={statusSet[value.volatilityColor.machineColor]} className="tagclass" style={{ width: 148 }}>
                      {value.earlyIndicator.machineScore}/{value.earlierIndicator.machineScore}/{value.earliestIndicator.machineScore}
                    </Tag>
                  </a>
                )}
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item label="QPS">
                {value.earlyIndicator && (
                  <a
                    href={
                      flag === 'factor'
                        ? URLFactor(rowData.factor, '*', 2, '7d', rowData.dataType, rowData.app)
                        : URLFactor(rowData.factor, rowData.type, 2, '7d', rowData.dataType, rowData.app)
                    }
                    target="_blank"
                  >
                    <Tag color={statusSet[value.volatilityColor.qpsColor]} className="tagclass" style={{ width: 175 }}>
                      {value.earlyIndicator.qps}/{value.earlierIndicator.qps}/{value.earliestIndicator.qps}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="召回量">
                {value.earliestIndicator && (
                  <a
                    href={
                      flag === 'factor'
                        ? URLFactor(rowData.factor, '*', 6, '7d', rowData.dataType, rowData.app)
                        : URLFactor(rowData.factor, rowData.type, 6, '7d', rowData.dataType, rowData.app)
                    }
                    target="_blank"
                  >
                    <Tag color={statusSet[value.volatilityColor.recallSizeColor]} className="tagclass" style={{ width: 175 }}>
                      {value.earlyIndicator.recallSize}/{value.earlierIndicator.recallSize}/
                      {value.earliestIndicator.recallSize}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="日均库量">
                {value.earlyIndicator && (
                  <a href={URLFactor(rowData.factor, rowData.type, 8, '7d', rowData.dataType, rowData.app)} target="_blank">
                    <Tag color={statusSet[value.volatilityColor.dataNumColor]} className="tagclass" style={{ width: 175 }}>
                      { dataNumConvert(value.earlyIndicator.dataNum)}/{dataNumConvert(value.earlierIndicator.dataNum)}/{dataNumConvert(value.earliestIndicator.dataNum)}
                    </Tag>
                  </a>
                )}
              </Form.Item>
              <Form.Item label="构建次数">
                {value.earlyIndicator && (
                  <a href={URLFactor(rowData.factor, rowData.type, 8, '7d', rowData.dataType, rowData.app)} target="_blank">
                    <Tag color={statusSet[value.volatilityColor.buildCountColor]} className="tagclass" style={{ width: 175 }}>
                      {value.earlyIndicator.buildCount}/{value.earlierIndicator.buildCount}/{value.earliestIndicator.buildCount}
                    </Tag>
                  </a>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 50 }}>
            <Col span={24} push={6}>
              <Form.Item label="指标值说明:">近1h/近3d同比1h/上周3d同比1h</Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};
export default Form.create()(PerformanceModel);
