import React, { useState, useEffect, useRef } from 'react';

import { Button, message } from 'antd';

import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import Modal, { ModalType } from '@/components/Dumb/CustomModal';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import AddModal from './add';

import { ManagerColumns } from './config';

import { managerList, managerAdd, managerDelete } from '@/services/systemManagement';

type systemProps = {
  modalProps: ModalType;
  type: 'part_zone' | 'unit_type'; // 分区管理员 | 子业务管理员
  typeZoneId: {
    businessUnitId: string | number;
    partzoneId?: string | number;
  }; // 子业务ID | 分区ID
};

const Manager: React.FC<systemProps> = ({ modalProps, type, typeZoneId }) => {
  // 业务： 子业务-0 | 分区-1
  const typeRef = useRef<number>(0);

  // 标题
  const [typeString, setTypeString] = useState<string>('');

  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    size: 20,
  });

  // 页码改变
  const handlePageChange = (current: PageChangeFnType[0], size: PageChangeFnType[1] = 20) => {
    query({ current, size });
  };

  useEffect(() => {
    switch (type) {
      case 'unit_type':
        typeRef.current = 0;
        setTypeString('子业务');
        break;
      case 'part_zone':
        typeRef.current = 1;
        setTypeString('分区');
        break;
      default:
        typeRef.current = -1;
        setTypeString('');
    }
    query();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Array<any>>([]);
  // 通过接口获取数据
  const query = async (newPagination?: { current: number; size: number }) => {
    if (typeZoneId) {
      const { current: pageNumber, size: pageSize } = newPagination || pagination;
      const { businessUnitId, partzoneId } = typeZoneId;
      const params: any = {
        type: typeRef.current,
        businessUnitId,
        // partzoneId,
        pageNumber,
        pageSize,
      };
      typeRef.current === 1 && (params.partzoneId = partzoneId);
      setLoading(true);
      const { errorno, data } = await requestAsyncRes(() => managerList(params));
      setLoading(false);
      if (errorno === 0) {
        // @ts-ignore
        const { data: list, countAll: total, page: current, size } = data;
        setList(list);
        setPagination({
          current,
          size,
          total,
        });
      }
    }
  };

  // 新增
  const add = async (email: string) => {
    const { businessUnitId, partzoneId } = typeZoneId;
    const requestData: any = {
      type: typeRef.current,
      businessUnitId,
      // partzoneId,
      email,
    };
    typeRef.current === 1 && (requestData.partzoneId = partzoneId);
    const { errorno } = await requestAsyncRes(() => managerAdd(requestData));
    if (errorno === 0) {
      toggleAddVisible();
      const { size } = pagination;
      handlePageChange(1, size);
    }
  };

  // 删除管理员
  const deleteManager = async (rowItem: any) => {
    const { id: operatorId } = rowItem;
    const { businessUnitId, partzoneId } = typeZoneId;
    const requestData: any = {
      type: typeRef.current,
      businessUnitId,
      operatorId,
      // partzoneId,
    };
    typeRef.current === 1 && (requestData.partzoneId = partzoneId);
    const { errorno } = await requestAsyncRes(() => managerDelete(requestData));
    if (errorno === 0) {
      const { size } = pagination;
      handlePageChange(1, size);
    }
  };

  const columns = [
    ...ManagerColumns,
    {
      title: '操作',
      render: (rowItem: any) => (
        <Button type="link" danger onClick={() => deleteManager(rowItem)}>
          删除
        </Button>
      ),
    },
  ];

  // 新增 modal ==== begin
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const toggleAddVisible = () => {
    setAddVisible(!addVisible);
  };
  const okCallback = (email: any) => {
    if (email === '') {
      message.error('请选择邮箱');
      return;
    }
    add(email);
  };
  const addModalProps = {
    onCancel: toggleAddVisible,
    onOk: okCallback,
  };
  // 新增 modal ==== end

  return (
    <>
      <Modal visible destroyOnClose {...modalProps} title={`编辑${typeString}管理员`} footer={null}>
        <Button type="primary" className="mb20" onClick={() => toggleAddVisible()}>
          新增
        </Button>
        <CustomizeTable
          size="small"
          columns={columns}
          data={list}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          scroll={{ x: 500 }}
          handleChange={handlePageChange}
        />
      </Modal>

      {addVisible && <AddModal modalProps={addModalProps} />}
    </>
  );
};

export default Manager;
