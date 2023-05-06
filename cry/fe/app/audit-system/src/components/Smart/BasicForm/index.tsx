import React, { useState, useImperativeHandle, Fragment, useRef } from 'react';
import moment from 'moment';
import { Form, Button } from 'antd';

import CustomsizeSelect from '@/components/Dumb/FormItem/CustomsizeSelect';
import CustomsizeInput from '@/components/Dumb/FormItem/CustomsizeInput';
import CustomsizeRangePicker from '@/components/Dumb/FormItem/CustomsizeRangePicker';
import CustomsizeCascader from '@/components/Dumb/FormItem/CustomsizeCascader';
import CustomsizeSwitch from '@/components/Dumb/FormItem/CustomsizeSwitch';

import { IBasicForm } from '@/types';

const layouts = {
  // labelCol: {
  //   span: 8,
  // },
  // wrapperCol: {
  //   span: 16,
  // },
};

interface IBasicFormProps extends IBasicForm {
  handleCascader?: (value: any) => void; // select的联动onchange选择方法
  handleSwitch?: (value: { [K: string]: boolean }) => void; // switch的change方法
  initialValues?: Object;
}

export interface IHandler {
  onReset: (name?: string | Array<string>) => void;
  cleanCasItem: (name?: string | Array<string>) => void;
  submit: () => void;
}

