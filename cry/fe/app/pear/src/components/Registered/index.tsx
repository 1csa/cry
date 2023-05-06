import React, { FC, useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Modal, Checkbox, message } from 'antd';

import { TheIndexType, distance } from '@/config/list.config';
import { getTypeData, getTypeCheck } from '@/services/knnAutomation';
import FactorList from './factorList';
import './index.less';

const { TextArea } = Input;

interface Props {
  visible: boolean;
  setVisible: any;
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any; getFieldValue: any; setFieldsValue: any };
  addEdlVisible: boolean;
  addModal: any;
  editModal: any;
  deleteModal: any;
  edotModelList: any;
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

const Index: FC<Props> = (props: Props) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields, getFieldValue, setFieldsValue } = props.form;
  const { visible, addEdlVisible, addModal, editModal, deleteModal, edotModelList } = props;
  const [queryListType, setQueryListType] = useState<any>([]);
  const [factorList, setFactorList] = useState<any>([]);
  const [factorValue, setFactorValue] = useState<any>({});
  const fileInputEl: any = useRef(null);

  useEffect(() => {
    handGetQueryList();
  }, []);

  const handGetQueryList = async () => {
    let res = await getTypeData({});
    setQueryListType(res.data);
  };
  const handleFactorList = (e: any) => {
    setFactorList(e);
  };

  const handType = async () => {
    let res: any = await getTypeCheck({ params: { type: fileInputEl.current.input.value } });
    if (res.success == true) {
      if (res.data == true) {
        message.error('库名已存在');
        setTimeout(() => {
          setFieldsValue({ type: '' });
        }, 1000);
      } else {
        message.success('当前该库名可以使用');
      }
    }
  };
  return (
    <Modal
      title={addEdlVisible ? '新库注册' : '库注册信息'}
      visible={visible}
      width="1000px"
      cancelText="取消"
      okText="确定"
      destroyOnClose={true}
      onOk={() => {
        addEdlVisible ? addModal(false, validateFieldsAndScroll) : editModal(false, validateFieldsAndScroll);
      }}
      onCancel={() => {
        deleteModal(false);
        setFactorList([]);
      }}
    >
      <Form>
        <div>
          <h4>基本信息</h4>
          <p className="inLineBorder"></p>
        </div>
        <div style={{ marginLeft: 5 }}>
          <Form.Item label="中文名" {...formItemLayout}>
            {getFieldDecorator('cnName', {
              initialValue: addEdlVisible ? '' : edotModelList.cnName,
              rules: [{ required: true, message: '中文名不能为空' }],
            })(<Input placeholder="请输入库名称" />)}
          </Form.Item>

          <Form.Item label="type" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: addEdlVisible ? '' : edotModelList.type,
              rules: [{ required: true, message: 'type名不能为空' }],
            })(<Input onBlur={handType} ref={fileInputEl} placeholder="请输入type名称" disabled={!addEdlVisible} />)}
          </Form.Item>

          <Form.Item label="负责人" {...formItemLayout}>
            {getFieldDecorator('owners', {
              initialValue: addEdlVisible ? [] : edotModelList.owners,
              rules: [{ required: true, message: '负责人不能为空' }],
            })(<Input placeholder="请输入负责人 英文逗号隔开 如：xxx,xxx" />)}
          </Form.Item>
        </div>
        {/* </Form>
      <Form layout="inline"> */}
        <div style={{ marginTop: 10 }}>
          <h4>库信息</h4>
          <p className="inLineBorder"></p>
        </div>
        <div style={{ marginLeft: 5 }}>
          <Form.Item label="索引的类型" {...formItemLayout}>
            {getFieldDecorator('faissMethod', {
              initialValue: addEdlVisible ? TheIndexType[0].text : edotModelList.faissMethod,
              rules: [{ required: true, message: '索引的类型不能为空' }],
            })(
              <Select placeholder="索引的类型" disabled={!addEdlVisible}>
                {TheIndexType &&
                  TheIndexType.map((item: any) => {
                    return (
                      <Select.Option value={item.text} key={item.key}>
                        {item.text}
                      </Select.Option>
                    );
                  })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="向量计算距离" {...formItemLayout}>
            {getFieldDecorator('faissSpace', {
              initialValue: addEdlVisible ? distance[0].text : edotModelList.faissSpace,
              rules: [{ required: true, message: '向量计算距离不能为空' }],
            })(
              <Select placeholder="向量计算距离" disabled={!addEdlVisible}>
                {distance &&
                  distance.map((item: any) => {
                    return (
                      <Select.Option value={item.text} key={item.key}>
                        {item.text}
                      </Select.Option>
                    );
                  })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="向量维度" {...formItemLayout}>
            {getFieldDecorator('faissDimension', {
              initialValue: addEdlVisible ? '' : edotModelList.faissDimension,
              rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '必须是number类型' }],
            })(<Input placeholder="请输入向量维度名称" />)}
          </Form.Item>
          <Form.Item label="morpheus集群&ZK" {...formItemLayout}>
            {getFieldDecorator('morpheus', {
              initialValue: addEdlVisible ? '' : edotModelList.morpheus,
            })(
              <Select placeholder="请输入morpheus集群&ZK">
                {queryListType?.morpheus?.map((item: any) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="morpheus表" {...formItemLayout}>
            {getFieldDecorator('morpheusTable', {
              initialValue: addEdlVisible ? '' : edotModelList.morpheusTable,
            })(<Input placeholder="请输入morpheus表" />)}
          </Form.Item>
          <Form.Item label="预估数据量" {...formItemLayout}>
            {getFieldDecorator('predictDataNum', {
              initialValue: addEdlVisible ? '' : edotModelList.predictDataNum,
              rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '必须是number类型' }],
            })(<Input placeholder="请输入预估数据量" />)}
          </Form.Item>
          <Form.Item label="预估QPS" {...formItemLayout}>
            {getFieldDecorator('predictQps', {
              initialValue: addEdlVisible ? '' : edotModelList.predictQps,
              rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '必须是number类型' }],
            })(<Input placeholder="请输入预估QPS" />)}
          </Form.Item>
          <div style={{ display: 'flex', paddingLeft: '14%' }}>
            <Form.Item style={{ display: 'flex' }} label="是否大小库">
              {getFieldDecorator('bigAndSmall', {
                initialValue: addEdlVisible ? false : edotModelList.bigAndSmall,
              })(
                addEdlVisible ? (
                  <Checkbox defaultChecked={false} />
                ) : (
                  <Checkbox defaultChecked={edotModelList.bigAndSmall} key={edotModelList.bigAndSmall} />
                ),
              )}
            </Form.Item>
            <Form.Item label="是否过滤" style={{ display: 'flex', paddingLeft: 30 }}>
              {getFieldDecorator('needFilter', {
                initialValue: addEdlVisible ? true : edotModelList.needFilter,
              })(
                addEdlVisible ? (
                  <Checkbox defaultChecked={true} />
                ) : (
                  <Checkbox defaultChecked={edotModelList.needFilter} key={edotModelList.needFilter} />
                ),
              )}
            </Form.Item>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <h4>业务信息</h4>
          <p className="inLineBorder"></p>
        </div>
        <div style={{ marginLeft: 5 }}>
          {addEdlVisible ? (
            <Form.Item label="召回factor" {...formItemLayout}>
              {getFieldDecorator('factors', {
                initialValue: [],
                rules: [{ required: true, message: '召回factor不能为空' }],
              })(
                <Select mode="multiple" allowClear placeholder="召回factor" disabled={!addEdlVisible} onChange={handleFactorList}>
                  {queryListType?.factors?.map((item: any) => {
                    return (
                      <Select.Option value={item} key={item}>
                        {item}
                      </Select.Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          ) : edotModelList.factorTypeList ? (
            edotModelList.factorTypeList.map((item: any, index: any) => {
              return (
                <Form.Item key={item.factor}>
                  {getFieldDecorator(`factorTypeList[${index}]`, {
                    initialValue: item,
                  })(<FactorList item={item} addEdlVisible={addEdlVisible} key={item.factor} queryListType={queryListType}></FactorList>)}
                </Form.Item>
              );
            })
          ) : (
            ''
          )}
          {addEdlVisible
            ? factorList.map((item: any, index: number) => (
                <Form.Item label={item} key={item} {...formItemLayout}>
                  {getFieldDecorator(`factorTypeList[${index}]`, {
                    initialValue: {
                      factor: item,
                      expectExceptionRatio: 0,
                      expectLatency: 10,
                      expectEmptyRatio: 0,
                    },
                  })(<FactorList item={item} addEdlVisible={addEdlVisible} key={item}></FactorList>)}
                </Form.Item>
              ))
            : ''}
          <Form.Item label="应用端" {...formItemLayout}>
            {getFieldDecorator('app', {
              initialValue: addEdlVisible ? [] : edotModelList.app,
              rules: [{ required: true, message: '应用端不能为空' }],
            })(
              <Select placeholder="应用端">
                {queryListType?.app?.map((item: any) => {
                  return (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="业务场景" {...formItemLayout}>
            {getFieldDecorator('scene', {
              initialValue: addEdlVisible ? [] : edotModelList.scene,
              rules: [{ required: true, message: '业务场景不能为空' }],
            })(
              <Select placeholder="业务场景">
                {queryListType?.scene?.map((item: any) => {
                  return (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="数据类型" {...formItemLayout}>
            {getFieldDecorator('dataType', {
              initialValue: addEdlVisible ? [] : edotModelList.dataType,
              rules: [{ required: true, message: '数据类型不能为空' }],
            })(
              <Select placeholder="数据类型">
                {queryListType?.dataType?.map((item: any) => {
                  return (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="重要等级" {...formItemLayout}>
            {getFieldDecorator('level', {
              initialValue: addEdlVisible ? [] : edotModelList.level,
              rules: [{ required: true, message: '重要等级不能为空' }],
            })(
              <Select placeholder="重要等级">
                {queryListType?.level?.map((item: any) => {
                  return (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="算法模型" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: addEdlVisible ? [] : edotModelList.model,
              rules: [{ required: true, message: '算法模型不能为空' }],
            })(
              <Select placeholder="算法模型">
                {queryListType?.model?.map((item: any) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="机器分类" {...formItemLayout}>
            {getFieldDecorator('machineFactor', {
              initialValue: addEdlVisible ? [] : edotModelList.machineFactor,
              rules: [{ required: true, message: '机器分类不能为空' }],
            })(
              <Select placeholder="机器分类">
                {queryListType?.machineFactor?.map((item: any) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="库描述" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: addEdlVisible ? [] : edotModelList.description,
              rules: [{ required: true, message: '库描述不能为空' }],
            })(<TextArea allowClear={true} placeholder="请填写库描述" />)}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default Form.create()(Index);
