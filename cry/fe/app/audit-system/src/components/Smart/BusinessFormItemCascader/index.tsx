/**
 * 业务组件 联动 包括内容 所属业务、子业务、审核分区、审核阶段
 * 有需要注意的点 审核任务和历史的模块都需要这个业务组件 但是任务是需要定时刷新待审核数量、
 * 所以需要一个参数来控制是否需要开启定时刷新 而且还需要有一个disabled参数来控制 选择的禁用还是非禁用
 */
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { useDebounceFn } from 'ahooks';
import { message, Button } from 'antd';

import CustomsizeSelect from '@/components/Dumb/FormItem/CustomsizeSelect';
import { getSelectedItem, saveDropdownListInDva, setCascaderItem } from '@/components/BusinessLogic/common';

import { ConnectState, Dispatch, CommonLogicState, SynchronizeState } from '@/models/connect';
import formDataModel from './formModel';
import searchFormDataModel from './searchFormModel';
import formDataModelMultiple from './formModelMultiple';

type ddlChangeType = {
  [K: string]: number;
};

type SelectItemValue = (value: ddlChangeType) => void;

type TaskPropsType = {
  refreshCount: boolean;
  disabled: boolean; // 通过参数来控制是否需要禁用
  refsProps: any; // 转发 的REF
};

interface IBusinessFormItemCascaderProps {
  dispatch: Dispatch;
  commonLogic: CommonLogicState;
  synchronizeState: SynchronizeState;

  material_type: number[];
  isSearch: boolean; // 是查询的话就不需要数字
  multiProps?: Partial<TaskPropsType>; // 只要需要转发ref就需要这个参数
  callback?: (value: any, initFormModel: any) => void; // 这个参数是为了给历史列表回传一些数据 用于其他的联动
  needStage?: boolean;
  renderLevel?: number; // 渲染几层 subList 针对质检历史任务列表内容
  multiple?: boolean; // 子业务多选 多选时审核分区不可以存在
}

