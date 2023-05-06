import React, { FC, useState } from 'react';
import { Col, Form, Modal, Popover, Row, Table, Tag } from 'antd';
import { getFilterDebugDetail } from '@/services/filterRules';
import BarChart from './barChart';
import '../index.less';
import moment from 'moment';
import { Item } from '@antv/xflow-extension/es/flowchart-editor-panel/control-map-service/components/fields/position';
interface DetailsModalProps {
  row: any;
  form: any;
}
const content = (text:any)=>{
    return (
         <div>
          <p>{text}</p>
         </div>
    )
  }
const DetailsModal: FC<DetailsModalProps> = ({ row }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [debugDetailList, setDebugDetailList] = useState<any>({});
  const handleDetail = async () => {
    let data = {
      taskId: row.primaryId,
      taskStartTime: moment(row.startTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    const res: any = await getFilterDebugDetail(data);
    if ((res.success = true)) {
      setDebugDetailList({ ...res.data });
    }
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleOutput =(text:any)=>{
    console.log(text);
    
  }
  const columns: any = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      align: 'center',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'filterType',
      key: 'filterType',
      align: 'center',
      width: 100,
    },
    {
      title: '规则说明',
      dataIndex: 'ruleDescription',
      key: 'ruleDescription',
      align: 'center',
      width: 150,
    },
    {
      title: '比率(千分比)',
      dataIndex: 'filterRatio',
      key: 'filterRatio',
      align: 'center',
      width: 80,
    },
    {
      title: 'caseDoc',
      dataIndex: 'caseDocList',
      key: 'caseDocList',
      align: 'center',
      width: 80,
      render:(text:any)=>{
        return (
        <Popover content={ 
         <div style={{width:490,overflowWrap: "anywhere"}}>
          {text.join(`, `)}
         </div>
        }  trigger="click">
          <p className='overflow' >{text.join(',')}</p>
        </Popover>
        )
        
        
      }
    },
  ];
  return (
    <>
      <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={handleDetail}>
        查看
      </Tag>
      <Modal visible={visible} onCancel={handleClose} width="80vw" footer={''}>
        <Form layout="inline">
          <div style={{ width: '75vw', marginLeft: '5vw' }}>
            <Row>
              <Col style={{ textAlign: 'center' }}>
                <h2>任务详情</h2>
              </Col>
            </Row>
            <Row style={{ marginTop: 20, marginLeft: 20 }}>
              {/* <Col span={4}>
                <Form.Item label="任务编号">1</Form.Item>
              </Col> */}
              <Col span={4}>
                <Form.Item label="过滤端">{row.appIdGroup}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="过滤场景">{row.scene}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="内容类型">{row.dataType}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="文章源类型">{row.sourceType}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="源名称">{row.sourceName}</Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 30, marginLeft: 20 }}>
              <Col span={4}>
                <Form.Item label="文章总数">{row.totalNum}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="执行过滤数量">{row.filterTotalNum}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="耗时(s)">{row.cost}</Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="总过滤千分比">{row.filterRatio}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="开始时间">{moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
              </Col>
            </Row>
          </div>
          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <span style={{ marginLeft: 40 }}>
                <strong>过滤比率top5:</strong>
              </span>
            </Col>
          </Row>
          <Row>
            <Col className="BarChart">
              <BarChart value={debugDetailList}></BarChart>
            </Col>
          </Row>
          <Row style={{ marginTop: 30, marginLeft: 20 }}>
            <div className='tableTd'>
               <Table columns={columns} dataSource={debugDetailList.filterDebugTaskDetails}></Table>
            </div>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default DetailsModal;
