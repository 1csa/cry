import React, { FC, useCallback, useState, useEffect } from 'react';
import { Card, Affix, Form, Button, DatePicker, message, Table } from 'antd';
import moment from 'moment';
import { handleAuditDate } from '@/utils/util';
import Axios from 'axios';
import { FAKE_NEWS_STATICS } from '@/config/constant';

const column = [{
  title: '来源',
  dataIndex: 'from'
},{
  title: '主文章总数',
  dataIndex: 'mainTotal'
},{
  title: '主文章通过数',
  dataIndex: 'mainPass',
},
{
  title: '主文章不推荐数',
  dataIndex: 'mainNotReco',
},{
  title: '主文章删除数',
  dataIndex: 'mainDel',
}, {
  title: '相似文章总数',
  dataIndex: 'simTotal',
},
{
  title: '相似文章通过数',
  dataIndex: 'simPass',
},
{
  title: '相似文章不推荐数',
  dataIndex: 'simNotReco',
},{
  title: '相似文章删除数',
  dataIndex: 'simDel',
}];

const FakeNewsStatics: FC = () => {
  const end = moment().subtract(1, "day");
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<any[]>();
  const [date, setDate] = useState(handleAuditDate(end, 'YYYYMMDD'));
  const [search, setSearch] = useState(false);
  const handleAuditChange = (date: any, dateString: string) => {
    setDate(dateString.replace(/-/g,''));
  };
  useEffect(() =>{
    getStatics();
  }, [search])
  const getStatics = async () => {
    const {data} = await Axios.get(FAKE_NEWS_STATICS, {
      params: {
        date,
        statics_type: 'fake_news'
      }
    });
    if(data.code === 0 || data.status === 'success'){
      if(data.result){
        const {auto_nums, manual_nums} = data.result;
        setCount(data.total || 0);
        const temp = [];
        temp.push(Object.assign(auto_nums, {from: '评论召回'}));
        temp.push(Object.assign(manual_nums, {from: '手动添加'}));
        setResult(temp);
      } else {
        setCount(0);
        setResult([]);
      }
    }else{
      message.error(`统计数据获取失败,${'原因: '+ data.reason ? data.reason : ''}`);
    }
  }
  const onSearch = () => {
    setSearch(!search);
  }
  return (
    <div className="main-content">
      <Card bordered={false} style={{ minHeight: 380 }}>
        <Affix offsetTop={0}>
          <div className="affix-header">
            <Form layout="inline">
              <Form.Item label="审核时间">
                <DatePicker
                  onChange={handleAuditChange}
                  placeholder="默认为前一日数据"
                  size="small"
                />&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={onSearch} size="small">搜索</Button>
              </Form.Item>
            </Form>
            <div>
              总文章篇数{ count }篇
            </div>
          </div>
        </Affix>
        <Table
          columns={column}
          dataSource={result}
          rowKey="from"
        />
      </Card>
    </div>
  );
}

export default FakeNewsStatics;
