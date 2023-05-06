import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { Card, Modal, message, Menu, Dropdown, Button, Space, Result, Input } from 'antd';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import { CopyOutlined } from '@ant-design/icons';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import fetchAsyncRes from '@/components/BusinessLogic/fetchAsyncRes';
import BasicForm from '@/components/Smart/BasicForm';
import Iconfont from '@/components/Dumb/Iconfont';
import initModalModel from './model/modalModel';
import initFormModel from './model/formModel';
import getColumns from './model/tableColumns';
import CopyButton from './model/copyButton';

import {
  fetchWhitelistManagementList,
  addWhitelistManagement,
  excelWhitelistManagement,
  updateWhitelistManagement,
  mutipleWhitelistManagement,
} from '@/services/featureContent';
import { ConnectState, SynchronizeState } from '@/models/connect';
import { handleExportExcel } from '@/utils/exportExcelModel';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import appConfig from '@/config/app.config';
import { BaseFormModelType } from '@/types';

import './index.less';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';

interface IWhitelistManagement {}
const WhitelistManagement: React.FC<IWhitelistManagement> = ({}) => {
  // 新增-textarea | 从Excel导入-upload
  const addOrExcelType = useRef('textarea');

  const dispatch = useDispatch();
  const synchronizeState = useSelector<ConnectState, SynchronizeState>(state => state?.synchronizeState);

  const pageSize = 20;
  // 捕获 BasicSelector 联动选择的数据
  const handleCascaderList = (val: any) => {
    const newFormModel = resetFormModel.slice();
    newFormModel.forEach((element: any) => {
      if (element?.name && val[element?.name!]) {
        element.sourceData = val[element?.name!];
      }
    });
    setResetFormModel(newFormModel);
  };

  // 新增 | 编辑 弹窗内 业务、子业务级联逻辑
  const handleModalCascaderList = (val: any) => {
    /**
     * 弹窗的表单数是需要依赖 是否有没有切换switch 的结果 switchStatus 来决定的 所以这里要用
     * initModalModel(isEdit, switchStatus, handleModalCascaderList) 而不是直接用初始化的 resetModalFormModel 变量
     */
    // @ts-ignores
    let newFormModel: BaseFormModelType[] = initModalModel(isEdit, switchStatusRef.current, handleModalCascaderList, addOrExcelType.current);

    newFormModel.forEach(element => {
      if (element?.name && val[element?.name!]) {
        element.sourceData = val[element?.name!];
      }
    });
    setResetModalFormModel(newFormModel);
  };

  const [isVisible, setIsVisible] = useState<boolean>(false); // 控制新增和修改的弹窗
  const [isVisibleFalse, setIsVisibleFalse] = useState<boolean>(false); //新增错误的弹窗
  const [isEdit, setIsEdit] = useState<boolean>(false); // 是否编辑状态
  const [errorData, setErrorData] = useState<any>({});
  // const [switchStatus, setSwitchStatus] = useState<boolean>(true); // 是否永久生效  默认 否
  // 是否永久生效  默认 否
  const switchStatusRef = useRef(true);

  // 查询 form 表单
  const [resetFormModel, setResetFormModel] = useState<any>(() => initFormModel(handleCascaderList));
  // 新增 | 编辑 form 表单
  const [resetModalFormModel, setResetModalFormModel] = useState<Array<BaseFormModelType>>(initModalModel(isEdit, true, handleModalCascaderList)); // 新增或编辑 弹窗表单

  const [modalFormInitValues, setModalFormInitValues] = useState<Object>({
    enableTime: true,
  });
  const [pagination, setPagination] = useState<IPagination>({
    size: pageSize,
  });
  const [rowData, setRowData] = useState<any>({}); // 存储表单行数据
  const [tableSelected, setTableSelected] = useState<string>('');
  const [tableSelectedRecord, setTableSelectedRecord] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [queryParams, setQueryParams] = useState<Object>({});

  const columns = getColumns({
    operation: [
      {
        title: '操作',
        key: 'operation',
        render: (rowItem: any) => {
          return (
            <>
              <Button name="编辑" type="link" onClick={() => handleItemEdit(rowItem)}>
                编辑
              </Button>
              <Button name="上线" type="link" onClick={() => handleChangeStatus(rowItem)}>
                {rowItem.isEnabled === 1 ? '下线' : '上线'}
              </Button>
            </>
          );
        },
      },
    ],
  });

  const fetchTableData = async (params?: any) => {
    const [err, data = [], pag = {}] = await fetchAsyncRes(() => fetchWhitelistManagementList({ pageNumber: 1, pageSize, ...params }));
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    } else {
      setPagination(pag);
      setTableData(data as any[]);
    }
  };

  const getAllowListUrl = (url: string) => {
    return `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${url}`;
  };

  const [loading, setLoading] = useState(false);
  // 新增 | 编辑 | excel批量
  const addUpdateData = async (params: any, isEdit: boolean) => {
    setLoading(true);
    const res: any = await requestAsyncRes(() =>
      isEdit
        ? updateWhitelistManagement({ id: rowData.id, ...params })
        : addOrExcelType.current === 'upload'
        ? excelWhitelistManagement({ ...params, objectType: 1 })
        : addWhitelistManagement({ ...params, objectType: 1 }),
    );
    setErrorData(res.data);
    if (res.errorno !== 0) {
      message.error(`请求失败，原因：${res.errorno}`);
      return false;
    } else {
      message.success(`${isEdit ? '更新' : '添加'}成功！`);
      if (!isEdit && res.data.errorNums !== 0) {
        setIsVisibleFalse(true);
      }
      setLoading(false);
      toggleModalStatus(false, false);
      setRowData({});
      fetchTableData(queryParams);
    }
  };

  const multipleUpdate = async (params: any) => {
    const [err] = await fetchAsyncRes(() => mutipleWhitelistManagement(params));
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    } else {
      message.success(`更新成功！`);
      fetchTableData(queryParams);
    }
  };

  /**
   * 切换状态
   * @param visible 弹窗显示
   * @param edit 是否编辑
   */
  const toggleModalStatus = (visible: boolean, edit: boolean) => {
    // 关闭之后需要把初始化的数据变为空
    !visible && setModalFormInitValues({});
    setIsVisible(visible);
    setIsEdit(edit);
  };

  /**
   * 编辑和新增共有的方法 切换打开弹窗和弹窗中表单的数据
   * @param rowItem
   * @param edit
   */
  const handleAddEditCommonState = (rowItem: any, edit: boolean) => {
    setModalFormInitValues({ ...rowItem, enableTime: true }); // 初始化数据
    // @ts-ignore
    setResetModalFormModel(initModalModel(edit, true, handleModalCascaderList, addOrExcelType.current));
    toggleModalStatus(true, edit);
  };

  // 编辑按钮
  const handleItemEdit = (rowItem: any) => {
    setRowData(rowItem);
    // 显示时间
    rowItem.operationTime = [moment(rowItem.startTime, DATE_FORMAT_SS), moment(rowItem.endTime, DATE_FORMAT_SS)];
    handleAddEditCommonState(rowItem, true);
  };

  // 新增按钮
  const handleItemAdd = () => {
    addOrExcelType.current = 'textarea';
    handleAddEditCommonState({}, false);
  };

  // 从Excel导入
  const handleItemUpload = () => {
    addOrExcelType.current = 'upload';
    handleAddEditCommonState({}, false);
  };

  // 更新切换白名单状态
  const handleChangeStatus = (rowItem: any) => {
    const params = {
      isEnabled: 0,
      description: '',
      startTime: '',
      endTime: '',
      id: 0,
      objectId: '',
    };
    for (const key in params) {
      const element = rowItem[key];
      params[key] = element;
      params.isEnabled = rowItem.isEnabled === 1 ? 0 : 1;
    }
    addUpdateData(params, true);
    // setModalFormInitValues(params);
  };

  // 点击查询
  const handleBasicFormSearch = (value: any) => {
    const { type, businessId, businessUnitId } = value;
    const mustParams = [type, businessId, businessUnitId];
    if (mustParams.includes(undefined)) {
      message.warning('请选择完整条件！');
      return false;
    }
    setQueryParams(value);
    fetchTableData(value);
  };

  // 页码改变
  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    fetchTableData({ pageNumber: page, pageSize: size, ...queryParams });
  };

  // 编辑和新增 接口调用方法
  const handleModalFormSearch = (value: any) => {
    let params: any = {};
    if (!isEdit) {
      // 新增
      if (addOrExcelType.current === 'textarea') {
        if (synchronizeState?.webExcelData.length === 0) {
          message.warning('词内容为必填项！', 5);
          return false;
        } else {
          const { webExcelData } = synchronizeState;
          // console.log('webExcelData', webExcelData);
          if (typeof value.startTime === 'number') {
            value.startTime = moment(value.startTime, DATE_FORMAT_SS);
          }
          if (typeof value.endTime === 'number') {
            value.endTime = moment(value.endTime, DATE_FORMAT_SS);
          }
          // Object.assign(params, value, { content: webExcelData });
          Object.assign(params, value, { objectId: webExcelData });
        }
      }
      // excel导入
      if (addOrExcelType.current === 'upload') {
        // console.log('params & value', params, value);
        // console.log(value.xlsxFile.fileList);
        if (value.xlsxFile?.fileList.length > 0) {
          Object.assign(params, value);
        } else {
          message.warning('点击或拖拽文件到该区域进行上传，支持xls,xlsx,csv格式文件的上传');
          return false;
        }
      }
    } else {
      // 编辑
      Object.assign(params, value, {
        type: rowData.type,
        businessId: rowData.businessId,
        businessUnitId: rowData.businessUnitId,
      });
      const deleteKeys = ['businessName', 'businessUnitName', 'typeDescription'];
      deleteKeys.forEach(item => {
        Reflect.deleteProperty(params, item);
      });
    }
    const { enableTime, ...others } = params;
    addUpdateData(others, isEdit);
  };

  /**
   * 批量选择切换状态
   * @param status
   */
  const handleMultipleChangeStatus = (status: number) => {
    if (!tableSelected) {
      message.warning('请选择列表数据！');
      return false;
    }
    const params = {
      isEnabled: status,
      ids: tableSelected.split(','),
    };
    multipleUpdate(params);
  };

  const exportToExcel = () => {
    handleExportExcel(tableData, synchronizeState.currentBreadcrumb, `${appConfig.MANUAL_AUDIT_URL}/admin/object/allow/list/query`, queryParams);
  };

  /**
   * 表格多选触发事件
   * @param value
   * @param record
   */
  const handleRowSelectionCallbackFn = (value: string, record: any[]) => {
    setTableSelected(value);
    setTableSelectedRecord(record);
  };

  /**
   * 弹窗滑块 切换 需要处理很多下拉菜单的状态问题
   * @param value
   */
  const handleSwitchChange = (value: { [K: string]: boolean }) => {
    const { isEnabledTime } = value;
    // setSwitchStatus(isEnabledTime);
    switchStatusRef.current = isEnabledTime;
    // 如果 false
    if (!isEnabledTime) {
      const newData = resetModalFormModel.filter(item => {
        if (item.type !== 'rangePicker') {
          return item;
        }
      });
      setResetModalFormModel(newData);
    } else {
      // 找出上一次 切换之前下拉菜单的数据
      const businessUnitNameItem = resetModalFormModel.find(item => {
        if (item.name === 'businessUnitId') {
          return item;
        }
      });

      // 重新给新的数据赋值
      // @ts-ignore
      const initData = initModalModel(isEdit, isEnabledTime, handleModalCascaderList, addOrExcelType.current);
      initData.forEach(ele => {
        if (ele.name === 'businessUnitId') {
          ele.sourceData = businessUnitNameItem?.sourceData || [];
        }
      });
      setResetModalFormModel(initData);
    }
  };

  /**
   * 关闭弹窗的时候 重置数据
   */
  const handleModelClose = () => {
    toggleModalStatus(false, false);
    dispatch({
      type: 'synchronizeState/saveWebExcelData',
      payload: {
        webExcelData: [],
      },
    });
  };
  //关闭错误提示的弹窗
  const handleFalseClose = () => {
    setIsVisibleFalse(false);
  };
  // 失败的条数
  const renderErrordata = ({ errorNums, successNums, errorDetail }) => {
    return (
      <div>
        {errorDetail &&
          errorDetail.map((item: any) => {
            return <div key={item}>{item}</div>;
          })}
      </div>
    );
  };
  // 复制到粘贴板
  const rendercopy = ({ errorDetail }) => {
    let str = '';
    errorDetail &&
      errorDetail.forEach(element => {
        str += ' ' + element;
      });
    return str;
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleMultipleChangeStatus(1)}>上线</Menu.Item>
      <Menu.Item onClick={() => handleMultipleChangeStatus(0)}>下线</Menu.Item>
    </Menu>
  );
  return (
    <div className="main-content bus-conf">
      <Card bordered={false}>
        <BasicForm initialValues={{ objectType: 1 }} layout="inline" formDataModel={resetFormModel} onSearch={handleBasicFormSearch} />
      </Card>
      <Card bordered={false}>
        <div className="op-btn-group mb20">
          <Space>
            <Dropdown overlay={menu} arrow>
              <Button name="批量操作">
                <span className="mr20">批量操作</span>
                <Iconfont name="iconxiajiantou_huaban" />
              </Button>
            </Dropdown>
            <Button type="primary" name="新增内容词" onClick={() => handleItemAdd()}>
              新增内容词
            </Button>
            <Button type="primary" name="导出到Excel" onClick={exportToExcel}>
              导出到Excel
            </Button>
            <Button type="primary" name="从Excel导入" onClick={() => handleItemUpload()}>
              从Excel导入
            </Button>
          </Space>
          {/* <Button name="操作日志">
            <Link to="/systemManagement/operationLog">操作日志</Link>
          </Button> */}
        </div>
        <CustomizeTable
          rowSelection={true}
          columns={columns}
          data={tableData}
          rowKey="id"
          pagination={pagination}
          handleChange={handlePageChange}
          handleRowSelectionCallback={handleRowSelectionCallbackFn}
        />
      </Card>
      <Modal
        title={isEdit ? '编辑' : '新增'}
        visible={isVisible}
        footer={null}
        onCancel={handleModelClose}
        destroyOnClose={true}
        maskClosable={false}
        width={600}
      >
        <BasicForm
          initialValues={modalFormInitValues}
          layout="vertical"
          formDataModel={resetModalFormModel}
          onSearch={handleModalFormSearch}
          handleSwitch={handleSwitchChange}
          loading={loading}
        />
      </Modal>
      <Modal visible={isVisibleFalse} footer={null} onCancel={handleFalseClose} width={400} maskClosable={false}>
        <Card
          style={{ width: 300, height: 300, border: 0 }}
          title={
            <div>
              <div>
                {' '}
                <CheckCircleFilled style={{ color: 'rgb(114,191,64)' }} /> 成功{errorData.successNums}条
              </div>
              <div>
                {' '}
                <CloseCircleFilled style={{ color: 'rgb(237,91,86)' }} /> 失败{errorData.errorNums}条
              </div>
            </div>
          }
          extra={
            <CopyButton text={rendercopy(errorData)}>
              <CopyOutlined style={{ fontSize: 20 }} />
            </CopyButton>
          }
        >
          <div className="copyContainer">{renderErrordata(errorData)}</div>
        </Card>
      </Modal>
    </div>
  );
};

export default WhitelistManagement;
