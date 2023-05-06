import React, { FC } from 'react';
import { Form, Input, message, Modal, Radio, Select } from 'antd';
import moment from 'moment';
import { SearchApp, SearchScene, SearchContentType } from '@/config/list.config';
interface addProps {
  form: any;
  visible: boolean;
  isAddModal: boolean;
  row: any;
  closeCallback: () => void;
  addModal: any;
  editModal: any;
}
const { TextArea } = Input;
const { Option } = Select;
export const FormItemLayout: Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 12 },
  },
};

const AddModal: FC<addProps> = ({ form, visible, isAddModal, row, closeCallback, addModal, editModal }) => {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handClose = () => {
    closeCallback();
  };
  const isrulesList = [
    {
      value: '无',
      key: '无',
    },
    {
      value: 'Scope过滤',
      key: 'Scope过滤',
    },
    {
      value: 'Ntod过滤',
      key: 'Ntod过滤',
    },
    {
      value: 'AllianceScope过滤',
      key: 'AllianceScope过滤',
    },
  ];
  const userLabelList = [
    {
      value: '无',
      key: '无',
    },
    {
      value: '低活用户',
      key: '低活用户',
    },
    {
      value: '中活用户',
      key: '中活用户',
    },
    {
      value: '高活用户',
      key: '高活用户',
    },
    {
      value: '新用户',
      key: '新用户',
    },
    {
      value: '流失用户',
      key: '流失用户',
    },
  ];
  const categoryList = [
    {
      value: 'ScopeFilter',
      key: 'ScopeFilter',
    },
    {
      value: 'TodFilter',
      key: 'TodFilter',
    },
    {
      value: 'AllianceScopeFilter',
      key: 'AllianceScopeFilter',
    },
    {
      value: 'LowQualityFilter',
      key: 'LowQualityFilter',
    },
    {
      value: 'OpsToolFilter',
      key: 'OpsToolFilter',
    },
    {
      value: 'ExemptFilter',
      key: 'ExemptFilter',
    },
  ];
  return (
    <>
      <Modal
        title={isAddModal ? '添加规则' : '修改规则'}
        visible={visible}
        onCancel={handClose}
        onOk={() => {
          isAddModal ? addModal(false, validateFieldsAndScroll) : editModal(false, validateFieldsAndScroll);
        }}
        width="50%"
        destroyOnClose={true}
      >
        <Form {...FormItemLayout}>
          <Form.Item label="规则名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('ruleName', {
              initialValue: isAddModal ? '' : row.ruleName,
              rules: [{ required: true, message: '规则名称不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="运营工具规则Id" style={{ marginBottom: 0 }}>
            {getFieldDecorator('opsToolRuleId', {
              initialValue: isAddModal ? '' : row.opsToolRuleId,
              rules: [{ required: true, message: '运营工具规则Id不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          {/* <Form.Item label="规则类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('rulesType', {
              initialValue: isAddModal ? '' : row.filterType,
            })(
              <Select>
                {rulesTypeList.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item> */}
          <Form.Item label="规则说明" style={{ marginBottom: 0 }}>
            {getFieldDecorator('description', {
              initialValue: isAddModal ? '' : row.description,
              rules: [{ required: true, message: '规则说明不能为空' }],
            })(<TextArea rows={3}></TextArea>)}
          </Form.Item>
          <Form.Item label="是否下沉" style={{ marginBottom: 0 }}>
            {getFieldDecorator('isSink', {
              initialValue: isAddModal ? false : row.sink,
            })(
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="生效端" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appIdGroup', {
              initialValue: isAddModal ? '' : row.appIdGroup,
              rules: [{ required: true, message: '生效端不能为空' }],
            })(
              <Select>
                {SearchApp.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="生效场景" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scene', {
              initialValue: isAddModal ? '' : row.scene,
              rules: [{ required: true, message: '生效场景不能为空' }],
            })(
              <Select>
                {SearchScene.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="生效内容类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('dataType', {
              initialValue: isAddModal ? '' : row.dataType,
              rules: [{ required: true, message: '生效内容类型不能为空' }],
            })(
              <Select>
                {SearchContentType.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="用户分层" style={{ marginBottom: 0 }}>
            {getFieldDecorator('userLabel', {
              initialValue: isAddModal ? '' : row.userLabel,
            })(
              <Select>
                {userLabelList.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="豁免规则ID" style={{ marginBottom: 0 }}>
            {getFieldDecorator('exemptRuleId', {
              initialValue: isAddModal ? '' : row.exemptRuleId,
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="豁免规则" style={{ marginBottom: 0 }}>
            {getFieldDecorator('exemptRuleName', {
              initialValue: isAddModal ? '' : row.exemptRuleName,
            })(
              <Select>
                {isrulesList.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="规则类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('category', {
              initialValue: isAddModal ? '' : row.category,
              rules: [{ required: true, message: '规则类型不能为空' }],
            })(
              <Select>
                {categoryList.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="appId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appId', {
              initialValue: isAddModal ? '' : row.appId,
              rules: [{ required: true, message: 'appId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="fromId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fromId', {
              initialValue: isAddModal ? '' : row.fromId,
              rules: [{ required: true, message: 'fromId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="fakeAppId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fakeAppId', {
              initialValue: isAddModal ? '' : row.fakeAppId,
              rules: [{ required: true, message: 'fakeAppId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="实验bucket" style={{ marginBottom: 0 }}>
            {getFieldDecorator('bucket', {
              initialValue: isAddModal ? '' : row.bucket,
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="创建人" style={{ marginBottom: 0 }}>
            {getFieldDecorator('creator', {
              initialValue: localStorage.getItem('user')?.split('@')[0],
            })(<p style={{ marginBottom: 0 }}>{localStorage.getItem('user')?.split('@')[0]}</p>)}
          </Form.Item>
          <Form.Item label="创建时间" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cTime', {
              initialValue: moment().format('YYYY-MM-DD HH:mm:ss'),
            })(<p style={{ marginBottom: 0 }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</p>)} */}
            <p style={{ marginBottom: 0 }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</p>
          </Form.Item>
          {isAddModal ? (
            ''
          ) : (
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator('primaryId', {
                initialValue: row.primaryId,
              })(<p style={{ marginBottom: 0 }}></p>)}
            </Form.Item>
          )}
           {isAddModal ? (
            ''
          ) : (
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator('ruleId', {
                initialValue: row.ruleId,
              })(<p style={{ marginBottom: 0 }}></p>)}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(AddModal);
