/**
 * 年华大小类
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';

import { Radio, Button, message } from 'antd';

import { fetchNianHuaCategoryMarkLabels } from '@/components/BusinessLogic/common/cascaderItems/categoryMarkLabelsItem';
import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import handleTaskSubmit from './handleTaskSubmit';

import { ICategoryMarkingState, ConnectState } from '@/models/connect';
import { isJSON } from '@/utils/dev_helper';

import './NianHuaMarkPanel.less';

type Types = 'label' | 'value';
type SelectOptions = Record<Types, string>;

// /**
//  * 打标 可多选
//  */
// const TagCheckbox: React.FC<{
//   title: string;
//   list: SelectOptions[];
//   value: Array<string | number>;
//   onChange: (checked: boolean, index: number) => void;
// }> = ({ title, list, value, onChange }) => {
//   return (
//     <div className="common-btn">
//       <h4 className="gray-color">{title}</h4>
//       {Array.isArray(list) &&
//         list.map((item, index) => (
//           <Tag.CheckableTag
//             key={index}
//             checked={value?.includes(item.value)}
//             onChange={checked => onChange(checked, index)}
//           >
//             {item.label}
//           </Tag.CheckableTag>
//         ))}
//     </div>
//   );
// };

/**
 * 打标 单选 & 必选
 */
const TagRadio: React.FC<{
  title: string;
  options: SelectOptions[];
  value: string | number;
  onChange: (event: any) => void;
}> = ({ title, options, value, onChange }) => {
  return (
    <div className="common-btn">
      <h4 className="gray-color">{title}</h4>
      <Radio.Group options={options} onChange={onChange} value={value} optionType="button" buttonStyle="solid" />
    </div>
  );
};

interface NianHuaMarkPanelProps {
  material: any; // 物料里的所有数据
  reloadCallBack: () => void;
  userReviewResult: string; // 人审结果 json对象 || null
}

const NianHuaMarkPanel: React.FC<NianHuaMarkPanelProps> = ({ material, reloadCallBack, userReviewResult }) => {
  const dispatch = useDispatch();
  const categoryMarking = useSelector<ConnectState, ICategoryMarkingState>(state => state?.categoryMarking);

  // 大小类数据
  const [categoryValue, setCategoryValue] = useState('');
  const handleCategoryChange = ({ target: { value } }: any) => {
    setCategoryValue(value);
  };

  // 提交
  const handleSubmit = () => {
    if (!categoryValue) {
      message.warning('请选择大小类！');
      return false;
    }
    handleSubmitApi(getTagsOptions());
  };

  // 获取大小类选择数据
  const getTagsOptions = () => {
    return {
      bigCategory: categoryValue,
    };
  };

  const handleSubmitApi = (labels: ReturnType<typeof getTagsOptions>) => {
    handleTaskSubmit([submitTaskParamsInAuditOperation(material, 3001, 'pass', [labels])], false, reloadCallBack);
  };

  const [options, setOptions] = useState([]);
  const fetchOptions = async () => {
    const nianHuaTags: any = await fetchNianHuaCategoryMarkLabels(dispatch, categoryMarking);
    setOptions(nianHuaTags);
  };

  const initValue = () => {
    const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult) : {};
    // 历史数据打过标签
    if (userResult?.labels && userResult?.labels?.length) {
      const bigCategory = userResult?.labels.length > 0 && userResult?.labels[0]?.bigCategory;
      setCategoryValue(bigCategory ?? '');
    }
  };

  useEffect(() => {
    fetchOptions();
    const { isHis } = sessionStorage;
    isHis === 'true' && initValue();
  }, []);

  return (
    <div id="nian-hua-mark">
      <h3>审核操作</h3>
      <div className="btn-group">
        <TagRadio title="内容大类" options={options} value={categoryValue} onChange={handleCategoryChange} />
      </div>
      <div className="btn-wrapper">
        <Button type="primary" onClick={handleSubmit} disabled={!categoryValue}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default NianHuaMarkPanel;