const BasicForm = React.forwardRef<IHandler, IBasicFormProps>(
  ({ onSearch, loading = false, formDataModel, layout, handleCascader, initialValues, handleSwitch, onValuesChange }, ref) => {
    const lastItem = formDataModel[formDataModel.length - 1];
    const submitRef = useRef<HTMLElement>(null);

    const [form] = Form.useForm();
    const [timeAttr, setTimeAttr] = useState<any>({});
    const [preSelectName, setPreSelectName] = useState<string>(''); // input带前缀切换的 单个切换保存的key
    const [oldNewPreKey, setOldNewPreKey] = useState<{}>({}); // input带前缀切换的 存储上次切换的时候的key

    const handlePreSelectChange = (value: string, index: number) => {
      let oldKey: string = '';
      // 获取上一次的老的key，是通过现在的value去preSelect中找
      formDataModel
        ?.filter(item => Array.isArray(item?.preSelect) && item?.preSelect?.length > 0)
        ?.find(ele => {
          const preSelectItem = ele?.preSelect?.find(item => item?.value === value);
          if (preSelectItem) {
            oldKey = `${ele?.preSelect?.find(val => val?.value !== value)?.value}`;
          }
        });

      // 这块处理的是 防止 先切换了a查询，然后又切换了b，查询 再切换到a之后 就相当于没有切换过b，所以删掉上一个b
      if (oldNewPreKey[value]) {
        Reflect.deleteProperty(oldNewPreKey, value);
        setOldNewPreKey(oldNewPreKey);
      } else {
        // 默认的a->b的切换
        Object.assign(oldNewPreKey, { [oldKey]: value });
        setOldNewPreKey(oldNewPreKey);
      }
      // 更新单个的key
      setPreSelectName(value);
      // console.log('index', index);
    };

    /**
     * 一些基本的设置
     * @param values
     */
    const baseParams = (values: any) => {
      for (const key in values) {
        if (values[key] === '') {
          values[key] = undefined;
        }
        if (typeof values[key] === 'string') {
          values[key] = values[key].trim().replaceAll('，', ',');
        }
      }
      return values;
    };

    /**
     * 表单提交获取输入数据方法 这个方法太长了 考虑拆分一下
     * @param values 表单值
     */
    const onFinish = (values: any) => {
      let newValues = baseParams(values);
      // 这块是将时间name转为开始时间和结束时间的时间戳
      formDataModel &&
        formDataModel.forEach(item => {
          if (Reflect.has(item, 'timeKey')) {
            // 初始化一个空的时间段 从form页面解构需要的key
            const [timeStart, timeEnd] = item.timeKey || [];

            // 有默认时间的话直接给默认时间
            const [start, end] = initialValues ? (initialValues[item?.name!] ? initialValues[item?.name!] : []) : [];

            // 有时间的时候处理，没有时间undefined
            const time = {
              [timeStart]: start ? moment(start).valueOf() / 1000 : undefined,
              [timeEnd]: end ? moment(end).valueOf() / 1000 : undefined,
            };
            Object.assign(newValues, time);

            // 如果选择了时间，先赋值再删key
            if (Object.keys(timeAttr).length) {
              Object.assign(newValues, timeAttr[item?.name!]);
              Reflect.deleteProperty(newValues, item?.name!);
            } else {
              // 否则直接删key
              Reflect.deleteProperty(newValues, item?.name!);
            }
          }
          // 对输入框前边选择的那个字段做处理
          if (Reflect.has(item, 'preSelect')) {
            // 如果是替换字段
            if (item.isReplaceName) {
              // 先删掉老的
              item?.name && Reflect.deleteProperty(newValues, item?.name);
              // 再获取新的数据 赋值
              newValues = {
                ...newValues,
                [oldNewPreKey[item?.name!] || item?.name]: form.getFieldValue(item?.name!),
              };
            } else {
              // 这里就是查询了带着数据去查询，不做替换字段处理
              let selectedValue = preSelectName
                ? {
                    [preSelectName]: newValues[item?.name!],
                  }
                : {
                    [item?.name!]: newValues[item?.name!],
                  };
              /**
               * 肯定有一个默认值但是又检测不到，所以就判断一下选择词里有没有&特殊符号，有的话没问题
               * 没有肯定是初始化的，所以就直接取item.preSelect[0].value
               */
              const [sKey, sVal] = Object.entries(selectedValue)[0];

              if (sKey.includes('&')) {
                const [preKey, valtype, preVal] = sKey.split('&');
                selectedValue = {
                  [item?.name!]: sVal,
                  [preKey]: valtype === 'number' ? +preVal : preVal,
                };
              } else {
                const [preKey, valtype, preVal] = Array.isArray(item?.preSelect)
                  ? typeof item?.preSelect[0]?.value === 'string'
                    ? item?.preSelect[0]?.value.split('&')
                    : []
                  : [];
                if (preKey) {
                  selectedValue = {
                    ...selectedValue,
                    [preKey]: valtype === 'number' ? +preVal : preVal,
                  };
                }
              }
              newValues = { ...newValues, ...selectedValue };
            }
          }
        });
      // return false;
      onSearch && onSearch(baseParams(newValues));

      /**
       * 这里让刚刚点击完查询或者确认的按钮失去焦点
       * 一个案例是：在领任务的页面需要快捷键ctrl+enter来提交结论，如果不让领取任务之后的确定按钮失去焦点，
       * 按快捷键的时候因为聚焦在刚在领任务的按钮上，会导致相当于再次点击提示结束审核
       */
      setTimeout(() => {
        submitRef?.current?.blur();
      }, 20);
    };

    /**
     * 其实是在清除数据之前先根据name form.getFieldValue(name)获取数据保存起来，
     * 然后所有都清除，最后再重新利用form.setFieldsValue把刚刚需要保留的数据重新设置
     * @param name 传入的不被清除的字段
     * @returns
     */
    const resetNameFilter = (name?: string | Array<string>) => {
      let protectdValue = {};
      /**
       * 当在顶级组件利用ref调用onReset方法的时候，如果没有传递参数，就按照formDataModel中
       * 配置的protectd字段来保持数据不被清除
       * 否则按照name来执行
       */
      if (!name) {
        formDataModel &&
          formDataModel.forEach((item: any) => {
            if (item.protected) {
              Object.assign(protectdValue, { [item.name]: form.getFieldValue(item.name) });
            }
          });
      } else {
        if (typeof name === 'string') {
          Object.assign(protectdValue, {
            [name]: form.getFieldValue(name),
          });
        } else {
          name.forEach(item => {
            Object.assign(protectdValue, {
              [item]: form.getFieldValue(item),
            });
          });
        }
      }
      return protectdValue;
    };

    /**
     * 清除数据现在支持两种方法，
     * onReset：是reset之前先存下需要保存的数据，再reset然后在重新赋值，参数是需要保护的数据的name
     * cleanCasItem: 是直接将对应的数据清除掉，参数是需要清除的数据的name
     */

    /**
     * 重置方法
     * 支持protectd字段和name两种方式
     * 如果在reset方法里传递指定的不需要清除的字段，则按照传递的字段优先级走
     * 否则就是按照protectd字段
     */
    const onReset = (name?: string | Array<string>) => {
      // 先将旧的数据存起来，再清除所有的，然后再赋值被保护的数据
      let protectdValue = resetNameFilter(name);
      form.resetFields();
      setTimeAttr({});
      // 重新将保留的数据赋值
      for (const key in protectdValue) {
        if (Object.prototype.hasOwnProperty.call(protectdValue, key)) {
          const element = protectdValue[key];
          form.setFieldsValue({ [key]: element });
        }
      }
    };

    /**
     * 清除联动数据
     */
    const cleanCasItem = (name?: string | string[]) => {
      if (name) {
        if (Array.isArray(name)) {
          name.forEach(item => {
            form.setFieldsValue({ [item]: undefined });
          });
        } else {
          form.setFieldsValue({ [name]: undefined });
        }
      }
    };

    /**
     * 清除联动数据
     */
    const submit = () => {
      form.submit();
    };

    /**
     * 父组件执行表单子组件重置方法和清除数据的方法
     */
    useImperativeHandle(ref, () => ({
      onReset: onReset,
      cleanCasItem: cleanCasItem,
      submit: submit,
    }));

    const handleDate = (time: any) => {
      // 每次时间选择处理之后，存储用于在确认的时候做时间转换处理
      Object.assign(timeAttr, time);
      setTimeAttr(timeAttr);
    };

    /**
     * 渲染无按钮组的form item 拆分出来是为了避免form 嵌套 form
     */
    const renderItemExcludeButton = () => {
      return (
        <>
          {formDataModel.length > 0 &&
            formDataModel.map((item: any, index: number) => {
              return (
                <Fragment key={`${index}-${item.name}`}>
                  {(item.type === 'rangePicker' || item.type === 'datePicker') && (
                    <CustomsizeRangePicker dateProps={item} handleDate={time => handleDate(time)} />
                  )}
                  {item.type === 'switch' && <CustomsizeSwitch switchProps={item} handleChange={v => item.onChange(v, handleSwitch)} />}
                  {(item.type === 'select' || item.type === 'multiple') && (
                    /**
                     * item.onChange接受页面使用组件的时候传递的change事件，先将handleChange获取的数据 传递给formModel
                     * formModel 处理的逻辑很简单，就是拼接下一个需要联动的key和当前选中的值 也就是联动规则
                     * 最后通过callback回传到页面的函数接受参数拿到联动规则 处理
                     */
                    <CustomsizeSelect selectProps={item} handleChange={v => item.onChange(v, handleCascader)} />
                  )}

                  {/* handlePreSelectChange 直接将CustomsizeInput组件获取的数据暴露出接口供页面 handlePreSelectChange 使用 */}
                  {(item.type === 'text' || item.type === 'textArea' || item.type === 'inputNumber') && (
                    <CustomsizeInput inputProps={item} onPreSelectChange={(v: string) => handlePreSelectChange(v, index)} />
                  )}

                  {/* 级联 */}
                  {item.type === 'cascader' && <CustomsizeCascader cascaderProps={item} handleChange={v => item.onChange(v, handleCascader)} />}

                  {/* 渲染业务组件单独封装的有自定状态的 formjson里通过React.createElement创建组件在这里渲染 */}
                  {item.type === 'component' && item.renderComponent}
                </Fragment>
              );
            })}
        </>
      );
    };

    return (
      <>
        <Form
          form={form}
          name="search-form"
          layout={layout || 'inline'}
          {...layouts}
          onFinish={onFinish}
          initialValues={initialValues || {}}
          onValuesChange={onValuesChange}
        >
          {renderItemExcludeButton()}
          <Form.Item className="btn-group">
            <Button
              name={lastItem?.buttonName || 'default-button'}
              type="primary"
              htmlType="submit"
              danger={lastItem?.disabled || false}
              // loading={lastItem?.loading || false}
              loading={loading}
              ref={submitRef}
            >
              {lastItem.label}
            </Button>
            <Button onClick={() => onReset()} disabled={lastItem.disabled || false}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  },
);

export default BasicForm;
