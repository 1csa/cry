import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';

import { fetchPartitionConfigurationList, addPartitionBusiness, updatePartitionBusiness } from '@/services/businessConfiguration';
import Manager from '@/components/Modal/business/manager';
import BasisConfiguration, { IBCHandler } from '../BasisConfiguration';
import initFormModel from './viewmodel/formModel';
import initModalModel from './viewmodel/modalModel';
import getColumns from './viewmodel/tableColumns';
import { BaseFormModelType } from '@/types';

const PartitionConfiguration = () => {
  const basisConfRef = useRef<IBCHandler>(null);
  const [resetFormModel, setResetFormModel] = useState<BaseFormModelType[]>(() => initFormModel(handleCascaderList));
  const [resetFormModalModel, setResetFormModalModel] = useState<BaseFormModelType[]>(() =>
    initModalModel(false, handleModalModelCascaderList, handleInputNumberChange),
  );

  // 分区管理员 modal ==== begin
  const [visible, setVisible] = useState<boolean>(false);
  const [typeZoneId, setTypeZoneId] = useState<any>({});
  const toggleModalVisible = (rowItem: any) => {
    setVisible(!visible);
    const { businessUnitId, id: partzoneId } = rowItem;
    setTypeZoneId({ businessUnitId, partzoneId });
  };
  // const handleOk = () => {
  //   toggleModalVisible();
  // };
  const modalProps = {
    // visible: visible,
    onCancel: () => toggleModalVisible({}),
    // onOk: handleOk,
  };
  // 分区管理员 modal ==== end

  const columns = getColumns({
    operation: [
      {
        title: '操作',
        key: 'operation',
        render: (rowItem: any) => {
          return (
            <>
              <Button name="编辑" type="link" onClick={() => basisConfRef?.current?.handleItemEdit(rowItem, initModalModel(true))}>
                编辑
              </Button>
              <Button name="分区管理员" type="link" onClick={() => toggleModalVisible(rowItem)}>
                分区管理员
              </Button>
            </>
          );
        },
      },
    ],
  });

  // 捕获 BasicSelector 联动选择的数据
  function handleCascaderList(val: any) {
    const newFormModel = resetFormModel.slice();
    newFormModel.forEach(element => {
      if (val[element.name!]) {
        element.sourceData = val[element.name!];
      }
    });
    // 每次选择前边的数据 清除掉联动后面的选中 并且更新下拉菜单
    basisConfRef?.current && basisConfRef?.current?.handleResetForm!('businessUnitId');
    setResetFormModel(newFormModel);
  }

  function handleModalModelCascaderList(val: any) {
    const newFormModel = resetFormModalModel.slice();
    newFormModel.forEach(element => {
      if (val[element.name!]) {
        element.sourceData = val[element.name!];
      }
    });
    // // 每次选择前边的数据 清除掉联动后面的选中 并且更新下拉菜单 这里应该在 BasisConfiguration 里再暴露一个子方法是重置弹窗的
    // basisConfRef?.current && basisConfRef?.current?.handleResetForm!('businessUnitId');
    setResetFormModalModel(newFormModel);
  }

  /**
   * 审核时限（分钟）变动 提交延时（秒）的最大值需要 审核时限 * 60
   * @param value
   */
  function handleInputNumberChange(value: number | string | undefined) {
    if (typeof value === 'number') {
      const newFormModel = [...resetFormModalModel];
      newFormModel.forEach(element => {
        if (element.type === 'inputNumber' && element.name === 'delayTime' && element.inputNumber) {
          element.inputNumber.max = value * 60;
        }
      });
      setResetFormModalModel(newFormModel);
    } else {
      message.warning('请输入数字！');
    }
  }

  return (
    <>
      <BasisConfiguration
        ref={basisConfRef}
        initFormModel={resetFormModel}
        initModalModel={() => resetFormModalModel}
        columns={columns}
        fetchMainListFn={fetchPartitionConfigurationList}
        addConfFn={addPartitionBusiness}
        updateConfFn={updatePartitionBusiness}
        initModalFormValues={{ auditLevel: 1, auditTimeLimit: 8, isEnabledKey: 1, delayTime: 0 }}
      />

      {visible && <Manager modalProps={modalProps} type="part_zone" typeZoneId={typeZoneId} />}
    </>
  );
};

export default PartitionConfiguration;
