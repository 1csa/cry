// @ts-nocheck
import React, { useState, useEffect } from 'react';

import { Card, Drawer, Form, Input, Button, Radio, Select, Space, Row, Col, DatePicker } from 'antd';

import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import InputNumber from '../inputNumber';
// import DateRangePicker from '../rangePicker';
import Detail from '../detail';

import { Flag, FlagPassAndReject, FlagScore, BusinessTypeOptions, defaultType, TypeOptions } from '../config';

import { getTargetPartZone, createTaskPreview } from '@/services/inspection';

// form default initial values
const defaultInitialValues = {
  dateRange: [],

  type: defaultType,
  ratioPass: 10,
  ratioReject: 10,

  amountPass: 100,
  amountReject: 100,

  ratio0: 10,
  ratio1: 10,
  ratio2: 10,
  ratio3: 10,

  amount0: 100,
  amount1: 100,
  amount2: 100,
  amount3: 100,
};

// form item rules
const itemRules = {
  rules: [{ required: true }],
};

// 抽检名单 props
const selectProps = {
  label: '抽检名单',
  name: 'userId',
  width: 625,
  mode: 'multiple',
  ...itemRules,
};

// form control style
const controlStyle = {
  style: {
    width: 280,
  },
};

// 百分数 转 小数
const percent2Decimal = (num: number) => parseFloat((num / 100).toFixed(2));

