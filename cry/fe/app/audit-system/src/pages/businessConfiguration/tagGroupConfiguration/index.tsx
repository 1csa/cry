import React, { useRef } from 'react';
import Link from 'umi/link';
import { Button } from 'antd';

import { fetchTagGroupConfigurationList, addTagGroupBusiness, updateTagGroupBusiness } from '@/services/businessConfiguration';
import BasisConfiguration, { IBCHandler } from '../BasisConfiguration';
import initFormModel from './viewmodel/formModel';
import initModalModel from './viewmodel/modalModel';
import getColumns from './viewmodel/tableColumns';

interface ITagGroupConfiguration {}

const TagGroupConfiguration: React.FC<ITagGroupConfiguration> = () => {
  const basisConfRef = useRef<IBCHandler>(null);

  const columns = getColumns({
    operation: [
      {
        title: '操作',
        key: 'operation',
        render: (rowItem: any) => {
          return (
            <>
              <Button name="编辑" type="link" onClick={() => basisConfRef?.current?.handleItemEdit(rowItem)}>
                编辑
              </Button>
              <Button name="查看内容" type="link">
                <Link to={`/businessConfiguration/tagConfiguration?groupId=${rowItem.id}`}>查看内容</Link>
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
      initFormModel={initFormModel}
      initModalModel={() => initModalModel}
      columns={columns}
      fetchMainListFn={fetchTagGroupConfigurationList}
      addConfFn={addTagGroupBusiness}
      updateConfFn={updateTagGroupBusiness}
      initModalFormValues={{}}
    />
  );
};

export default TagGroupConfiguration;
