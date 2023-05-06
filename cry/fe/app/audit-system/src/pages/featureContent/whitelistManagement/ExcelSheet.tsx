/**
 * 本页面级组件是使用用那种 上边查询 中间有操作按钮 下边是表格 表格有编辑等
 */

import React, { useState } from 'react';
import { connect } from 'dva';
import ReactDataSheet from 'react-datasheet';

import { Button } from 'antd';

import 'react-datasheet/lib/react-datasheet.css';

import { Dispatch } from '@/models/connect';
interface IExcelSheet {
  dispatch: Dispatch;
}

// type contentLabel = 'objectId' | 'description';

const ExcelSheet: React.FC<IExcelSheet> = ({ dispatch }) => {
  const initExcelTable = (isInit: boolean) => {
    let arr = [];
    for (let i = 1; i <= 20; i++) {
      arr.push([
        { value: undefined, key: 'objectId' },
        { value: undefined, key: 'description' },
      ]);
    }
    if (isInit) {
      arr.unshift([
        { value: '媒体ID', key: 'objectId' },
        { value: '媒体名称', key: 'description' },
      ]);
    }
    return arr;
  };

  const [excelTable, setExcelTable] = useState<Array<any>>(initExcelTable(true));

  const addExcelLine = () => {
    setExcelTable([...excelTable, ...initExcelTable(false)]);
  };
  const deleteExcelLine = () => {
    setExcelTable(excelTable.slice(0, excelTable.length - 20));
  };

  const handleExcelChange = (changes: Array<any>) => {
    /**
     * 此步骤是用于将数据显示到面板里
     */
    const grid = excelTable.map(row => [...row]);
    changes.forEach(({ cell, row, col, value }) => {
      grid[row][col] = { ...grid[row][col], value };
    });
    setExcelTable(grid);

    /**
     * 此操作是将面板的数据格式化之后 存在dva中
     * 为何存在dva是每次excel的change dva可以监听到 存起来用于后期来传递给接口
     * 但是需要自己处理什么时候去将dva中这部分的数据[]
     */
    let filterContent = grid
      .map((item: Array<any>) => {
        return {
          [item[0].key]: item[0].value,
          [item[1].key]: item[1].value,
        };
      })
      .filter((ele: any, index: number) => {
        // 去表头
        if (index !== 0) {
          return ele?.objectId && ele?.description;
        }
      });

    dispatch({
      type: 'synchronizeState/saveWebExcelData',
      payload: {
        webExcelData: filterContent,
      },
    });
  };

  const cleanExcelData = () => {
    setExcelTable(initExcelTable(true));
    dispatch({
      type: 'synchronizeState/saveWebExcelData',
      payload: {
        webExcelData: [],
      },
    });
  };

  return (
    <>
      <div className="excel-op-panel">
        <span>
          <span style={{ color: 'red' }}>* </span>
          <span>词内容({excelTable.length - 1})行</span>
        </span>
        <Button type="primary" size="small" onClick={cleanExcelData}>
          清除所有录入内容
        </Button>
      </div>
      {excelTable.length ? (
        <div className="item-block">
          <ReactDataSheet
            data={excelTable}
            // 渲染value
            valueRenderer={(cell: any) => cell?.value}
            onCellsChanged={changes => handleExcelChange(changes)}
          />
          <div className="op-item-group">
            <Button size="small" onClick={addExcelLine}>
              增加20行
            </Button>
            <Button size="small" disabled={excelTable.length <= 20} onClick={deleteExcelLine}>
              删除20行
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default connect()(ExcelSheet);
