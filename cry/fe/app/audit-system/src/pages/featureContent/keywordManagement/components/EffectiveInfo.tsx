import React, { useState, useEffect } from 'react';
import { Popover, Radio, Skeleton } from 'antd';
import produce from 'immer';
import { actionType } from '../model/constants';
import { SelectOptionsType } from '@/types';
import { getArea, getBusiness } from '../model/utils';
import { compareFn } from '@/utils/dev_helper';

export type EffectKeyType = 'actionType' | 'businessId' | 'subId' | 'label';
export type EffectDataType = Omit<Record<EffectKeyType, number>, 'label'>;

interface InitEmptyArr {
  label: string;
  actionType: number;
}

interface ITableProps {
  editType: boolean;
  handleData: (data: EffectDataType[]) => void;
  initCellValue: any;
}

/**
 * 过滤数据返回到父组件 或这初始化的时候的数据
 * @param newState
 */
export const filterData = (newState: any[]) => {
  return newState
    ?.filter((item: any) => item.label)
    ?.map((ele: any) => {
      return {
        actionType: ele.actionType,
        businessId: ele.businessId,
        subId: ele.subId,
      } as EffectDataType;
    });
};

const EffectiveTable: React.FC<ITableProps> = ({ handleData, editType, initCellValue }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [subs, setSubs] = useState<any[]>([]);
  const [business, setBusiness] = useState<any[]>([]);

  /**
   * 渲染表头和表列的固定数据 横向sub 和 纵向business
   * @param tableHeader sub、business
   * @param flag 行还是列的标志
   */
  const renderHeaderCell = (tableHeader: any, flag: string) => {
    const topTitle =
      flag === 'row'
        ? [
            {
              value: '',
              label: '全部',
            },
            ...tableHeader,
          ]
        : tableHeader;
    return topTitle.sort(compareFn('value')).map((item: any, index: number) => {
      return (
        <div key={index + item.label + item.value} className={flag === 'row' ? 'row-title' : 'col-title'}>
          <Popover key={index + item.label} content={renderContent(item, index, true, flag)} title="请选择审核指令" trigger="hover">
            <div>{item.label}</div>
          </Popover>
        </div>
      );
    });
  };

  // 渲染审核指令的单选按钮
  const renderContent = (item: any, index: number, title: boolean = false, direction?: string) => {
    return (
      <Radio.Group
        options={actionType}
        onChange={event => (!title ? handleRadioChange(event, index) : handleTitleRadioChange(event, index, direction))}
        value={item.actionType}
        optionType="button"
        buttonStyle="solid"
      />
    );
  };

  /**
   * 更新数据
   * @param index cell的索引
   * @param e event
   * @param text 点击的Popover上的文字
   * @param subIdIndex 索引
   * @param businessIdIndex 索引
   */
  const updateNewData = (index: number, actionType: string, text: string, subIdIndex: number, businessIdIndex: number) => {
    // 点击审核指令之后更新数据
    return produce(dataSource, draft => {
      draft[index].actionType = actionType;
      draft[index].label = text === '无' ? '' : text;
      draft[index].subId = subs[subIdIndex].value;
      draft[index].businessId = business[businessIdIndex].value;
    });
  };

  const rowRender = (index: number, len: number, text: string, value: string) => {
    let newState = [];
    // 选择全部
    if (index === 0) {
      newState = produce(dataSource, draft => {
        draft.forEach((item: any, idx: number) => {
          item.actionType = value;
          item.label = text === '无' ? '' : text;
          item.subId = subs[idx % len].value;
          item.businessId = business[Math.floor(idx / len)].value;
        });
      });
    } else {
      // 选择对应的列
      newState = produce(dataSource, draft => {
        draft.forEach((item: any, idx: number) => {
          if ((idx % len) + 1 === index) {
            item.actionType = value;
            item.label = text === '无' ? '' : text;
            item.subId = subs[index - 1].value; // sub数据是从0开始
            item.businessId = business[Math.floor(idx / len)].value;
          }
        });
      });
    }
    return newState;
  };

  const colRender = (index: number, len: number, text: string, value: string) => {
    let newState = [];
    // 选择行
    // 列是从1开始因为第一行被titil占了0
    const colIndex = index + 1;
    // 行范围，必须前后都是闭区间 dataSource 数据是从0开始，所以赋值的时候要从0开始
    const [colRangeStart, colRangeEnd] = [(colIndex - 1) * len, colIndex * len - 1];
    newState = produce(dataSource, draft => {
      draft.forEach((item: any, idx: number) => {
        // 这里是顺序递增 一整行 只有idx 满足在区间范围之内才赋值
        if (idx >= colRangeStart && idx <= colRangeEnd) {
          item.actionType = value;
          item.label = text === '无' ? '' : text;
          // 如果是被整除，说明是和len相等，取subs数组最后一位，否则就按照余数取subs数据
          if (idx % len !== 0) {
            item.subId = subs[(idx % len) - 1].value;
          } else {
            item.subId = subs[len - 1].value;
          }
          item.businessId = business[index].value;
        }
      });
    });
    return newState;
  };

  /**
   * 当划过标题的时候 显示 然后点击触发事件
   * @param e event
   * @param index 标题的索引 从1开始
   */
  const handleTitleRadioChange = (e: any, index: number, direction?: string) => {
    // 找到cell里需要显示的文字
    const text: string =
      actionType.find((ele: SelectOptionsType) => {
        if (ele.value === e.target.value) {
          return ele;
        }
      })?.label ?? '';
    const len = subs.length;
    let newState = [];
    // 选择列
    if (direction === 'row') {
      newState = rowRender(index, len, text, e.target.value);
    } else if (direction === 'col') {
      newState = colRender(index, len, text, e.target.value);
    }
    const eData: EffectDataType[] = filterData(newState);
    // console.log('eData', eData);
    handleData(eData);
    setDataSource(newState);
  };

  /**
   * 用于cell展示中文显示 点击审核指令的按钮
   * @param e
   * @param index
   */
  const handleRadioChange = (e: any, index: number) => {
    const text: string =
      actionType.find((ele: SelectOptionsType) => {
        if (ele.value === e.target.value) {
          return ele;
        }
      })?.label ?? '';
    /**
     * 计算行和列的索引
     * index 是从0开始的，数组的数据[subIdIndex,businessIdIndex]也是从零开始的
     * 行列都是从0开始因为是数组元素0开始
     * subIdIndex是列的索引从0开始到subs.length-1
     * businessIdIndex是行的索引
     * 看不懂的话画一个倒着的二维坐标系从左上角开始 x轴👉 y轴⬇️
     */
    // subIdIndex的是列 但是在坐标系里它是x轴的数据 0 1 2 3 4 5...
    const subIdIndex: number = index % subs.length;
    // businessIdIndex 是行 但是在坐标系里它是y轴的数据 0 1 2 3 4 5...
    const businessIdIndex: number = Math.floor(index / subs.length);

    // 点击审核指令之后更新数据
    const newState = updateNewData(index, e.target.value, text, subIdIndex, businessIdIndex);

    // 先处理数据，再callback传递回去
    const eData: EffectDataType[] = filterData(newState);

    handleData(eData);
    setDataSource(newState);
  };

  /**
   * 主要是回显数据 将接口返回的item放在数组对应的index上
   * @param fillArr 目标grid的数组
   * @param rowLen
   * @param subs
   * @param business
   */
  const editTypeCellSortTable = (fillArr: any[], rowLen: number, subs: any[], business: any[]) => {
    initCellValue?.actions?.forEach((item: any) => {
      // 通过数据选择索引
      item.subIndex = subs.findIndex(subItem => subItem.value === item.subId);
      item.businessIndex = business.findIndex(businessItem => businessItem.value === item.businessId);
      // 计算排序
      fillArr[item.businessIndex * rowLen + item.subIndex] = item;
    });
    return fillArr;
  };

  const initEffectiveData = (subs: any[], business: any[]) => {
    const colLen = business.length;
    const rowLen = subs.length;
    const def: InitEmptyArr = {
      label: '',
      actionType: -1,
    };
    let emptyArr: InitEmptyArr[] = new Array(rowLen * colLen).fill(def);
    let fillArr: any[] = [];
    if (editType) {
      fillArr = editTypeCellSortTable(emptyArr.slice(), rowLen, subs, business);
    } else {
      fillArr = emptyArr;
    }
    setDataSource(fillArr);
  };

  // 渲染更新数据的cell，附带点击弹出选择审核指令
  const renderContentPopoverCell = () => {
    return dataSource.map((item: any, index: number) => {
      return (
        <Popover key={index + item.label + item.actionType} content={renderContent(item, index, false)} title="请选择审核指令" trigger="click">
          <div className={`cell-item-${item.actionType === -1 ? 'null' : item.actionType}`}>{item.label}</div>
        </Popover>
      );
    });
  };

  useEffect(() => {
    Promise.all([getArea(), getBusiness()]).then((res: any) => {
      const [subs, business] = res;
      initEffectiveData(subs, business);
      setSubs(subs);
      setBusiness(business);
    });
  }, []);

  return (
    <Skeleton loading={!subs.length && !business.length} active paragraph={{ rows: 8 }}>
      <div className="cus-table">
        <div className="title">{renderHeaderCell(subs, 'row')}</div>
        <div className="table-content">
          <div className="cell-label">{renderHeaderCell(business, 'col')}</div>
          <div className="cell" style={{ gridTemplateColumns: `repeat(${subs.length}, minmax(110px, 1fr))` }}>
            {renderContentPopoverCell()}
          </div>
        </div>
      </div>
    </Skeleton>
  );
};
export default EffectiveTable;
