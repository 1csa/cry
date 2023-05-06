import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { Input, Checkbox, Button, Tag, Select, Row, Col } from 'antd';
import { getKibanaData } from '../../services/log.service';
import './index.less';

interface ILogsItemProps {
  data: object;
}

const LogsItem: React.FC<ILogsItemProps> = ({ data }) => {
  useEffect(() => {
    let params = {};
    getKibanaData(params);
  }, []);
  return (
    <Row className="logsItem">
      <Col span={3} className="col">
        2021-03-18 00:00:00
      </Col>
      <Col span={2} className="col">
        操作人
      </Col>
      <Col span={2} className="col">
        0Q99yEhJ
      </Col>
      <Col span={2} className="col">
        0Q99yEhJ 122
      </Col>
      <Col span={2} className="col">
        0Q99yEhJ 212
      </Col>
      <Col span={4} className="col">
        0Q99yEhJ 3即 第二瓶 汽车 七册弟弟
      </Col>
    </Row>
  );
};

export default LogsItem;
