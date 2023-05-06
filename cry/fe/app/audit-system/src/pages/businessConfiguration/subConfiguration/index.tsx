import React, { useState, useRef } from 'react';
import { Button } from 'antd';

import { fetchSubConfigurationList, addSubBusiness, updateSubBusiness } from '@/services/businessConfiguration';
import Manager from '@/components/Modal/business/manager';
import BasisConfiguration, { IBCHandler } from '../BasisConfiguration';
import initFormModel from './viewmodel/formModel';
import initModalModel from './viewmodel/modalModel';
import getColumns from './viewmodel/tableColumns';
// import { BaseFormModelType } from '@/types';

interface ISubConfiguration {}

const SubConfiguration: React.FC<ISubConfiguration> = () => {
  // 捕获 BasicSelector 联动选择的数据
  const handleCascaderList = (val: any) => {
    // 数据复制的时候必须要把 handleCascaderList 函数传递进去不然会导致下一次再选择的时候callback丢失
    const newFormModel = initFormModel(handleCascaderList).slice();
    newFormModel.forEach(element => {
      if (val[element?.name!]) {
        element.sourceData = val[element?.name!];
      }
    });
    // 每次选择前边的数据 清除掉联动后面的选中 并且更新下拉菜单
    basisConfRef?.current && basisConfRef?.current?.handleResetForm!('businessUnitId');
    setResetFormModal(newFormModel);
  };

  const basisConfRef = useRef<IBCHandler>(null);
  const [resetFormModal, setResetFormModal] = useState<any>(() => initFormModel(handleCascaderList));
  // const [resetModalFormModal, setResetModalFormModal] = useState<Array<BaseFormModelType>>(() =>
  //   initModalModel(false),
  // );

  // 子业务管理员 modal ==== begin
  const [visible, setVisible] = useState<boolean>(false);
  const [typeZoneId, setTypeZoneId] = useState<any>({});
  const toggleModalVisible = (rowItem: any) => {
    setVisible(!visible);
    const { businessUnitId } = rowItem;
    setTypeZoneId({ businessUnitId });
  };
  // const handleOk = () => {
  //   toggleModalVisible();
  // };
  const modalProps = {
    // visible: visible,
    onCancel: () => toggleModalVisible({}),
    // onOk: handleOk,
  };
  // 子业务管理员 modal ==== end

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
              <Button name="子业务管理员" type="link" onClick={() => toggleModalVisible(rowItem)}>
                子业务管理员
              </Button>
            </>
          );
        },
      },
    ],
  });

  return (
    <>
      <BasisConfiguration
        ref={basisConfRef}
        initFormModel={resetFormModal}
        initModalModel={() => initModalModel(false)}
        columns={columns}
        fetchMainListFn={fetchSubConfigurationList}
        addConfFn={addSubBusiness}
        updateConfFn={updateSubBusiness}
        initModalFormValues={{}}
        tableRowKey="businessUnitId"
      />

      {visible && <Manager modalProps={modalProps} type="unit_type" typeZoneId={typeZoneId} />}
    </>
  );
};

export default SubConfiguration;