interface InspectionFormProps {
  createSuccessCallback: () => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ createSuccessCallback: _createSuccessCallback }) => {
  const [form] = Form.useForm();

  // 创建 drawer
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    setVisible(!visible);
  };

  // form 提交
  const onFinish = (values: any) => {
    const {
      dateRange: [startDate, endDate],

      ratioPass,
      ratioReject,

      amount0,
      amount1,
      amount2,
      amount3,

      ratio0,
      ratio1,
      ratio2,
      ratio3,
    } = values;

    if (flag === FlagPassAndReject) {
      if (type === 'ratio') {
        values.ratioPass = percent2Decimal(ratioPass) || 0;
        values.ratioReject = percent2Decimal(ratioReject) || 0;
      }
    }

    if (flag === FlagScore) {
      if (type === 'ratio') {
        delete values.ratio0;
        delete values.ratio1;
        delete values.ratio2;
        delete values.ratio3;
        values.ratioList = [percent2Decimal(ratio0), percent2Decimal(ratio1), percent2Decimal(ratio2), percent2Decimal(ratio3)];
      } else {
        delete values.amount0;
        delete values.amount1;
        delete values.amount2;
        delete values.amount3;
        values.amountList = [amount0, amount1, amount2, amount3];
      }
    }

    delete values.targetBusinessTypeName;

    const requestData = {
      ...values,
      dateRange: [startDate.startOf('hour').valueOf(), endDate.endOf('hour').valueOf()],
    };
    createPreview(requestData);
  };

  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  // 创建预览
  const createPreview = async (requestData: any) => {
    setLoading(true);
    const { errorno, data } = await requestAsyncRes(() => createTaskPreview(requestData));
    setLoading(false);
    if (errorno === 0) {
      setDetailData(data);
      toggleDetailVisible();
    }
  };

  // form 重置
  const onReset = () => {
    setBusinessType('');
    form.setFieldsValue(defaultInitialValues);
  };

  // 子业务
  const [businessType, setBusinessType] = useState('');

  // flag passAndReject-通过/拒绝 | score-0/1/2/3分
  const [flag, setFlag] = useState<Flag | ''>('');
  const onValuesChange = (_: any, values: any) => {
    const { type, businessType } = values;
    setType(type);
    setBusinessType(businessType);
    const flag = BusinessTypeOptions.find((item: any) => item.value === businessType)?.flag || '';
    setFlag(flag);
  };

  // 详情 逻辑
  const [detailVisible, setDetailVisible] = useState(false);
  const toggleDetailVisible = () => {
    setDetailVisible(!detailVisible);
  };

  // 详情确认创建成功之后的回调
  const createSuccessCallback = () => {
    toggleVisible();
    _createSuccessCallback();
  };

  // 抽检方式
  const [type, setType] = useState<'ratio' | 'amount'>(defaultType);

  // 目标分区 options
  const [partitionOptions, setPartitionOptions] = useState([]);

  // 获取目标业务 & 分区列表
  const queryTargetPartZone = async () => {
    if (businessType) {
      const {
        errorno,
        // @ts-ignore
        data: { defaultId, businessAuth, list },
      } = await requestAsyncRes(() => getTargetPartZone({ businessUnitId: businessType }));
      if (errorno === 0) {
        // console.log(defaultId, businessAuth, list);
        // const min = Math.min(...list.map((a: any) => a.amount));
        // const defaultId = list.find((item: any) => item.amount === min)?.value || '';

        const partitionList =
          list?.map((item: any) => ({
            ...item,
            label: `${item.label}(${item.amount || 0})`,
          })) || [];

        setPartitionOptions(partitionList);

        form.setFieldsValue({
          targetBusinessType: businessAuth.businessUnitId,
          targetBusinessTypeName: businessAuth.businessUnitName,
          targetPartition: defaultId,
        });
      }
    }
  };

  useEffect(() => {
    queryTargetPartZone();
  }, [businessType]);

  return (
    <>
      <Card title="质检任务创建" bordered={false}>
        <Button type="primary" onClick={() => toggleVisible()}>
          创建质检任务
        </Button>
      </Card>
      <Drawer visible={visible} title="创建质检任务" size="large" onClose={toggleVisible}>
        <Form form={form} layout="vertical" initialValues={defaultInitialValues} onFinish={onFinish} onValuesChange={onValuesChange} hideRequiredMark>
          <Row>
            <Col span={12}>
              <Form.Item label="子业务" name="businessType" {...itemRules}>
                <Select options={BusinessTypeOptions} placeholder="请选择子业务" {...controlStyle} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="审核时间" name="dateRange" {...itemRules}>
                <DatePicker.RangePicker {...controlStyle} showTime={{ format: 'HH' }} format="YYYY-MM-DD HH" placement="bottomRight" />
                {/* <DateRangePicker {...controlStyle} range={30} /> */}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col>
              <AuditUserSelect selectProps={selectProps} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="抽检方式" name="type" {...itemRules}>
                <Radio.Group options={TypeOptions} />
              </Form.Item>
            </Col>
          </Row>

          {flag === FlagPassAndReject && (
            <>
              {/* 抽检比例 */}
              {type === 'ratio' && (
                <Row>
                  <Col span={6}>
                    <Form.Item label="通过抽检比例" name="ratioPass">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="拒绝抽检比例" name="ratioReject">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* 抽检条数 */}
              {type === 'amount' && (
                <Row>
                  <Col span={6}>
                    <Form.Item label="通过抽检条数" name="amountPass">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="拒绝抽检条数" name="amountReject">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </>
          )}

          {flag === FlagScore && (
            <>
              {/* 质量打标 抽检比例 */}
              {type === 'ratio' && (
                <Row>
                  <Col span={6}>
                    <Form.Item label="0分抽检比例" name="ratio0">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="1分抽检比例" name="ratio1">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="2分抽检比例" name="ratio2">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="3分抽检比例" name="ratio3">
                      <InputNumber min={0} max={100} flag="%" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* 质量打标 抽检条数 */}
              {type === 'amount' && (
                <Row>
                  <Col span={6}>
                    <Form.Item label="0分抽检条数" name="amount0">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="1分抽检条数" name="amount1">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="2分抽检条数" name="amount2">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="3分抽检条数" name="amount3">
                      <InputNumber min={0} flag="条" />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </>
          )}

          <Row>
            <Col span={12}>
              <Form.Item label="目标业务" name="targetBusinessTypeName" {...itemRules}>
                <Input readOnly {...controlStyle} placeholder="目标业务(自动填充)" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="目标业务" name="targetBusinessType" {...itemRules}>
                <Input readOnly {...controlStyle} placeholder="目标业务(自动填充)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="目标分区" name="targetPartition" {...itemRules}>
                <Select options={partitionOptions} placeholder="请选择对应分区" {...controlStyle} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="备注" name="mark">
                <Input.TextArea maxLength={100} showCount rows={3} style={{ width: 625 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建
              </Button>
              <Button htmlType="reset" onClick={onReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
      {detailVisible ? (
        <Detail type="confirm" toggleVisible={toggleDetailVisible} data={detailData} createSuccessCallback={createSuccessCallback} />
      ) : null}
    </>
  );
};

export default InspectionForm;
