import React, { useRef } from 'react';
import { Button } from 'antd';

import { fetchTagConfigurationList, addTagBusiness, updateTagBusiness, deleteTagFn } from '@/services/businessConfiguration';
import BasisConfiguration, { IBCHandler } from '../BasisConfiguration';
import initFormModel from './viewmodel/formModel';
import initModalModel from './viewmodel/modalModel';
import getColumns from './viewmodel/tableColumns';

interface ITagConfiguration {}

const TagConfiguration: React.FC<ITagConfiguration> = () => {
  const basisConfRef = useRef<IBCHandler>(null);

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
              <Button name="删除" type="link" onClick={() => basisConfRef?.current?.handleDeleteTagGroupButton(rowItem)}>
                删除
              </Button>
            </>
          );
        },
      },
    ],
  });
  return (
    <BasisConfiguration
      ref={basisConfRef}
      initFormModel={initFormModel(Number(location.search.includes('groupId') && location.search.replace('?groupId=', '')))}
      initModalModel={() => initModalModel(false)}
      columns={columns}
      fetchMainListFn={fetchTagConfigurationList}
      addConfFn={addTagBusiness}
      updateConfFn={updateTagBusiness}
      deleteTagFn={deleteTagFn}
      initModalFormValues={{ sort: 99 }}
    />
  );
};

export default TagConfiguration;
