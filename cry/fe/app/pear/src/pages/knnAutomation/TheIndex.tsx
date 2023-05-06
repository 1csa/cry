import React, { useState, useEffect } from 'react';

import { Card, Tag } from 'antd';

import Library from '../../components/TheOverview/library';
import DateBuild from '../../components/TheOverview/dateBuild';
import Service from '../../components/TheOverview/service';
import Machine from '../../components/TheOverview/machine';
import { getAutomation } from '../../services/knnAutomation';

import './index.less';

const TheIndex = () => {
  const [data, setData] = useState<any>([]);
  const [buildNumList, setBuildNumList] = useState<any>([]);
  useEffect(() => {
    handGetList();
  }, []);
  const handGetList = async () => {
    let res = await getAutomation({});
    if ((res.success = true)) {
      setBuildNumList(res.data.buildNumList);
      setData(res.data.dataNum);
    }
  };
  return (
    <div className="TheIndex">
      <Card bordered={false} className="TheIndex-Card">
        <div className="TheIndex-charts">
          <div>
            <Library data={data} />
            <h4>
              <Tag color="#108ee9">库量</Tag>
            </h4>
          </div>
          <div style={{ marginTop: 15 }}>
            <DateBuild data={buildNumList} />
            <h4>
              <Tag color="#108ee9">最近一天建库</Tag>
            </h4>
          </div>
        </div>
        <div className="TheIndex-charts1">
          <div>
            <Service />
            <h4>
              <Tag color="#108ee9">服务性能</Tag>
            </h4>
          </div>
          <div>
            <Machine />
            <h4>
              <Tag color="#108ee9">机器性能量</Tag>
            </h4>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TheIndex;
