import React, { useEffect, useState } from 'react';
import { Button, Modal, Select as ASelect, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { Select, FormItem } from 'formik-antd';

import { parseselect } from '@/utils';

import { catemapSelector, storedcatesSelector } from '@/selectors/editorpush';
import { requiredValidate } from '@/validation/editorpush';
import { saveStoredCates } from '@/services/accountService';

// 推送分类：适配所有推送类型
export const CateFormItem: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const catemap = useSelector(catemapSelector);
  const storedCates = useSelector(storedcatesSelector);
  const validator = (value: string) => requiredValidate(value, '推送分类');

  const [showCol, setShowCol] = useState<boolean>(false);
  const [colCates, setColCates] = useState<string[]>([]);

  useEffect(() => {
    setColCates(storedCates);
  }, []);

  const handleSaveConfirm = async () => {
    if (colCates.join('') === storedCates.join('')) {
      return message.warning('收藏的分类未发生变化');
    }

    try {
      const saveRes = await saveStoredCates(colCates);

      if (saveRes.status === 'success') {
        dispatch({
          type: 'accountEnum/updateStoredCates',
          payload: { cates: colCates },
        });
        message.success('保存成功');
      } else {
        throw new Error(saveRes.message);
      }
    } catch (err) {
      message.error(err.toString());
    }
  };

  return (
    <>
      <FormItem className="form-item" name="cate" label="推送分类" required={true} validate={validator}>
        <div>
          <Select name="cate">{parseselect(catemap)}</Select>
        </div>
        <div></div>
      </FormItem>
      <Button size="small" type="link" onClick={() => setShowCol(true)}>
            设置常用分类
          </Button>
      <Modal visible={showCol} title="设置常用分类" onCancel={() => setShowCol(false)} onOk={handleSaveConfirm}>
        <ASelect style={{ width: '100%' }} mode="multiple" allowClear value={colCates} onChange={setColCates}>
          {parseselect(catemap)}
        </ASelect>
      </Modal>
    </>
  );
});