const BusinessFormItemCascader: React.FC<IBusinessFormItemCascaderProps> = ({
  commonLogic,
  dispatch,

  multiProps,
  material_type,
  isSearch,
  callback,
  needStage = true,
  renderLevel,
  multiple = false,
}) => {
  // 初始化form 将formData转换一下 后续需要更新
  const [initFormModel, setInitFormModel] = useState<any>([]);
  // isSearch ? (needStage ? searchFormDataModel : searchFormDataModel.slice(0, -1)) : needStage ? formDataModel : formDataModel.slice(0, -1),

  useEffect(() => {
    const formModel = multiple
      ? formDataModelMultiple
      : isSearch
      ? needStage
        ? searchFormDataModel
        : searchFormDataModel.slice(0, -1)
      : needStage
      ? formDataModel
      : formDataModel.slice(0, -1);
    setInitFormModel(formModel);
  }, []);

  // 每次select组件onchange之后选择的value 集合 用来做联动
  const [ddlChangeValue, setDdlChangeValue] = useState<ddlChangeType>({});
  const formItemName: string[] = initFormModel.map((item: any) => item.name);

  /**
   * 因为定时器任务在发请求的时候会执行两次，利用防抖函数包一层减少不必要的请求
   */
  const { run } = useDebounceFn(() => initBussinessId(), {
    wait: 200,
  });

  const initBussinessId = async () => {
    const key = isSearch ? 'businessId' : 'business_type';
    try {
      let obj = {
        [key]: getSelectedItem(await saveDropdownListInDva(dispatch, material_type, isSearch ? 0 : 1)),
      };
      const formModel = setCascaderItem(initFormModel, obj);
      const resultFormModel: any[] = [];
      formModel.forEach((item, index) => {
        if (typeof renderLevel === 'number') {
          index < renderLevel && resultFormModel.push(item);
        } else {
          resultFormModel.push(item);
        }
      });
      // setInitFormModel(setCascaderItem(initFormModel, obj));
      setInitFormModel(resultFormModel);
    } catch (error) {
      // @ts-ignore
      message.error(error);
    }
  };

  /**
   * 联动
   * @param value 每次获取的数据
   */
  const handleCascader = async (value: Parameters<SelectItemValue>[0]) => {
    // console.log('ddlChangeValue', ddlChangeValue, value, formItemName);

    /**
     * onReset接受一个数组或者字符串，在清除的时候，保留传入的name的数据不被清掉
     * 先将表单所有的name获取，然后选择了哪个，哪个后面的数据就需要被清掉，如果有三个，选了☝第二个，前两个保留，第三个清除
     * 所以复制0～当前项的数据的name存在数组中[]，作为保留项目传给onReset，在底层而不被清除
     */
    if (Object.keys(ddlChangeValue).length) {
      const selectedKey = Object.keys(value)[0];
      if (formItemName.find(e => e === selectedKey)) {
        const idx = formItemName.findIndex(e => e === selectedKey);
        const newArr = isSearch ? ['material_type', ...formItemName.slice(0, idx)] : formItemName.slice(0, idx);
        multiProps?.refsProps?.onReset(newArr);
      }
    }
    const { businessFormItemCascaderddl } = commonLogic;
    // 每次onchege都将之前改变都数据存起来
    setDdlChangeValue(Object.assign(ddlChangeValue, value));

    // 第一次 第二次都需要用之前选择了哪个的数据 不然无法选中后边的数据
    const fetchBusinessUnitList = (ddlObj: ddlChangeType, key: string) => {
      return Array.isArray(businessFormItemCascaderddl) && businessFormItemCascaderddl.find(element => element.id === ddlObj[key])?.subList;
    };
    // 用ddlChangeValue 先获取第一次选择的数据 再选择当次的数据
    const partZonesSubList = (key1: string, key2: string) =>
      fetchBusinessUnitList(ddlChangeValue, key1)?.find((ele: any) => ele.id === ddlChangeValue[key2])?.subList;
    if (isSearch) {
      let menuListObj = {
        businessUnitId: getSelectedItem(fetchBusinessUnitList(value, 'businessUnitId')),
        partitionId: getSelectedItem(partZonesSubList('businessUnitId', 'partitionId')),
      };
      setInitFormModel(setCascaderItem(initFormModel, menuListObj));
    } else {
      // 获取有审核阶段count的那个对象
      const auditLevelCountObj = partZonesSubList('business_unit_type', 'part_zones')?.find((ele: any) => ele.id === ddlChangeValue?.audit_level);
      let menuListObj = {
        business_unit_type: getSelectedItem(fetchBusinessUnitList(value, 'business_unit_type'), true),
        part_zones: getSelectedItem(partZonesSubList('business_unit_type', 'part_zones'), true),
      };

      setInitFormModel(setCascaderItem(initFormModel, menuListObj, auditLevelCountObj));
    }
    callback && callback(ddlChangeValue, initFormModel);
  };

  const reFetchCount = () => {
    multiProps?.refsProps?.onReset();
    run();
  };

  useEffect(() => {
    run();
  }, [material_type[0]]);

  return (
    // 这里选择直接用基础组件CustomsizeSelect 而不是basicform的原因是因为会导致一些意外的问题 比如form 嵌套form以及多余出来的按钮
    <>
      {initFormModel.length > 0 &&
        initFormModel.map((item: any, index: number) => {
          return (
            <Fragment key={`${index}-${item.name}`}>
              {(item.type === 'select' || item.type === 'multiple') && (
                <CustomsizeSelect disabled={multiProps?.disabled} selectProps={item} handleChange={v => item.onChange(v, handleCascader)} />
              )}
              {item.type === 'button' && (
                <Button name={item.label} style={{ marginRight: 10 }} onClick={reFetchCount} disabled={multiProps?.disabled}>
                  {item.label}
                </Button>
              )}
            </Fragment>
          );
        })}
    </>
  );
};

export default connect(({ commonLogic, synchronizeState }: ConnectState) => ({
  commonLogic,
  synchronizeState,
}))(BusinessFormItemCascader);
