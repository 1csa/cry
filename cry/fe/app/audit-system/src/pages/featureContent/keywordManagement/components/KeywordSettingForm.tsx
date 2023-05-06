import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import { Form, Input, Cascader, Radio, DatePicker, message, Popover, Switch, Button, Row, Col } from 'antd';

import { saveSensitiveCategoriesItem } from '@/components/BusinessLogic/common';
import Iconfont from '@/components/Dumb/Iconfont';
import Result from './excel/Result';
import ToggleCompoundWords from './CompoundWordsFormItem';
import EffectiveRangeTime from './EffectiveRangeTime';

import { ConnectState, Dispatch, CommonLogicState } from '@/models/connect';
import { getCookie, DATE_FORMAT_SS } from '@/utils/dev_helper';
import { initDefaultValue, formatDate } from '../model/utils';
import EffectiveInfo, { EffectDataType, filterData } from './EffectiveInfo';

import { addWords, checkWords, updateWords } from '@/services/featureContent';

const { TextArea } = Input;
// const { RangePicker } = DatePicker;

export const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  // wrapperCol: {
  //   sm: { span: 20 },
  // },
};

interface ISettingForm {
  editType: boolean;
  dispatch: Dispatch;
  commonLogic: CommonLogicState;
}

export interface IHandler {
  onFinish: () => void;
}

