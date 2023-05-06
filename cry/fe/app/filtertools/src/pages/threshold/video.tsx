import React, { FC, useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  message,
  Collapse,
  Form,
  Input,
  Select,
  Modal,
  Icon,
  Button,
  Tooltip,
  InputNumber,
  Spin,
} from 'antd';
import request from '@/utils/request';
import axios from 'axios';
import AddThresholdForm from '@/components/Threshold/addForm';
import { FormItemLayout, TailFormItemLayout, ThresholdSelectCon, VideoThresholdlistName, LogInfo } from '@/config/constant';
import { getIsDev } from '@/utils/get_dev';
import { saveKibana, saveStaticLog } from '@/utils/log'


const isDev = getIsDev();
interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
}
const { TabPane } = Tabs;
const { Panel } = Collapse;

const NewsThreshold: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [threshold, setThreshold] = useState<any[]>([]);
  const [currenttab, setCurrenttab] = useState<string>(VideoThresholdlistName[0].key);
  const [adddrawervisible, setAdddrawervisible]  = useState<Boolean>(false);
  const [loading, setLoading]  = useState<Boolean>(true);

  useEffect(() =>{
    getAllNewsThreshold();
  },[])
  const getAllNewsThreshold  = async () => {
    const ret = await request.get(`/api/filtertools/getAllVideoThreshold?isdev=${isDev}`);
    if(ret.code === 0) {
      setThreshold(ret.data);
      setLoading(false);
    } else {
      message.error(`图文阈值获取失败，请刷新重试`);
      setThreshold([]);
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          title: 'Confirm',
          content: '确定保存吗？',
          okText: '确认',
          cancelText: '取消',
          onOk(){
            let newThreshold: React.SetStateAction<any[]> = [];
            newThreshold = newThreshold.concat(threshold);
            VideoThresholdlistName.map(item =>{
              newThreshold[0][item.key] = values[item.key]
              newThreshold[0][item.key].map( k => {
                k.level = `${parseInt(k.level)}级`
              })
            })
            submitAction(newThreshold);
          } ,
        });
      }
    });
  }
  const addNewBtn = () => (
    <Button type="primary" icon="file-add" onClick={() => setAdddrawervisible(true)}>添加数据</Button>
  )
  const genExtra = (data, index) => (
    <Tooltip title="删除数据">
      <Icon
        type="delete"
        theme='twoTone'
        onClick={event => {
          event.stopPropagation();
          Modal.confirm({
            title: 'Confirm',
            content: '确定删除该数据吗？如果对阈值的等级有删除，一定要更新使用到该阈值的规则，不然会出现取不到值的情况，切记！！！',
            okText: '确认',
            cancelText: '取消',
            onOk(){
              let newThreshold: React.SetStateAction<any[]> = [];
              newThreshold = newThreshold.concat(threshold);
              newThreshold[0][data].splice(index,1);
              submitAction(newThreshold);
            },
          });
        }}
      />
    </Tooltip>
  );

  const submitAction = async(data) => {
    // console.log(data)
    const ret = await request.post(`/api/filtertools/updateVideoThreshold?isdev=${isDev}`, {
      data: data
    });
    const act = 'save',
          value = data;
    value[0].location = window.location.href;
    value[0].debug = isDev? 1:0;
    if (ret.code === 0) {
      setThreshold(data);
      setAdddrawervisible(false);
      message.success('保存成功');
      const { log_domain, log_secret, video_threshold_key} = LogInfo
      saveStaticLog(log_domain, log_secret, [{
        action: act,
        key: video_threshold_key,
        value: value ? JSON.stringify(value) : '',
        fromid: '',
        comment: '',
      }])
      saveKibana(act,video_threshold_key,value)
    } else {
      message.error('失败，请重试');
    }
  }

  const changeTab = (key) => {
    let tabkey = VideoThresholdlistName[key-1].key;
    setCurrenttab(tabkey);
  }
  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <h4 style={{marginBottom: '20px'}}>视频过滤阈值设置</h4>
          <Spin tip="Loading..." spinning={loading}>
            <Form {...FormItemLayout} onSubmit={handleSubmit}>
              <Tabs type="card" tabBarExtraContent={addNewBtn()} onChange={changeTab}>
                {VideoThresholdlistName.map(item =>
                  <TabPane tab={item.name} key={item.num}>
                    <Collapse
                      defaultActiveKey={['1']}
                      expandIconPosition='left'
                    >
                      {threshold.length>0 && threshold[0][item.key] && threshold[0][item.key].map((k,index) =>
                        <Panel header={`${k.desc}-${k.level}`} key={index+1} extra={genExtra(item.key,index)}>
                          <Form.Item label="等级" extra="输入格式：[数字]级。如'1级'">
                            {getFieldDecorator(`${item.key}[${index}].level`, {
                              initialValue: parseInt(k.level),
                              rules: [{ required: true, message: '等级不能为空!' }],
                            })(
                              <InputNumber
                                min={1}
                                max={100}
                                formatter={value => `${value}级`}
                                parser={value => value.replace('级', '')}
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="说明">
                            {getFieldDecorator(`${item.key}[${index}].desc`, {
                              initialValue: k.desc,
                            })(
                              <Input/>
                            )}
                          </Form.Item>
                          <Form.Item label="条件">
                            {getFieldDecorator(`${item.key}[${index}].condition`, {
                              initialValue: k.condition,
                              rules: [{ required: true, message: '条件不能为空!'}],
                            })(
                              <Select>
                                {ThresholdSelectCon.map(item => <Select.Option value={item.value}>{item.key}</Select.Option>)}
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item label="阈值" extra="若条件为[介于]，则应为[min,max)。如'0.2,0,4'">
                            {getFieldDecorator(`${item.key}[${index}].value`, {
                              initialValue: k.value,
                              rules: [{ required: true, message: '阈值不能为空!', whitespace: true}],
                            })(
                              <Input/>
                            )}
                          </Form.Item>
                        </Panel>
                      )}
                    </Collapse>
                  </TabPane>
                )}
              </Tabs>
              <Form.Item {...TailFormItemLayout} style={{position: 'fixed',bottom: 0, width: '100%', height: '60px', paddingTop: '10px', background: 'rgba(0,0,0,0.4)'}}>
                <Button type="primary" htmlType="submit" icon="edit">
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
        <AddThresholdForm
          adddrawervisible={adddrawervisible}
          setAdddrawervisible={setAdddrawervisible}
          threshold={threshold}
          setThreshold={setThreshold}
          listName={VideoThresholdlistName}
          submitAction={submitAction}
          currenttab={currenttab}
          LogInfo={LogInfo}
        />
      </div>
    </>
  );
};
const WrappedDemo = Form.create({ name: 'validate_other' })(NewsThreshold);
export default WrappedDemo;
// export default NewsThreshold;
