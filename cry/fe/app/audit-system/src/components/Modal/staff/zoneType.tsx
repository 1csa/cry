import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'antd';

import CustomizeTable from '@/components/Smart/BasicTable/CustomizeTable';
import Modal, { ModalType } from '@/components/Dumb/CustomModal';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import { managerPermissionList, managerPermissionAdd, managerPermissionDelete } from '@/services/systemManagement';

import AddModal from './add';
import { ZoneTypeColumns } from './config';

type partZoneProps = {
  modalProps: ModalType;
  type: 'part_zone' | 'unit_type'; // 分区-part_zone | 子业务-unit_type
  pandoraId: string; // 分区ID | 子业务ID
};

const ZoneType: React.FC<partZoneProps> = ({ modalProps, type, pandoraId }) => {
  // 业务： 业务-0 | 分区-1
  const typeRef = useRef<number>(-1);

  // 标题
  const [typeString, setTypeString] = useState<string>('');
  // table rowKey
  const [rowKey, setRowKey] = useState<string>('businessUnitId');

  const defaultColumns = [
    ...ZoneTypeColumns,
    {
      title: '操作',
      render: (rowItem: any) => (
        <Button type="link" danger onClick={() => deletePermission(rowItem)}>
          删除
        </Button>
      ),
    },
  ];

  // 删除权限
  const deletePermission = async (rowItem: any) => {
    const { operatorId, businessUnitId, partzoneId } = rowItem;
    const { errorno } = await requestAsyncRes(() =>
      managerPermissionDelete({
        operatorId,
        businessUnitId,
        partzoneId,
        type: typeRef.current,
      }),
    );
    errorno === 0 && query();
  };

  const [columns, setColumns] = useState<any[]>(defaultColumns);

  useEffect(() => {
    switch (type) {
      case 'unit_type':
        typeRef.current = 0;
        setTypeString('子业务');
        setRowKey('businessUnitId');
        setColumns(columns.filter(item => item.dataIndex !== 'partzoneName'));
        break;
      case 'part_zone':
        typeRef.current = 1;
        setTypeString('分区');
        setRowKey('partzoneId');
        break;
      default:
        typeRef.current = -1;
        setTypeString('');
        setRowKey('businessUnitId');
    }
    query();
  }, []);

  // tree data 选中初始值
  const [initValue, setInitValue] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  // 列表数据
  const [list, setList] = useState([]);
  // 通过接口获取数据
  const query = async () => {
    if (pandoraId) {
      setLoading(true);
      const { errorno, data } = await requestAsyncRes(() => managerPermissionList({ pandoraId, type: typeRef.current }));
      setLoading(false);
      // @ts-ignore
      if (errorno === 0 && Array.isArray(data)) {
        setList(data as []);
        const ids = data.map((item: any) => {
          const { businessUnitId, businessUnitName, partzoneId, partzoneName } = item;
          if (typeRef.current === 0) {
            return `${businessUnitId}-${businessUnitName}`;
          } else if (typeRef.current === 1) {
            return `${partzoneId}-${partzoneName}`;
          }
        });
        // @ts-ignore
        setInitValue(ids);
      }
    }
  };

  // 新增
  const add = async (selectedIds: number[]) => {
    const { errorno } = await requestAsyncRes(() =>
      managerPermissionAdd({
        pandoraId,
        type: typeRef.current,
        ids: selectedIds,
      }),
    );
    if (errorno === 0) {
      toggleAddVisible();
      query();
    }
  };

  // 新增 modal ==== begin
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const toggleAddVisible = () => {
    setAddVisible(!addVisible);
  };
  const okCallback = (selectedIds: any) => {
    add(selectedIds);
  };
  const addModalProps = {
    onCancel: toggleAddVisible,
    onOk: okCallback,
  };
  // 新增 modal ==== end

  return (
    <>
      <Modal visible destroyOnClose {...modalProps} title={`编辑${typeString}权限`} footer={null}>
        <Button type="primary" className="mb20" onClick={() => toggleAddVisible()}>
          新增
        </Button>
        <CustomizeTable size="small" columns={columns} data={list} rowKey={rowKey} pagination={{}} loading={loading} scroll={{ x: 600 }} />
      </Modal>

      {addVisible && <AddModal modalProps={addModalProps} initValue={initValue} title={typeString} flag={typeRef.current} />}
    </>
  );
};

export default ZoneType;
