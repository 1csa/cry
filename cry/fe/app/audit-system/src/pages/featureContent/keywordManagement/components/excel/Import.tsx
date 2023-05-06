import React, { useState } from 'react';
import moment from 'moment';

import { message, Modal } from 'antd';

import BasicForm from '@/components/Smart/BasicForm';
import Result from './Result';

import initModalModel from '../../model/excel';
import { formatDate } from '../../model/utils';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { BaseFormModelType } from '@/types';
import { formateTime } from '@/utils/dev_helper';

import { addKeyWordsByExcel } from '@/services/featureContent';

const forever = [formatDate(new Date()), formatDate(new Date('2999-12-31 23:59:59'))];
const notForever = [formatDate(new Date()), moment(moment().add(1, 'M'), DATE_FORMAT_SS)];

interface IImportModal {
  visibleChange: () => void;
}

const ImportModal: React.FC<IImportModal> = ({ visibleChange }) => {
  const cancelHandle = () => {
    visibleChange();
  };

  const [resetModalFormModel] = useState<Array<BaseFormModelType>>(initModalModel()); // 新增或编辑 弹窗表单
  const [modalFormInitValues] = useState<Object>({
    time_range: 1,
    rangeDate: forever,
  });

  /**
   * 格式化参数
   * @param values
   */
  const formatParams = (values: any) => {
    values.time_range = values.time_range === 1 ? forever : values.rangeDate?.length === 2 ? values.rangeDate : notForever;
    const params = {
      ...values,
      startTime: formateTime(values.time_range[0]),
      endTime: formateTime(values.time_range[1]),
    };
    Reflect.deleteProperty(params, 'time_range');
    Reflect.deleteProperty(params, 'rangeDate');
    return params;
  };

  const [loading, setLoading] = useState(false);
  const submit = async (values: any) => {
    setLoading(true);
    const params: any = formatParams(values);
    setLoading(false);
    const response = await addKeyWordsByExcel(params);
    const { code, status, data } = response;
    if (code !== 200) {
      message.error(status);
      return;
    }
    setResultVisible(true);

    const { successNums, errorNums, repeatNums, total, errors } = data;
    const list: any = [];
    for (let key in errors) {
      list.push(errors[key]);
    }
    const keyWords = list.flat().map((item: any) => `${item.keyword}，${item.business}，${item.scene}`) ?? [];
    setResultProps({
      success: successNums,
      fail: errorNums,
      repeat: repeatNums,
      total,
      list: keyWords,
    });
  };

  const [resultVisible, setResultVisible] = useState(false);
  const resultVisibleChange = () => {
    setResultVisible(false);
    window.location.reload();
  };
  const [resultProps, setResultProps] = useState({
    success: 0,
    fail: 0,
    repeat: 0,
    total: 0,
    list: [],
  });

  return (
    <>
      <Modal title="从EXCEL导入" visible centered onCancel={cancelHandle} footer={null}>
        <BasicForm layout="vertical" initialValues={modalFormInitValues} formDataModel={resetModalFormModel} onSearch={submit} loading={loading} />
      </Modal>
      {resultVisible ? <Result {...resultProps} visibleChange={resultVisibleChange} /> : null}
    </>
  );
};

export default ImportModal;