const SettingForm = React.forwardRef<IHandler, ISettingForm>(({ editType, dispatch, commonLogic }, ref) => {
  // 获取回显的默认值
  const getInitValue = () => (sessionStorage.editWordsValue ? initDefaultValue(JSON.parse(sessionStorage.editWordsValue)) : initDefaultValue({}));
  const defaultValue = getInitValue();

  const [form] = Form.useForm();
  const nowDate = formatDate(new Date());

  const wordRef = useRef<any>(null);
  // 获取生效信息表格子组件数据并处理传给接口 老的actions有很多字段 新的只有三个
  const [effectiveData, setEffectiveData] = useState<EffectDataType[]>(filterData(defaultValue.actions));

  // // 设置是否 生效时间被禁止
  // const [disabledDateRadio, setDateRadioValue] = useState<number>(defaultValue.time_range);

  // 审核词不通过之后的一个状态，除非不重复才会改变为可以提交状态
  // const [isRedundant, setIsRedundant] = useState<boolean>(false);
  const [category, setCategory] = useState<Array<any>>([]);

  // 时间区间
  // const [rangeDate, setRangeDate] = useState<any>(defaultValue.rangeDate);
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  // 是组合词的话，自动增加input的个数
  const [autoFormItemList, setAutoFormItemList] = useState<number[]>(defaultValue.mixDistanceInputCountList);
  const [mixDistance, setMixDistance] = useState<string>(defaultValue.mixDistance);

  // 审核词 新 | 重复
  const [newWords] = useState<string>('');
  const [repeatWords] = useState<string>('');

  /**
   * 切换完面板之后自动聚焦
   * @param checked
   */
  const handleSwitchChange = (checked: boolean) => {
    setSwitchChecked(checked);
    wordRef?.current!.focus();
    // formateWords('word');
    formateWords('newWords');
  };

  /**
   * 去空格，转换中文逗号、中文竖线分割线以及最后一个不用的逗号
   * @param word
   */
  const formateWords = (word: string) => {
    return form.getFieldsValue()[word]
      ? form
          .getFieldsValue()
          [word].trim()
          .replace(/\n/g, '')
          .replace(/，/g, ',')
          .replace(/｜/g, '|')
          .replace(/,$/g, '')
          .replace(/\|\|+/g, '|')
          .replace(/^\|/g, '')
          .replace(/\|$/g, '')
      : '';
  };

  /**
   * 获取组合词长度用来在输入敏感词失去焦点之后动态增加表单
   * @param word
   */
  const getComWordsLen = (word: string) => word.split('|').length - 1;

  /**
   * 查看是否有组合词
   */
  // const hasComWords = () => defaultValue?.word?.includes('|') || formateWords('word').includes('|');
  const hasComWords = () => defaultValue?.word?.includes('|') || formateWords('newWords').includes('|');

  /**
   * 动态增加表单项
   * @param word
   */
  const autoRunFormItem = (word: string) => {
    if (getComWordsLen(word) >= 2) {
      let newArr = new Array(getComWordsLen(word));
      for (let i = 1; i <= getComWordsLen(word); i++) {
        newArr[i - 1] = i;
      }
      // setMixDistance(new Array(newArr.length).fill('0:5').join(','));
      setAutoFormItemList(newArr);
      // defaultValue.mixDistance = new Array(newArr.length).fill('0:5').join(',')
    } else {
      // setMixDistance('0:5');
      setAutoFormItemList([1]);
      // defaultValue.mixDistance = '0:5'
    }
  };

  /**
   * 查看当前的值是不是和需要提交的面板匹配
   * 只针对增加的时候 修改的时候不需要判断
   */
  const checkWordsIsMatchPanel = () => {
    const editType: boolean = window.location.search === '?type=edit';
    if (editType) return true;
    if (switchChecked) {
      // if (formateWords('word') && !hasComWords()) {
      if (formateWords('newWords') && !hasComWords()) {
        message.warning(`您输入的审核词不符合组合词预期！`);
        return false;
      }
    } else {
      if (hasComWords()) {
        message.warning(`您输入的审核词不符合非组合词预期！`);
        return false;
      }
    }
    return true;
  };

  /**
   * 校验审核词是否重复
   */
  const handleWordBlur = () => {
    // const words = formateWords('word');
    const words = formateWords('newWords');
    if (!checkWordsIsMatchPanel()) {
      return false;
    }
    autoRunFormItem(words);
    // form.setFieldsValue({ word: words });
    // checkWords({ sensitiveWords: words })
    //   .then(res => {
    //     const { code, data } = res;
    //     if (code === 200) {
    //       if (data.length) {
    //         const repeatStr = data.map((e: { word: string }) => e.word).join('、');
    //         // 提交之前再次提示
    //         setIsRedundant(true);
    //         message.warning(`敏感词 ${repeatStr} 重复，请重新添加！`);
    //       } else {
    //         autoRunFormItem(words);
    //         setIsRedundant(false);
    //       }
    //     } else {
    //       message.warning(`敏感词重复校验失败，请编辑重新操作！`);
    //     }
    //   })
    //   .catch(err => {
    //     console.log('err', err);
    //   });
  };

  /**
   * 批量校验 拆分 重复 | 非重复
   */
  const getWords = () => {
    const words = formateWords('word');
    // const words = formateWords('newWords');
    const wordsLength = words.split(',').length;
    const maxWordsLength = 500;
    if (wordsLength > maxWordsLength) {
      message.error(`批量新增词不可以超过${maxWordsLength}个！`);
      return;
    }
    if (!checkWordsIsMatchPanel()) return false;
    form.setFieldsValue({ word: words });
    if (words.length === 0) return;
    checkWords({ sensitiveWords: words })
      .then(res => {
        const { code, data } = res;
        if (code === 200) {
          const { repeat = '', noRepeat = '' } = data;
          form.setFieldsValue({
            newWords: noRepeat,
            repeatWords: repeat,
          });
          //
          handleWordBlur();
        } else {
          message.error('批量校验敏感词重复校验失败，请编辑重新操作！');
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  /**
   * 格式化豁免词
   */
  const handleExWordBlur = () => {
    form.setFieldsValue({ exemptWord: formateWords('exemptWord') });
  };

  // 校验对应的面板输入的词是否符合要求
  const validateFieldsTips = () => {
    // if (isRedundant) {
    //   message.warning('请先批量校验审核词重复后再提交！');
    //   return false;
    // }
    if (!effectiveData.length) {
      message.warning('生效信息不可以为空！');
      return false;
    }
    return true;
  };

  /**
   * 处理一下组合词间距数据以及校验数据是不是为空
   */
  const mixDistanceValue = (values: any) => {
    // 将每个input的最大值拼接为x1:y1,x2:y2的形式，正序排完之后，翻转一下字符串
    for (let i = 1; i <= getComWordsLen(values.word); i++) {
      values.mixDistance = values.mixDistance ? `0:${values['mixDistance_' + i] || 0},${values.mixDistance}` : `0:${values['mixDistance_' + i] || 0}`;
    }
    if (values.mixDistance.includes('undefined')) {
      message.warning('组合词间距不可以为空！');
      return false;
    }
    return values.mixDistance
      .split(',')
      .reverse()
      .join(',');
  };

  /**
   * 过滤出多个组合词的数据
   * @param values
   */
  const filterParams = (values: any) => {
    const options = {};
    for (const key in values) {
      const element = values[key];
      if (!/mixDistance_/.test(key)) {
        Object.assign(options, {
          [key]: element,
        });
      }
    }
    return options;
  };

  /**
   * 格式化参数
   * @param values
   */
  const formatParams = (values: any) => {
    values.time_range = values.time_range === 1 ? [nowDate, moment('2999/12/31 23:59:59', DATE_FORMAT_SS)] : values.rangeDate;
    const len = values.categoryId && values.categoryId.length;
    values.categoryId = values.categoryId[len - 1];

    // 是组合词面板里的数据才需要如下处理
    if (hasComWords()) {
      values.mixDistance = mixDistanceValue(values);
    }

    const params = {
      ...filterParams(values),
      actions: effectiveData,
      wordType: values.word.includes('|') ? 2 : 1,
      startTime: new Date(values.time_range[0]).getTime(),
      endTime: new Date(values.time_range[1]).getTime(),
      operationUid: +getCookie('userid'),
      operationUName: decodeURIComponent(getCookie('nickname')),
    };
    Reflect.deleteProperty(params, 'time_range');
    return params;
  };

  /**
   * 点击提交按钮
   */
  const onFinish = () => {
    if (!validateFieldsTips()) return false;
    if (!checkWordsIsMatchPanel()) return false;
    form
      .validateFields()
      .then(values => {
        const params: any = formatParams(values);
        if (editType) {
          updateWordsApi({ ...params, wordId: defaultValue.wordId });
        } else {
          const { newWords = '' } = params;
          params.word = newWords;
          delete params.newWords;
          delete params.repeatWords;
          addWordsApi(params);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  /**
   * 添加豁免词
   * @param params
   */
  const addWordsApi = (params: any) => {
    addWords(params).then(response => {
      const { code, status, data } = response;
      if (code !== 200) {
        message.error(status);
        return;
      }
      setResultVisible(true);

      const { successNums, errorNums, repeatNums, total, errors } = data;
      const list: any = [];
      for (let key in errors) {
        list.push(errors[key]);
      }
      const keyWords = list.flat().map((item: any) => `${item.keyword}，${item.business}，${item.scene}`) ?? [];
      setResultProps({
        success: successNums,
        fail: errorNums,
        repeat: repeatNums,
        total,
        list: keyWords,
      });

      // if (code === 200) {
      //   message.success('添加审核词成功～');
      //   form.resetFields();
      //   router.go(-1);
      // } else {
      //   if (code === 4060001) {
      //     message.error('敏感词重复校验失败，请编辑重新操作！');
      //   } else {
      //     message.error('添加审核词失败，请重试～');
      //   }
      // }
    });
  };

  /**
   * 更新豁免词
   * @param params
   */
  const updateWordsApi = (params: any) => {
    updateWords(params).then(res => {
      const { code } = res;
      if (code === 200) {
        message.success('更新审核词成功～');
        form.resetFields();
        router.go(-1);
      } else {
        if (code === 4060001) {
          message.error('敏感词重复校验失败，请编辑重新操作！');
        } else {
          message.error('添加审核词失败，请重试～');
        }
      }
    });
  };

  // 执行表单子组件提交方法
  useImperativeHandle(ref, () => ({
    onFinish: onFinish,
  }));

  const handleCascaderChange = (value: any) => {
    console.log(value);
  };

  // // 切换生效时间单选按钮
  // const handleTimeRadio = (event: any) => {
  //   setDateRadioValue(event.target.value);
  //   console.log('event', event.target.value);
  // };
  // // 日期组件数据改变
  // const handleDateChange = (value: any, dateString: Array<string>) => {
  //   setRangeDate(value);
  // };
  // 卸载页面的时候销毁数据
  const componentWillUnmount = () => {
    sessionStorage.editWordsValue && sessionStorage.removeItem('editWordsValue');
  };

  // 卸载页面清除本地数据
  useEffect(() => {
    return componentWillUnmount;
  }, []);

  // 请求下拉和级联菜单
  useEffect(() => {
    saveSensitiveCategoriesItem(dispatch, commonLogic).then(category => {
      setCategory(category);
    });
  }, []);

  const [resultVisible, setResultVisible] = useState(false);
  const resultVisibleChange = () => {
    setResultVisible(false);
    router.go(-1);
  };
  const [resultProps, setResultProps] = useState({
    success: 0,
    fail: 0,
    repeat: 0,
    total: 0,
    list: [],
  });

  return (
    <>
      {editType ? null : (
        <div className="mb20">
          <span className="label-width dib">组合词：</span>
          <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={switchChecked} onChange={handleSwitchChange} />
        </div>
      )}
      <Form form={form} name="horizontal_search_setting_form" onFinish={onFinish} {...formItemLayout} initialValues={defaultValue}>
        {/* <Form.Item label="审核词" name="word" rules={[{ required: true, message: '审核词不可以为空！' }]}>
          <TextArea
            ref={wordRef}
            placeholder={switchChecked ? '请输入审核词(组合审核词使用|间隔)' : '请输入审核词，只能录入单个审核词，批量录入请用导入功能'}
            rows={3}
            disabled={editType}
            onBlur={handleWordBlur}
          />
        </Form.Item> */}

        <Form.Item
          label={
            <span className="ant-form-item-label">
              <label className="ant-form-item-required">审核词</label>
            </span>
          }
          colon={false}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name="word" rules={[{ required: true, message: '审核词不可以为空！' }]} extra="批量添加请以英文逗号分隔">
                <TextArea
                  ref={wordRef}
                  placeholder={`请输入审核词${switchChecked ? '(组合审核词使用|间隔)' : ''}`}
                  rows={3}
                  disabled={editType}
                  // maxLength={500}
                  // onBlur={getWords}
                />
              </Form.Item>
            </Col>
            {editType ? null : (
              <Col span={12}>
                <Button type="primary" onClick={getWords}>
                  批量校验
                </Button>
              </Col>
            )}
          </Row>
        </Form.Item>

        {editType ? null : (
          <>
            <Form.Item label="全新关键词">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="newWords"
                    rules={[{ required: true, message: '暂无全新关键词，请重新填写审核词后再次校验！' }]}
                    initialValue={newWords}
                  >
                    <TextArea readOnly placeholder="无" rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="重复关键词">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="repeatWords" initialValue={repeatWords}>
                    <TextArea readOnly placeholder="无" rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </>
        )}

        <Form.Item
          label={
            <>
              豁免词
              <Popover content={'在符合敏感词或组合词命中规则的情况下，如果命中词在此处被配置为豁免词，则该词不会被判定为命中。'}>
                <span>
                  <Iconfont name="iconbangzhu" />
                </span>
              </Popover>
            </>
          }
          name="exemptWord"
        >
          <TextArea placeholder="请输入豁免词，批量添加请以英文逗号分隔" rows={2} maxLength={256} onBlur={handleExWordBlur} />
        </Form.Item>

        <Form.Item label="审核词分类" name="categoryId" rules={[{ required: true, message: '审核词分类不可以为空！' }]}>
          <Cascader
            placeholder="请选择审核词分类"
            fieldNames={{ label: 'categoryName', value: 'categoryId', children: 'category' }}
            options={category}
            // loadData={loadData}
            onChange={handleCascaderChange}
          />
        </Form.Item>

        {hasComWords() ? (
          <ToggleCompoundWords
            switchChecked={hasComWords() || switchChecked}
            mixDistance={defaultValue.mixDistance}
            autoFormItemList={autoFormItemList}
          />
        ) : null}
        {!switchChecked ? (
          <Form.Item label="同音词匹配" name="enablePinyin">
            <Radio.Group>
              <Radio value={1}>开启</Radio>
              <Radio value={0}>关闭</Radio>
            </Radio.Group>
          </Form.Item>
        ) : null}
        <Form.Item label="生效信息" rules={[{ required: true }]}>
          <EffectiveInfo editType={editType} handleData={data => setEffectiveData(data)} initCellValue={defaultValue} />
        </Form.Item>
        {/* <Form.Item label="生效时间段" name="time_range" rules={[{ required: true }]}>
          <Radio.Group onChange={handleTimeRadio}>
            <Radio value={1}>永久</Radio>
            <Radio value={2}>
              <RangePicker
                disabled={disabledDateRadio === 1 ? true : false}
                showTime
                defaultValue={rangeDate}
                format={DATE_FORMAT_SS}
                onChange={handleDateChange}
              />
            </Radio>
          </Radio.Group>
        </Form.Item> */}
        <EffectiveRangeTime defaultValue={defaultValue.time_range} />

        <Form.Item label="备注" name="remark" rules={[{ required: true, message: '备注不可以为空！' }]}>
          <TextArea placeholder="请输入增加或者修改原因" rows={2} maxLength={50} />
        </Form.Item>
      </Form>

      {resultVisible ? <Result {...resultProps} visibleChange={resultVisibleChange} /> : null}
    </>
  );
});

/**
 * connect中会被function包装一次，因为react中规定不能在函数组件中使用ref所以抛出警告
 * 之所以这里能用是因为配合forwardRef和useImperativeHandle
 * 解决办法就是使用connect的第四个参数透传ref
 */
export default connect(
  ({ commonLogic }: ConnectState) => ({
    commonLogic,
  }),
  null,
  null,
  { forwardRef: true },
)(SettingForm);
