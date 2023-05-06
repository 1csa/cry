import React, { useEffect, useMemo, useState } from 'react';
import { Tag, Select, message, Button, Modal } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useFormikContext, useField } from 'formik';

import { useTempContext } from '@/hooks';
import { parseselect } from '@/utils';
import { catemapSelector, storedcatesSelector } from '@/selectors/editorpush';
import { saveStoredCates } from '@/services/accountService';

import './index.less';

interface CatesForm {
  name: string;
}

const default_cate: string = '';

export const CatesForm: React.FC<CatesForm> = React.memo(({ name }) => {
  const formik = useFormikContext();
  const temp = useTempContext();
  const [_, { value: cate }] = useField('cate');

  const catemap = useSelector(catemapSelector);
  const storedCates = useSelector(storedcatesSelector);

  const [storedCatemap, setStoredCatemap] = useState<Record<string, string>>({});
  const [selectedCate, setSelectedCate] = useState<string>(default_cate);

  const handleTagChange = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedCate(value);
    } else {
      setSelectedCate('');
    }
  };

  useEffect(() => {
    setSelectedCate(default_cate);
  }, [temp]);

  useEffect(() => {
    if (!cate) {
      setSelectedCate(default_cate);
    }
  }, [cate]) // 推送后清除数据用

  useEffect(() => {
    formik.setFieldValue(name, selectedCate);
  }, [selectedCate]);

  useEffect(() => {
    if (storedCates.length === 0) {
      setStoredCatemap({}); //当input框清空时 设置保存生效 不能直接return
      return;
    }

    let newCatemap = {};
    for (let item of storedCates) {
      newCatemap[item] = catemap[item];
    }
    setStoredCatemap(newCatemap);
  }, [storedCates, catemap]); // 接口返回速度不同，一个变量可能不准确

  return (
    <div className="cateform">
      <Select value={selectedCate} onChange={setSelectedCate}>
        {parseselect(catemap)}
      </Select>
      <div className="cateform-options">
        {Object.entries(storedCatemap).map(([value, label]) => (
          <Tag.CheckableTag key={value} checked={selectedCate === value} onChange={checked => handleTagChange(checked, value)}>
            {label}
          </Tag.CheckableTag>
        ))}
      </div>
    </div>
  );
});
/**
 * @returns 设置常用推送分类
 */
export const CateColModal: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const catemap = useSelector(catemapSelector);
  const storedCates = useSelector(storedcatesSelector);

  const [showCol, setShowCol] = useState<boolean>(false);
  const [colCates, setColCates] = useState<string[]>([]);

  useEffect(() => {
    setColCates(storedCates);
  }, [storedCates]); // didmount时 storedCates为空 得改下生命周期

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
        setShowCol(false);
      } else {
        throw new Error(saveRes.message);
      }
    } catch (err) {
      message.error(err.toString());
    }
  };

  return (
    <>
      <Button size="small" type="link" onClick={() => setShowCol(true)}>
        设置常用推送分类
      </Button>
      <Modal visible={showCol} title="设置常用推送分类" onCancel={() => setShowCol(false)} onOk={handleSaveConfirm}>
        <Select style={{ width: '80%' }} mode="multiple" allowClear value={colCates} onChange={setColCates}>
          {parseselect(catemap)}
        </Select>
      </Modal>
    </>
  );
});
